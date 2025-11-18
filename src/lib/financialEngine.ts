// Motor de controle financeiro e análise de gastos

export interface FinancialData {
  salaryDate: number; // dia do mês (1-31)
  monthlyIncome: number;
  fixedExpenses: FixedExpense[];
  variableExpenses: VariableExpense[];
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // dia do mês
  category: 'housing' | 'transport' | 'health' | 'education' | 'insurance' | 'other';
}

export interface VariableExpense {
  id: string;
  name: string;
  amount: number;
  category: 'food' | 'entertainment' | 'shopping' | 'health' | 'transport' | 'other';
  month: number; // mês (1-12)
  year: number;
}

export interface FinancialAnalysis {
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  totalExpenses: number;
  remainingBalance: number;
  savingsRate: number;
  expensesByCategory: CategoryExpense[];
  financialHealth: 'excellent' | 'good' | 'warning' | 'critical';
  recommendations: string[];
  investmentSuggestion: InvestmentSuggestion;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface InvestmentSuggestion {
  emergencyFund: number;
  emergencyFundMonths: number;
  investmentAmount: number;
  investmentPercentage: number;
  distribution: {
    fixedIncome: number;
    stocks: number;
    crypto: number;
  };
  tips: string[];
}

// Analisa dados financeiros e gera insights
export function analyzeFinancialData(data: FinancialData): FinancialAnalysis {
  // Calcula total de despesas fixas
  const totalFixedExpenses = data.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calcula total de despesas variáveis (últimos 3 meses)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const recentVariableExpenses = data.variableExpenses.filter((exp) => {
    const monthsDiff = (currentYear - exp.year) * 12 + (currentMonth - exp.month);
    return monthsDiff >= 0 && monthsDiff < 3;
  });

  const totalVariableExpenses = recentVariableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgVariableExpenses = recentVariableExpenses.length > 0 
    ? totalVariableExpenses / Math.min(3, recentVariableExpenses.length) 
    : 0;

  // Totais
  const totalExpenses = totalFixedExpenses + avgVariableExpenses;
  const remainingBalance = data.monthlyIncome - totalExpenses;
  const savingsRate = data.monthlyIncome > 0 
    ? (remainingBalance / data.monthlyIncome) * 100 
    : 0;

  // Agrupa despesas por categoria
  const categoryMap = new Map<string, number>();
  
  data.fixedExpenses.forEach((exp) => {
    const current = categoryMap.get(exp.category) || 0;
    categoryMap.set(exp.category, current + exp.amount);
  });

  recentVariableExpenses.forEach((exp) => {
    const current = categoryMap.get(exp.category) || 0;
    categoryMap.set(exp.category, current + (exp.amount / Math.min(3, recentVariableExpenses.length)));
  });

  const expensesByCategory: CategoryExpense[] = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({
      category: getCategoryLabel(category),
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: getCategoryColor(category),
    })
  ).sort((a, b) => b.amount - a.amount);

  // Determina saúde financeira
  let financialHealth: 'excellent' | 'good' | 'warning' | 'critical';
  if (savingsRate >= 30) financialHealth = 'excellent';
  else if (savingsRate >= 20) financialHealth = 'good';
  else if (savingsRate >= 10) financialHealth = 'warning';
  else financialHealth = 'critical';

  // Gera recomendações
  const recommendations = generateRecommendations(
    data,
    totalFixedExpenses,
    avgVariableExpenses,
    remainingBalance,
    savingsRate,
    expensesByCategory
  );

  // Sugestão de investimento
  const investmentSuggestion = generateInvestmentSuggestion(
    data.monthlyIncome,
    remainingBalance,
    savingsRate,
    financialHealth
  );

  return {
    totalFixedExpenses,
    totalVariableExpenses: avgVariableExpenses,
    totalExpenses,
    remainingBalance,
    savingsRate,
    expensesByCategory,
    financialHealth,
    recommendations,
    investmentSuggestion,
  };
}

// Gera recomendações personalizadas
function generateRecommendations(
  data: FinancialData,
  fixedExpenses: number,
  variableExpenses: number,
  remaining: number,
  savingsRate: number,
  categories: CategoryExpense[]
): string[] {
  const recommendations: string[] = [];

  // Análise de taxa de poupança
  if (savingsRate < 10) {
    recommendations.push(
      '🚨 Sua taxa de poupança está muito baixa. Tente reduzir despesas não essenciais para aumentar para pelo menos 10%.'
    );
  } else if (savingsRate < 20) {
    recommendations.push(
      '⚠️ Sua taxa de poupança está abaixo do ideal. Meta: 20-30% da renda para construir patrimônio.'
    );
  } else if (savingsRate >= 30) {
    recommendations.push(
      '✅ Excelente! Você está poupando mais de 30% da renda. Continue assim e considere aumentar investimentos.'
    );
  }

  // Análise de despesas fixas
  const fixedExpensesRate = (fixedExpenses / data.monthlyIncome) * 100;
  if (fixedExpensesRate > 50) {
    recommendations.push(
      '💡 Suas despesas fixas representam mais de 50% da renda. Considere renegociar contratos ou buscar alternativas mais econômicas.'
    );
  }

  // Análise por categoria
  const housingExpense = categories.find((c) => 
    c.category.toLowerCase().includes('moradia') || c.category.toLowerCase().includes('housing')
  );
  if (housingExpense && housingExpense.percentage > 30) {
    recommendations.push(
      '🏠 Gastos com moradia estão acima de 30% da renda. Avalie se é possível reduzir aluguel ou custos de manutenção.'
    );
  }

  const foodExpense = categories.find((c) => 
    c.category.toLowerCase().includes('alimentação') || c.category.toLowerCase().includes('food')
  );
  if (foodExpense && foodExpense.percentage > 20) {
    recommendations.push(
      '🍽️ Gastos com alimentação estão elevados. Considere cozinhar mais em casa e reduzir delivery/restaurantes.'
    );
  }

  const entertainmentExpense = categories.find((c) => 
    c.category.toLowerCase().includes('lazer') || c.category.toLowerCase().includes('entertainment')
  );
  if (entertainmentExpense && entertainmentExpense.percentage > 10) {
    recommendations.push(
      '🎮 Gastos com lazer estão acima de 10%. Busque opções gratuitas ou mais econômicas de entretenimento.'
    );
  }

  // Recomendação de reserva de emergência
  const emergencyFundMonths = (remaining * 6) / data.monthlyIncome;
  if (emergencyFundMonths < 3) {
    recommendations.push(
      '💰 Priorize construir uma reserva de emergência de 6 meses de despesas antes de investir valores maiores.'
    );
  }

  // Dica de organização
  if (data.fixedExpenses.length > 10) {
    recommendations.push(
      '📊 Você tem muitas despesas fixas. Considere consolidar serviços ou cancelar assinaturas não utilizadas.'
    );
  }

  return recommendations;
}

// Gera sugestão de investimento
function generateInvestmentSuggestion(
  income: number,
  remaining: number,
  savingsRate: number,
  health: string
): InvestmentSuggestion {
  // Calcula reserva de emergência (6 meses de despesas)
  const monthlyExpenses = income - remaining;
  const emergencyFundTarget = monthlyExpenses * 6;
  const emergencyFundMonths = 6;

  // Define quanto investir
  let investmentPercentage = 0;
  let investmentAmount = 0;

  if (savingsRate >= 30) {
    investmentPercentage = 20;
    investmentAmount = income * 0.2;
  } else if (savingsRate >= 20) {
    investmentPercentage = 15;
    investmentAmount = income * 0.15;
  } else if (savingsRate >= 10) {
    investmentPercentage = 10;
    investmentAmount = income * 0.1;
  } else {
    investmentPercentage = 5;
    investmentAmount = income * 0.05;
  }

  // Distribuição de investimentos baseada na saúde financeira
  let distribution = { fixedIncome: 70, stocks: 25, crypto: 5 };

  if (health === 'excellent') {
    distribution = { fixedIncome: 50, stocks: 40, crypto: 10 };
  } else if (health === 'good') {
    distribution = { fixedIncome: 60, stocks: 35, crypto: 5 };
  } else if (health === 'warning') {
    distribution = { fixedIncome: 80, stocks: 20, crypto: 0 };
  } else {
    distribution = { fixedIncome: 100, stocks: 0, crypto: 0 };
  }

  // Gera dicas personalizadas
  const tips: string[] = [];

  if (health === 'critical' || health === 'warning') {
    tips.push('🎯 Foque primeiro em construir sua reserva de emergência em Tesouro Selic ou CDB de liquidez diária.');
    tips.push('📈 Após ter 6 meses de despesas guardadas, comece a diversificar em ações e fundos.');
  } else {
    tips.push('💎 Com sua saúde financeira boa, você pode diversificar em ativos de maior retorno.');
    tips.push('📊 Considere aportes mensais automáticos para aproveitar o custo médio.');
  }

  tips.push(`💰 Meta: Investir R$ ${investmentAmount.toFixed(2)} por mês (${investmentPercentage}% da renda).`);
  
  if (distribution.crypto > 0) {
    tips.push('⚠️ Criptomoedas são de alto risco. Invista apenas o que pode perder.');
  }

  tips.push('🔄 Revise sua carteira a cada 3 meses e rebalanceie se necessário.');
  tips.push('📚 Continue estudando sobre investimentos para tomar decisões mais informadas.');

  return {
    emergencyFund: emergencyFundTarget,
    emergencyFundMonths,
    investmentAmount,
    investmentPercentage,
    distribution,
    tips,
  };
}

// Utilitários
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    housing: 'Moradia',
    transport: 'Transporte',
    health: 'Saúde',
    education: 'Educação',
    insurance: 'Seguros',
    food: 'Alimentação',
    entertainment: 'Lazer',
    shopping: 'Compras',
    other: 'Outros',
  };
  return labels[category] || category;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    housing: '#3b82f6',
    transport: '#10b981',
    health: '#ef4444',
    education: '#8b5cf6',
    insurance: '#f59e0b',
    food: '#ec4899',
    entertainment: '#06b6d4',
    shopping: '#f97316',
    other: '#6b7280',
  };
  return colors[category] || '#6b7280';
}

// Persistência
export function saveFinancialData(data: FinancialData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('investmind_financial', JSON.stringify(data));
  }
}

export function loadFinancialData(): FinancialData | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('investmind_financial');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function clearFinancialData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('investmind_financial');
  }
}
