'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  PieChart,
  BarChart3,
  Copy,
  LogOut,
  AlertCircle,
  Newspaper,
  Bell,
  X,
  Clock,
  ArrowUpRight,
  Wallet,
  Settings,
  Home,
} from 'lucide-react';
import { UserProfile, AllocationResult, MarketTrend, Order, NewsItem, Opportunity } from '@/lib/investmentEngine';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import FinancialControl from './FinancialControl';
import SettingsTab from './SettingsTab';
import ThemeToggle from '@/components/custom/ThemeToggle';

interface DashboardProps {
  profile: UserProfile;
  allocation: AllocationResult;
  trends: MarketTrend[];
  orders: Order[];
  news: NewsItem[];
  opportunities: Opportunity[];
  onLogout: () => void;
}

const COLORS = {
  fixedIncome: '#10b981',
  stocks: '#3b82f6',
  crypto: '#f59e0b',
};

type TabType = 'feed' | 'allocation' | 'financial' | 'analysis' | 'orders' | 'settings';

export default function Dashboard({ profile, allocation, trends, orders, news, opportunities, onLogout }: DashboardProps) {
  const [showNotifications, setShowNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  
  const chartData = [
    { name: 'Renda Fixa', value: allocation.fixedIncome, color: COLORS.fixedIncome },
    { name: 'Ações', value: allocation.stocks, color: COLORS.stocks },
    { name: 'Cripto', value: allocation.crypto, color: COLORS.crypto },
  ].filter((item) => item.value > 0);

  const copyOrder = (order: Order) => {
    navigator.clipboard.writeText(order.formattedOrder);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'bearish':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes('stocks') || category.toLowerCase().includes('ações')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    if (category.toLowerCase().includes('crypto')) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
    if (category.toLowerCase().includes('economy') || category.toLowerCase().includes('fixa')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `${minutes} min atrás`;
    }
    return `${hours}h atrás`;
  };

  const navItems = [
    { id: 'feed' as TabType, label: 'Feed', icon: Home },
    { id: 'allocation' as TabType, label: 'Alocação', icon: PieChart },
    { id: 'financial' as TabType, label: 'Finanças', icon: Wallet },
    { id: 'analysis' as TabType, label: 'Análise', icon: BarChart3 },
    { id: 'orders' as TabType, label: 'Ordens', icon: Copy },
    { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">InvestMind IA</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Olá, {profile.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={onLogout} className="hidden sm:flex">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex md:flex-col w-64 border-r bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Notificações de Oportunidades */}
              {showNotifications && opportunities.length > 0 && (
                <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-600 animate-pulse" />
                        <CardTitle className="text-lg">
                          {opportunities.length} {opportunities.length === 1 ? 'Oportunidade' : 'Oportunidades'} Detectada{opportunities.length > 1 ? 's' : ''}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowNotifications(false)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {opportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={opp.imageUrl}
                          alt={opp.asset}
                          className="w-full sm:w-32 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-sm sm:text-base">{opp.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{opp.description}</p>
                            </div>
                            <Badge className={getRiskColor(opp.riskLevel)} variant="secondary">
                              {opp.riskLevel === 'low' ? 'Baixo Risco' : opp.riskLevel === 'medium' ? 'Médio Risco' : 'Alto Risco'}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <Badge variant="outline" className="font-mono">
                              {opp.asset}
                            </Badge>
                            <Badge className={getCategoryColor(opp.category)}>
                              {opp.category}
                            </Badge>
                            <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" />
                              +{opp.potentialReturn}% potencial
                            </span>
                          </div>
                          <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
                            💡 {opp.actionRequired}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Feed de Notícias */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-blue-600" />
                      <CardTitle>Notícias do Mercado</CardTitle>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Tempo Real
                    </Badge>
                  </div>
                  <CardDescription>Últimas atualizações do mercado financeiro</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all hover:shadow-md"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full sm:w-40 h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm sm:text-base leading-tight">{item.title}</h4>
                            <Badge className={getImpactColor(item.impact)} variant="secondary">
                              {item.impact === 'high' ? 'Alto Impacto' : item.impact === 'medium' ? 'Médio' : 'Baixo'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.summary}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category === 'stocks'
                                ? 'Ações'
                                : item.category === 'crypto'
                                ? 'Cripto'
                                : item.category === 'economy'
                                ? 'Economia'
                                : 'Internacional'}
                            </Badge>
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Allocation Tab */}
          {activeTab === 'allocation' && (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Sua Alocação Personalizada
                    </CardTitle>
                    <CardDescription>
                      Baseada no seu perfil {profile.investmentGoal} e horizonte{' '}
                      {profile.investmentHorizon === 'short'
                        ? 'curto'
                        : profile.investmentHorizon === 'medium'
                        ? 'médio'
                        : 'longo'}{' '}
                      prazo
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    R$ {allocation.suggestedAmount.toLocaleString('pt-BR')}/mês
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Gráfico de Pizza */}
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  {/* Detalhes da Alocação */}
                  <div className="space-y-4">
                    {allocation.fixedIncome > 0 && (
                      <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div>
                          <p className="font-semibold text-green-900 dark:text-green-100">Renda Fixa</p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            R${' '}
                            {((allocation.suggestedAmount * allocation.fixedIncome) / 100).toLocaleString(
                              'pt-BR',
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                        <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                          {allocation.fixedIncome}%
                        </Badge>
                      </div>
                    )}

                    {allocation.stocks > 0 && (
                      <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <div>
                          <p className="font-semibold text-blue-900 dark:text-blue-100">Ações</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            R${' '}
                            {((allocation.suggestedAmount * allocation.stocks) / 100).toLocaleString(
                              'pt-BR',
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                        <Badge className="bg-blue-600 text-white text-lg px-3 py-1">
                          {allocation.stocks}%
                        </Badge>
                      </div>
                    )}

                    {allocation.crypto > 0 && (
                      <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                        <div>
                          <p className="font-semibold text-orange-900 dark:text-orange-100">
                            Criptomoedas
                          </p>
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            R${' '}
                            {((allocation.suggestedAmount * allocation.crypto) / 100).toLocaleString(
                              'pt-BR',
                              { minimumFractionDigits: 2 }
                            )}
                          </p>
                        </div>
                        <Badge className="bg-orange-600 text-white text-lg px-3 py-1">
                          {allocation.crypto}%
                        </Badge>
                      </div>
                    )}

                    {!profile.hasEmergencyFund && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Recomendamos construir uma reserva de emergência antes de investir valores
                          maiores.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && <FinancialControl />}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              {trends.map((trend, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        {trend.category}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getTrendColor(trend.trend)}>
                          {trend.trend === 'bullish'
                            ? 'Alta'
                            : trend.trend === 'bearish'
                            ? 'Baixa'
                            : 'Neutro'}
                        </Badge>
                        <Badge variant="outline">{trend.confidence}% confiança</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{trend.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Ordens Pré-formatadas</CardTitle>
                  <CardDescription>
                    Copie e cole na sua corretora ou use para referência
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{order.category}</Badge>
                          <span className="font-semibold">{order.asset}</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          {order.formattedOrder}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyOrder(order)}
                        className="ml-4"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Como usar as ordens
                      </p>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                        <li>Clique no botão de copiar ao lado de cada ordem</li>
                        <li>Acesse sua corretora (XP, Rico, Clear, etc.)</li>
                        <li>Cole a ordem na área de negociação</li>
                        <li>Revise os valores e confirme a operação</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden z-20">
        <div className="grid grid-cols-6 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 ${
                  activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label === 'Configurações' ? 'Config' : item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
