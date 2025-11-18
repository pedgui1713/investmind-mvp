'use client';

import { useState, useEffect } from 'react';
import OnboardingFlow from './components/OnboardingFlow';
import Dashboard from './components/Dashboard';
import {
  UserProfile,
  AllocationResult,
  MarketTrend,
  Order,
  NewsItem,
  Opportunity,
  calculateAllocation,
  analyzeTrends,
  generateOrders,
  saveProfile,
  loadProfile,
  clearProfile,
} from '@/lib/investmentEngine';

// Gera notícias simuladas
function generateNews(): NewsItem[] {
  const now = new Date();
  return [
    {
      id: 'news-1',
      title: 'Ibovespa fecha em alta de 1,2% impulsionado por setor bancário',
      summary: 'Ações de bancos lideram ganhos após anúncio de resultados trimestrais acima do esperado. Analistas recomendam manter posições.',
      category: 'stocks',
      impact: 'high',
      timestamp: new Date(now.getTime() - 15 * 60000),
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    },
    {
      id: 'news-2',
      title: 'Bitcoin ultrapassa R$ 350 mil com expectativa de aprovação de ETFs',
      summary: 'Criptomoeda principal registra valorização de 8% na semana. Investidores aguardam decisões regulatórias nos EUA.',
      category: 'crypto',
      impact: 'high',
      timestamp: new Date(now.getTime() - 45 * 60000),
      imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
    },
    {
      id: 'news-3',
      title: 'Banco Central mantém Selic em 11,75% ao ano',
      summary: 'Decisão unânime do Copom mantém taxa básica de juros. Renda fixa continua atrativa para investidores conservadores.',
      category: 'economy',
      impact: 'medium',
      timestamp: new Date(now.getTime() - 90 * 60000),
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    },
    {
      id: 'news-4',
      title: 'Petróleo em queda após aumento de produção da OPEP+',
      summary: 'Barril do petróleo tipo Brent recua 3,5% no mercado internacional. Ações de petroleiras brasileiras acompanham movimento.',
      category: 'international',
      impact: 'medium',
      timestamp: new Date(now.getTime() - 120 * 60000),
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    },
    {
      id: 'news-5',
      title: 'Dólar fecha em R$ 5,85 com fluxo positivo de investimentos',
      summary: 'Moeda americana registra queda de 0,8% frente ao real. Entrada de capital estrangeiro fortalece mercado brasileiro.',
      category: 'economy',
      impact: 'low',
      timestamp: new Date(now.getTime() - 180 * 60000),
      imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
    },
  ];
}

// Gera oportunidades simuladas
function generateOpportunities(): Opportunity[] {
  return [
    {
      id: 'opp-1',
      title: 'Tesouro IPCA+ 2035 com taxa atrativa',
      description: 'Título público oferece IPCA + 6,2% ao ano, ideal para proteção contra inflação e objetivos de longo prazo.',
      asset: 'IPCA+ 2035',
      category: 'Renda Fixa',
      riskLevel: 'low',
      potentialReturn: 12.5,
      actionRequired: 'Considere alocar parte da reserva de longo prazo',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    },
    {
      id: 'opp-2',
      title: 'VALE3 em ponto de entrada técnico',
      description: 'Ação da Vale apresenta suporte forte em R$ 62,50 com fundamentos sólidos e dividendos atrativos.',
      asset: 'VALE3',
      category: 'Ações',
      riskLevel: 'medium',
      potentialReturn: 18.0,
      actionRequired: 'Analise para entrada gradual em 2-3 compras',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    },
  ];
}

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allocation, setAllocation] = useState<AllocationResult | null>(null);
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega perfil do localStorage ao montar
  useEffect(() => {
    const savedProfile = loadProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      processProfile(savedProfile);
    }
    
    // Gera notícias e oportunidades
    setNews(generateNews());
    setOpportunities(generateOpportunities());
    
    setIsLoading(false);

    // Atualiza notícias a cada 2 minutos
    const newsInterval = setInterval(() => {
      setNews(generateNews());
    }, 120000);

    return () => clearInterval(newsInterval);
  }, []);

  const processProfile = (userProfile: UserProfile) => {
    // Calcula alocação
    const allocationResult = calculateAllocation(userProfile);
    setAllocation(allocationResult);

    // Analisa tendências
    const marketTrends = analyzeTrends();
    setTrends(marketTrends);

    // Gera ordens
    const generatedOrders = generateOrders(allocationResult, userProfile);
    setOrders(generatedOrders);
  };

  const handleOnboardingComplete = (userProfile: UserProfile) => {
    setProfile(userProfile);
    saveProfile(userProfile);
    processProfile(userProfile);
  };

  const handleLogout = () => {
    clearProfile();
    setProfile(null);
    setAllocation(null);
    setTrends([]);
    setOrders([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando InvestMind IA...</p>
        </div>
      </div>
    );
  }

  // Se não tem perfil, mostra onboarding
  if (!profile || !allocation) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Se tem perfil, mostra dashboard
  return (
    <Dashboard
      profile={profile}
      allocation={allocation}
      trends={trends}
      orders={orders}
      news={news}
      opportunities={opportunities}
      onLogout={handleLogout}
    />
  );
}
