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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Lock, ExternalLink, Check, Download } from 'lucide-react';
import Link from 'next/link';

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

// Componente de Paywall
function SubscriptionPaywall() {
  const handleSubscribe = () => {
    window.location.href = 'https://pay.kirvano.com/d371567d-be5c-4c9e-bd5f-58e424ab7e9d';
  };

  const handleDownload = () => {
    // Simula download do aplicativo
    // Em produção, você pode gerar um arquivo ou redirecionar para uma página de download
    const link = document.createElement('a');
    link.href = window.location.origin; // Link para o próprio app web
    link.download = 'InvestMind-IA.url';
    
    // Cria um arquivo .url (atalho web) para Windows
    const urlContent = `[InternetShortcut]\nURL=${window.location.origin}\n`;
    const blob = new Blob([urlContent], { type: 'text/plain' });
    link.href = URL.createObjectURL(blob);
    link.download = 'InvestMind-IA.url';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Assinatura Necessária
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Para acessar o InvestMind IA, você precisa de uma assinatura ativa
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">InvestMind Premium</h3>
                <p className="text-sm text-muted-foreground">Acesso completo a todas as funcionalidades</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">R$ 19,90</p>
                <p className="text-xs text-muted-foreground">por mês</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Análises ilimitadas de mercado com IA</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Notificações de oportunidades em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Controle financeiro personalizado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Suporte prioritário</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">Atualizações e novos recursos</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSubscribe}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Agora
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <Button 
              onClick={handleDownload}
              variant="outline"
              className="w-full h-12 text-base border-2 border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Aplicativo
            </Button>

            <Link href="/landing" className="block">
              <Button 
                variant="ghost"
                className="w-full h-12 text-base hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Ver Página de Vendas
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Cancele quando quiser. Sem compromisso de longo prazo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allocation, setAllocation] = useState<AllocationResult | null>(null);
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Carrega perfil do localStorage ao montar
  useEffect(() => {
    // Verifica se tem assinatura ativa
    const checkSubscription = () => {
      if (typeof window !== 'undefined') {
        // Verifica se tem assinatura ativa no localStorage
        const subscription = localStorage.getItem('investmind_subscription');
        
        if (subscription) {
          const subData = JSON.parse(subscription);
          const expiryDate = new Date(subData.expiryDate);
          const now = new Date();
          
          // Se a assinatura ainda não expirou
          if (expiryDate > now) {
            setHasActiveSubscription(true);
          } else {
            setHasActiveSubscription(false);
          }
        } else {
          // Por padrão, considera que não tem assinatura
          // Para testar, você pode descomentar a linha abaixo:
          // localStorage.setItem('investmind_subscription', JSON.stringify({ expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }));
          setHasActiveSubscription(false);
        }
      }
    };

    checkSubscription();

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

  // Se não tem assinatura ativa, mostra paywall
  if (!hasActiveSubscription) {
    return <SubscriptionPaywall />;
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
