// Motor de alocação e análise de investimentos

export interface UserProfile {
  name: string;
  age: number;
  monthlyIncome: number;
  investmentGoal: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long'; // curto (<2 anos), médio (2-5), longo (>5)
  riskTolerance: number; // 1-10
  hasEmergencyFund: boolean;
  hasInvestments?: boolean;
  hasDebts?: boolean;
  dependents?: number;
}

export interface AllocationResult {
  fixedIncome: number;
  stocks: number;
  crypto: number;
  suggestedAmount: number;
}

export interface MarketTrend {
  category: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  explanation: string;
}

export interface Order {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  category: string;
  amount: number;
  price: number;
  total: number;
  formattedOrder: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'stocks' | 'crypto' | 'economy' | 'international';
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
  imageUrl: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  asset: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
  potentialReturn: number;
  actionRequired: string;
  imageUrl: string;
}

// Calcula alocação baseada no perfil do usuário
export function calculateAllocation(profile: UserProfile): AllocationResult {
  let fixedIncome = 0;
  let stocks = 0;
  let crypto = 0;

  // Fórmula base: 100 - idade = % em renda variável
  const baseVariableIncome = Math.max(100 - profile.age, 20);

  // Ajusta baseado no objetivo
  let riskMultiplier = 1;
  switch (profile.investmentGoal) {
    case 'conservative':
      riskMultiplier = 0.6;
      break;
    case 'moderate':
      riskMultiplier = 1;
      break;
    case 'aggressive':
      riskMultiplier = 1.4;
      break;
  }

  // Ajusta baseado no horizonte
  let horizonMultiplier = 1;
  switch (profile.investmentHorizon) {
    case 'short':
      horizonMultiplier = 0.7;
      break;
    case 'medium':
      horizonMultiplier = 1;
      break;
    case 'long':
      horizonMultiplier = 1.3;
      break;
  }

  // Calcula alocação em ações
  stocks = Math.min(
    Math.round(baseVariableIncome * riskMultiplier * horizonMultiplier),
    80
  );

  // Alocação em cripto (mais arriscado)
  if (profile.riskTolerance >= 7 && profile.investmentGoal !== 'conservative') {
    crypto = Math.min(Math.round(stocks * 0.15), 15);
    stocks -= crypto;
  }

  // Resto em renda fixa
  fixedIncome = 100 - stocks - crypto;

  // Sugere valor mensal de investimento (10-20% da renda)
  const investmentRate = profile.hasEmergencyFund ? 0.2 : 0.1;
  const suggestedAmount = Math.round(profile.monthlyIncome * investmentRate);

  return {
    fixedIncome,
    stocks,
    crypto,
    suggestedAmount,
  };
}

// Simula análise de tendências de mercado
export function analyzeTrends(): MarketTrend[] {
  return [
    {
      category: 'Renda Fixa',
      trend: 'bullish',
      confidence: 85,
      explanation:
        'Com a taxa Selic em patamar elevado, títulos de renda fixa oferecem retornos atrativos com baixo risco. Ideal para reserva de emergência e objetivos de curto prazo.',
    },
    {
      category: 'Ações Brasileiras',
      trend: 'neutral',
      confidence: 65,
      explanation:
        'O mercado de ações brasileiro apresenta volatilidade moderada. Empresas de setores como energia e bancos mostram fundamentos sólidos. Recomendado para horizonte de médio a longo prazo.',
    },
    {
      category: 'Ações Internacionais',
      trend: 'bullish',
      confidence: 75,
      explanation:
        'Mercados globais, especialmente tecnologia nos EUA, apresentam tendência de alta. Diversificação internacional reduz risco cambial e aproveita crescimento global.',
    },
    {
      category: 'Criptomoedas',
      trend: 'neutral',
      confidence: 55,
      explanation:
        'Mercado cripto mantém alta volatilidade. Bitcoin e Ethereum consolidam-se como ativos digitais principais. Recomendado apenas para investidores com alta tolerância ao risco e horizonte longo.',
    },
  ];
}

// Gera ordens de exemplo baseadas na alocação
export function generateOrders(
  allocation: AllocationResult,
  profile: UserProfile
): Order[] {
  const orders: Order[] = [];
  const totalAmount = allocation.suggestedAmount;

  // Renda Fixa
  if (allocation.fixedIncome > 0) {
    const amount = (totalAmount * allocation.fixedIncome) / 100;
    orders.push({
      id: `order-${Date.now()}-1`,
      type: 'buy',
      asset: 'Tesouro Selic 2029',
      category: 'Renda Fixa',
      amount: 1,
      price: amount,
      total: amount,
      formattedOrder: `COMPRA: Tesouro Selic 2029 | Valor: R$ ${amount.toFixed(2)} | Tipo: Renda Fixa`,
    });
  }

  // Ações
  if (allocation.stocks > 0) {
    const amount = (totalAmount * allocation.stocks) / 100;
    const stockPrice = 28.5;
    const quantity = Math.floor(amount / stockPrice);
    
    orders.push({
      id: `order-${Date.now()}-2`,
      type: 'buy',
      asset: 'ITUB4',
      category: 'Ações',
      amount: quantity,
      price: stockPrice,
      total: quantity * stockPrice,
      formattedOrder: `COMPRA: ${quantity} ITUB4 @ R$ ${stockPrice.toFixed(2)} | Total: R$ ${(quantity * stockPrice).toFixed(2)}`,
    });
  }

  // Cripto
  if (allocation.crypto > 0) {
    const amount = (totalAmount * allocation.crypto) / 100;
    const btcPrice = 350000;
    const quantity = amount / btcPrice;
    
    orders.push({
      id: `order-${Date.now()}-3`,
      type: 'buy',
      asset: 'BTC',
      category: 'Cripto',
      amount: quantity,
      price: btcPrice,
      total: amount,
      formattedOrder: `COMPRA: ${quantity.toFixed(6)} BTC @ R$ ${btcPrice.toLocaleString('pt-BR')} | Total: R$ ${amount.toFixed(2)}`,
    });
  }

  return orders;
}

// Salva perfil no localStorage
export function saveProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('investmind_profile', JSON.stringify(profile));
  }
}

// Carrega perfil do localStorage
export function loadProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('investmind_profile');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

// Limpa perfil
export function clearProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('investmind_profile');
  }
}
