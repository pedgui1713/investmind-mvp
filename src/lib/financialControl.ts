// Motor de análise financeira com IA

import { UserProfile } from './investmentEngine';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
}

export interface FinancialData {
  salaryDate: number;
  fixedExpenses: Expense[];
  variableExpenses: Expense[];
  monthlyIncome: number;
}

export interface DistributionItem {
  category: string;
  percentage: number;
  amount: number;
  description: string;
}

export interface FinancialTip {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

export interface FinancialAnalysis {
  healthScore: number; // 0-100
  summary: string;
  suggestedDistribution: DistributionItem[];
  tips: FinancialTip[];
  alerts: string[];
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
}

// Analisa as finanças e gera insights com IA
export function analyzeFinances(data: FinancialData, profile: UserProfile): FinancialAnalysis {
  const totalFixed = data.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalVariable = data.variableExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = totalFixed + totalVariable;
  const remaining = data.monthlyIncome - totalExpenses;
  const expenseRatio = (totalExpenses / data.monthlyIncome) * 100;

  // Calcula score de saúde financeira
  let healthScore = 100;
  
  // Penaliza se gastar mais de 70% da renda
  if (expenseRatio > 70) healthScore -= (expenseRatio - 70) * 2;
  
  // Penaliza se não tem reserva de emergência
  if (!profile.hasEmergencyFund) healthScore -= 15;
  
  // Penaliza se despesas variáveis são muito altas (>30% do total)
  const variableRatio = (totalVariable / totalExpenses) * 100;
  if (variableRatio > 30) healthScore -= 10;
  
  // Bonifica se tem saldo positivo significativo
  if (remaining > data.monthlyIncome * 0.3) healthScore += 10;
  
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Gera resumo
  let summary = '';
  if (healthScore >= 70) {
    summary = `Parabéns! Suas finanças estão saudáveis. Você gasta ${expenseRatio.toFixed(1)}% da sua renda e tem R$ ${remaining.toLocaleString('pt-BR')} disponível para investir e realizar objetivos.`;
  } else if (healthScore >= 40) {
    summary = `Suas finanças precisam de atenção. Você está gastando ${expenseRatio.toFixed(1)}% da sua renda. É importante reduzir despesas e criar uma reserva de emergência.`;
  } else {
    summary = `⚠️ Alerta! Suas despesas estão muito altas (${expenseRatio.toFixed(1)}% da renda). É urgente revisar seus gastos e cortar despesas não essenciais.`;
  }

  // Distribuição sugerida (Método 50/30/20 adaptado)
  const suggestedDistribution: DistributionItem[] = [];
  
  // Essenciais (50-60%)
  const essentialsPercentage = profile.hasEmergencyFund ? 50 : 60;
  suggestedDistribution.push({
    category: 'Despesas Essenciais',
    percentage: essentialsPercentage,
    amount: data.monthlyIncome * (essentialsPercentage / 100),
    description: 'Moradia, alimentação, transporte, saúde e contas básicas',
  });

  // Estilo de vida (20-30%)
  const lifestylePercentage = profile.hasEmergencyFund ? 30 : 20;
  suggestedDistribution.push({
    category: 'Estilo de Vida',
    percentage: lifestylePercentage,
    amount: data.monthlyIncome * (lifestylePercentage / 100),
    description: 'Lazer, entretenimento, hobbies e gastos pessoais',
  });

  // Investimentos (20%)
  const investmentPercentage = 20;
  suggestedDistribution.push({
    category: 'Investimentos',
    percentage: investmentPercentage,
    amount: data.monthlyIncome * (investmentPercentage / 100),
    description: 'Reserva de emergência, aposentadoria e objetivos de longo prazo',
  });

  // Gera dicas personalizadas
  const tips: FinancialTip[] = [];

  // Dica sobre reserva de emergência
  if (!profile.hasEmergencyFund) {
    tips.push({
      title: 'Crie sua Reserva de Emergência',
      description: 'Você ainda não tem uma reserva de emergência. Isso é fundamental para sua segurança financeira.',
      priority: 'high',
      action: `Comece guardando R$ ${(data.monthlyIncome * 0.1).toFixed(2)} por mês até atingir 6 meses de despesas (R$ ${(totalExpenses * 6).toLocaleString('pt-BR')})`,
    });
  }

  // Dica sobre gastos excessivos
  if (expenseRatio > 80) {
    tips.push({
      title: 'Reduza Suas Despesas Urgentemente',
      description: 'Você está gastando mais de 80% da sua renda. Isso deixa pouco espaço para emergências e investimentos.',
      priority: 'high',
      action: `Identifique despesas não essenciais e tente reduzir pelo menos R$ ${((totalExpenses - data.monthlyIncome * 0.7)).toFixed(2)}`,
    });
  }

  // Dica sobre investimentos
  if (remaining > 0 && profile.hasEmergencyFund) {
    const investmentAmount = remaining * 0.7; // 70% do que sobra
    tips.push({
      title: 'Invista Seu Dinheiro Disponível',
      description: `Você tem R$ ${remaining.toLocaleString('pt-BR')} disponível. Não deixe parado na conta corrente!`,
      priority: 'medium',
      action: `Invista pelo menos R$ ${investmentAmount.toFixed(2)} seguindo sua alocação personalizada no dashboard`,
    });
  }

  // Dica sobre despesas variáveis
  if (variableRatio > 40) {
    tips.push({
      title: 'Controle Suas Despesas Variáveis',
      description: 'Suas despesas variáveis estão muito altas. Isso dificulta o planejamento financeiro.',
      priority: 'medium',
      action: 'Tente transformar algumas despesas variáveis em fixas ou estabeleça um limite mensal',
    });
  }

  // Dica sobre categoria com maior gasto
  const categoryTotals = new Map<string, number>();
  [...data.fixedExpenses, ...data.variableExpenses].forEach((expense) => {
    const current = categoryTotals.get(expense.category) || 0;
    categoryTotals.set(expense.category, current + expense.amount);
  });

  const sortedCategories = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1]);
  if (sortedCategories.length > 0) {
    const [topCategory, topAmount] = sortedCategories[0];
    const topPercentage = (topAmount / totalExpenses) * 100;
    
    if (topPercentage > 40) {
      const categoryNames: { [key: string]: string } = {
        housing: 'Moradia',
        food: 'Alimentação',
        transport: 'Transporte',
        health: 'Saúde',
        education: 'Educação',
        entertainment: 'Lazer',
        bills: 'Contas',
        other: 'Outros',
      };

      tips.push({
        title: `Atenção aos Gastos com ${categoryNames[topCategory] || 'Outros'}`,
        description: `Você está gastando ${topPercentage.toFixed(1)}% do seu orçamento com ${categoryNames[topCategory] || 'outros gastos'}. Isso representa R$ ${topAmount.toLocaleString('pt-BR')}.`,
        priority: 'low',
        action: 'Avalie se há oportunidades de redução nesta categoria',
      });
    }
  }

  // Dica sobre perfil de investimento
  if (remaining > data.monthlyIncome * 0.2) {
    let investmentTip = '';
    switch (profile.investmentGoal) {
      case 'conservative':
        investmentTip = 'Como você tem perfil conservador, priorize Tesouro Selic e CDBs de bancos grandes.';
        break;
      case 'moderate':
        investmentTip = 'Com perfil moderado, diversifique entre renda fixa (60-70%) e ações de empresas sólidas (30-40%).';
        break;
      case 'aggressive':
        investmentTip = 'Seu perfil agressivo permite maior exposição a ações e até criptomoedas, mas sempre com diversificação.';
        break;
    }

    tips.push({
      title: 'Estratégia de Investimento Personalizada',
      description: investmentTip,
      priority: 'low',
      action: 'Confira sua alocação sugerida na aba "Alocação Sugerida" do dashboard',
    });
  }

  // Gera alertas
  const alerts: string[] = [];

  if (remaining < 0) {
    alerts.push(`⚠️ Você está gastando R$ ${Math.abs(remaining).toLocaleString('pt-BR')} a mais do que ganha! Revise urgentemente suas despesas.`);
  }

  if (!profile.hasEmergencyFund && remaining > 0) {
    alerts.push(`💡 Priorize criar sua reserva de emergência antes de investir em ativos de risco.`);
  }

  if (totalFixed > data.monthlyIncome * 0.6) {
    alerts.push(`⚠️ Suas despesas fixas representam ${((totalFixed / data.monthlyIncome) * 100).toFixed(1)}% da renda. Idealmente deveria ser no máximo 60%.`);
  }

  // Breakdown por categoria
  const categoryBreakdown = Array.from(categoryTotals.entries()).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalExpenses) * 100,
  }));

  return {
    healthScore: Math.round(healthScore),
    summary,
    suggestedDistribution,
    tips,
    alerts,
    categoryBreakdown,
  };
}

// Salva dados financeiros no localStorage
export function saveFinancialData(data: FinancialData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('investmind_financial_data', JSON.stringify(data));
  }
}

// Carrega dados financeiros do localStorage
export function loadFinancialData(): FinancialData | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('investmind_financial_data');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Limpa dados financeiros
export function clearFinancialData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('investmind_financial_data');
  }
}
