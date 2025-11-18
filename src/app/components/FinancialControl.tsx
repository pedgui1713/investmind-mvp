'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wallet,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  PieChart as PieChartIcon,
  Lightbulb,
  Target,
  Calendar,
} from 'lucide-react';
import {
  FinancialData,
  FixedExpense,
  VariableExpense,
  FinancialAnalysis,
  analyzeFinancialData,
  saveFinancialData,
  loadFinancialData,
} from '@/lib/financialEngine';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function FinancialControl() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    salaryDate: 5,
    monthlyIncome: 0,
    fixedExpenses: [],
    variableExpenses: [],
  });

  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [showAddFixed, setShowAddFixed] = useState(false);
  const [showAddVariable, setShowAddVariable] = useState(false);

  // Formulário de despesa fixa
  const [newFixed, setNewFixed] = useState<Partial<FixedExpense>>({
    name: '',
    amount: 0,
    dueDate: 1,
    category: 'other',
  });

  // Formulário de despesa variável
  const [newVariable, setNewVariable] = useState<Partial<VariableExpense>>({
    name: '',
    amount: 0,
    category: 'other',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Carrega dados ao montar
  useEffect(() => {
    const saved = loadFinancialData();
    if (saved) {
      setFinancialData(saved);
      setAnalysis(analyzeFinancialData(saved));
    }
  }, []);

  // Atualiza análise quando dados mudam
  useEffect(() => {
    if (financialData.monthlyIncome > 0) {
      const newAnalysis = analyzeFinancialData(financialData);
      setAnalysis(newAnalysis);
      saveFinancialData(financialData);
    }
  }, [financialData]);

  const addFixedExpense = () => {
    if (!newFixed.name || !newFixed.amount) return;

    const expense: FixedExpense = {
      id: `fixed-${Date.now()}`,
      name: newFixed.name,
      amount: newFixed.amount,
      dueDate: newFixed.dueDate || 1,
      category: newFixed.category as any,
    };

    setFinancialData({
      ...financialData,
      fixedExpenses: [...financialData.fixedExpenses, expense],
    });

    setNewFixed({ name: '', amount: 0, dueDate: 1, category: 'other' });
    setShowAddFixed(false);
  };

  const addVariableExpense = () => {
    if (!newVariable.name || !newVariable.amount) return;

    const expense: VariableExpense = {
      id: `variable-${Date.now()}`,
      name: newVariable.name,
      amount: newVariable.amount,
      category: newVariable.category as any,
      month: newVariable.month || new Date().getMonth() + 1,
      year: newVariable.year || new Date().getFullYear(),
    };

    setFinancialData({
      ...financialData,
      variableExpenses: [...financialData.variableExpenses, expense],
    });

    setNewVariable({
      name: '',
      amount: 0,
      category: 'other',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    setShowAddVariable(false);
  };

  const removeFixedExpense = (id: string) => {
    setFinancialData({
      ...financialData,
      fixedExpenses: financialData.fixedExpenses.filter((exp) => exp.id !== id),
    });
  };

  const removeVariableExpense = (id: string) => {
    setFinancialData({
      ...financialData,
      variableExpenses: financialData.variableExpenses.filter((exp) => exp.id !== id),
    });
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getHealthLabel = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Boa';
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítica';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuração Inicial */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Configuração Financeira
          </CardTitle>
          <CardDescription>Configure sua renda e data de recebimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Renda Mensal (R$)</Label>
              <Input
                id="income"
                type="number"
                placeholder="5000.00"
                value={financialData.monthlyIncome || ''}
                onChange={(e) =>
                  setFinancialData({
                    ...financialData,
                    monthlyIncome: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryDate">Dia do Recebimento</Label>
              <Select
                value={financialData.salaryDate.toString()}
                onValueChange={(value) =>
                  setFinancialData({ ...financialData, salaryDate: parseInt(value) })
                }
              >
                <SelectTrigger id="salaryDate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      {analysis && (
        <Card className="shadow-lg border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5" />
                Resumo Financeiro
              </CardTitle>
              <Badge className={getHealthColor(analysis.financialHealth)} variant="secondary">
                Saúde: {getHealthLabel(analysis.financialHealth)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground mb-1">Renda Mensal</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {financialData.monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-muted-foreground mb-1">Despesas Totais</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {analysis.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground mb-1">Saldo Disponível</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {analysis.remainingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-muted-foreground mb-1">Taxa de Poupança</p>
                <p className="text-2xl font-bold text-purple-600">{analysis.savingsRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Gráfico de Despesas */}
            {analysis.expensesByCategory.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {analysis.expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Distribuição por Categoria</h4>
                  {analysis.expensesByCategory.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm font-medium">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          R$ {cat.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Despesas Fixas */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Despesas Fixas
              </CardTitle>
              <CardDescription>Gastos mensais recorrentes</CardDescription>
            </div>
            <Button onClick={() => setShowAddFixed(!showAddFixed)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddFixed && (
            <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nome da Despesa</Label>
                  <Input
                    placeholder="Ex: Aluguel"
                    value={newFixed.name}
                    onChange={(e) => setNewFixed({ ...newFixed, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    placeholder="1500.00"
                    value={newFixed.amount || ''}
                    onChange={(e) =>
                      setNewFixed({ ...newFixed, amount: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={newFixed.category}
                    onValueChange={(value) => setNewFixed({ ...newFixed, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="housing">Moradia</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="insurance">Seguros</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dia do Vencimento</Label>
                  <Select
                    value={newFixed.dueDate?.toString()}
                    onValueChange={(value) => setNewFixed({ ...newFixed, dueDate: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          Dia {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addFixedExpense} size="sm">
                  Salvar
                </Button>
                <Button onClick={() => setShowAddFixed(false)} variant="outline" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {financialData.fixedExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma despesa fixa cadastrada. Clique em "Adicionar" para começar.
            </p>
          ) : (
            <div className="space-y-2">
              {financialData.fixedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: dia {expense.dueDate} • {expense.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-lg">
                      R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFixedExpense(expense.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Despesas Variáveis */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Despesas Variáveis
              </CardTitle>
              <CardDescription>Gastos eventuais e não recorrentes</CardDescription>
            </div>
            <Button onClick={() => setShowAddVariable(!showAddVariable)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddVariable && (
            <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Nome da Despesa</Label>
                  <Input
                    placeholder="Ex: Jantar no restaurante"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    placeholder="150.00"
                    value={newVariable.amount || ''}
                    onChange={(e) =>
                      setNewVariable({ ...newVariable, amount: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={newVariable.category}
                    onValueChange={(value) => setNewVariable({ ...newVariable, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Alimentação</SelectItem>
                      <SelectItem value="entertainment">Lazer</SelectItem>
                      <SelectItem value="shopping">Compras</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="transport">Transporte</SelectItem>
                      <SelectItem value="other">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mês/Ano</Label>
                  <div className="flex gap-2">
                    <Select
                      value={newVariable.month?.toString()}
                      onValueChange={(value) =>
                        setNewVariable({ ...newVariable, month: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {new Date(2024, month - 1).toLocaleString('pt-BR', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={newVariable.year || ''}
                      onChange={(e) =>
                        setNewVariable({ ...newVariable, year: parseInt(e.target.value) })
                      }
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addVariableExpense} size="sm">
                  Salvar
                </Button>
                <Button onClick={() => setShowAddVariable(false)} variant="outline" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {financialData.variableExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma despesa variável cadastrada. Clique em "Adicionar" para começar.
            </p>
          ) : (
            <div className="space-y-2">
              {financialData.variableExpenses
                .sort((a, b) => {
                  const dateA = new Date(a.year, a.month - 1);
                  const dateB = new Date(b.year, b.month - 1);
                  return dateB.getTime() - dateA.getTime();
                })
                .slice(0, 10)
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(expense.year, expense.month - 1).toLocaleString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        • {expense.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-lg">
                        R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariableExpense(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendações e Dicas de Investimento */}
      {analysis && (
        <>
          {/* Recomendações */}
          <Card className="shadow-lg border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Recomendações Personalizadas
              </CardTitle>
              <CardDescription>Dicas baseadas na sua situação financeira</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  >
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sugestão de Investimento */}
          <Card className="shadow-lg border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Plano de Investimento Sugerido
              </CardTitle>
              <CardDescription>Como distribuir seu dinheiro de forma inteligente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reserva de Emergência */}
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    1. Reserva de Emergência
                  </h4>
                  <Badge className="bg-green-600 text-white">Prioridade Alta</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Mantenha {analysis.investmentSuggestion.emergencyFundMonths} meses de despesas em
                  investimentos de alta liquidez
                </p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <span className="font-medium">Meta:</span>
                  <span className="text-xl font-bold text-green-600">
                    R${' '}
                    {analysis.investmentSuggestion.emergencyFund.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Investimentos Mensais */}
              <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    2. Investimentos Mensais
                  </h4>
                  <Badge className="bg-blue-600 text-white">
                    {analysis.investmentSuggestion.investmentPercentage}% da renda
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Distribua seus investimentos de forma diversificada
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div>
                      <p className="font-medium">Renda Fixa</p>
                      <p className="text-xs text-muted-foreground">Segurança e liquidez</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {analysis.investmentSuggestion.distribution.fixedIncome}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R${' '}
                        {(
                          (analysis.investmentSuggestion.investmentAmount *
                            analysis.investmentSuggestion.distribution.fixedIncome) /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div>
                      <p className="font-medium">Ações</p>
                      <p className="text-xs text-muted-foreground">Crescimento de longo prazo</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {analysis.investmentSuggestion.distribution.stocks}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        R${' '}
                        {(
                          (analysis.investmentSuggestion.investmentAmount *
                            analysis.investmentSuggestion.distribution.stocks) /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {analysis.investmentSuggestion.distribution.crypto > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <div>
                        <p className="font-medium">Criptomoedas</p>
                        <p className="text-xs text-muted-foreground">Alto risco/retorno</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">
                          {analysis.investmentSuggestion.distribution.crypto}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          R${' '}
                          {(
                            (analysis.investmentSuggestion.investmentAmount *
                              analysis.investmentSuggestion.distribution.crypto) /
                            100
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 dark:border-green-700">
                  <span className="font-semibold text-green-900 dark:text-green-100">
                    Total Mensal:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    R${' '}
                    {analysis.investmentSuggestion.investmentAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Dicas */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Dicas para Maximizar seus Investimentos
                </h4>
                {analysis.investmentSuggestion.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 border"
                  >
                    <span className="text-lg">{tip.split(' ')[0]}</span>
                    <p className="text-sm leading-relaxed">{tip.substring(tip.indexOf(' ') + 1)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
