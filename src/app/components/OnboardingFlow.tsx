'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft, TrendingUp, Shield, Target, Zap, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/lib/investmentEngine';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    riskTolerance: 5,
    hasEmergencyFund: false,
  });

  const totalSteps = 8;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(profile as UserProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.name && profile.name.length > 0;
      case 2:
        return profile.age && profile.age >= 18 && profile.age <= 100;
      case 3:
        return profile.monthlyIncome && profile.monthlyIncome > 0;
      case 4:
        return profile.investmentGoal && profile.investmentHorizon;
      case 5:
        return true; // Tolerância ao risco e reserva
      case 6:
        return true; // Perguntas adicionais
      case 7:
        return true; // Perfil calculado
      case 8:
        return true; // Confirmação final
      default:
        return false;
    }
  };

  // Calcula o perfil de investidor baseado nas respostas
  const getInvestorProfile = () => {
    const age = profile.age || 30;
    const riskTolerance = profile.riskTolerance || 5;
    const hasEmergency = profile.hasEmergencyFund;
    const goal = profile.investmentGoal;
    const horizon = profile.investmentHorizon;

    let profileType = '';
    let description = '';
    let icon = <Shield className="w-12 h-12" />;
    let color = 'blue';

    // Lógica de classificação
    if (goal === 'conservative' || riskTolerance <= 3 || !hasEmergency) {
      profileType = 'Conservador';
      description = 'Você prioriza segurança e estabilidade. Prefere investimentos de baixo risco com retornos previsíveis, como renda fixa e títulos públicos. Ideal para quem está construindo sua base financeira.';
      icon = <Shield className="w-12 h-12 text-green-600" />;
      color = 'green';
    } else if (goal === 'moderate' || (riskTolerance >= 4 && riskTolerance <= 7)) {
      profileType = 'Moderado';
      description = 'Você busca equilíbrio entre segurança e crescimento. Aceita alguma volatilidade em busca de melhores retornos, diversificando entre renda fixa e variável. Perfil ideal para objetivos de médio prazo.';
      icon = <Target className="w-12 h-12 text-blue-600" />;
      color = 'blue';
    } else {
      profileType = 'Agressivo';
      description = 'Você está confortável com alta volatilidade em busca de retornos superiores. Foca em ações, fundos de crescimento e até criptomoedas. Ideal para quem tem horizonte longo e reservas sólidas.';
      icon = <Zap className="w-12 h-12 text-orange-600" />;
      color = 'orange';
    }

    return { profileType, description, icon, color };
  };

  const investorProfile = step >= 7 ? getInvestorProfile() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InvestMind IA
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            {step < 7 ? 'Vamos criar seu perfil de investimento personalizado' : 'Seu perfil está pronto!'}
          </CardDescription>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i + 1 <= step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Nome */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Bem-vindo! Como podemos te chamar?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vamos começar conhecendo você melhor.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Seu nome</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Idade */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Qual é a sua idade?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Isso nos ajuda a calcular o horizonte ideal de investimento.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Ex: 30"
                  min="18"
                  max="100"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 3: Renda */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Qual é a sua renda mensal?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vamos sugerir valores de investimento baseados na sua capacidade.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Renda mensal (R$)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Ex: 5000"
                  min="0"
                  value={profile.monthlyIncome || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, monthlyIncome: parseFloat(e.target.value) || 0 })
                  }
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {/* Step 4: Objetivo e Horizonte */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Qual é o seu objetivo?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Isso define sua estratégia de investimento.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Perfil de investimento</Label>
                <RadioGroup
                  value={profile.investmentGoal}
                  onValueChange={(value) =>
                    setProfile({ ...profile, investmentGoal: value as any })
                  }
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="conservative" id="conservative" />
                    <Label htmlFor="conservative" className="flex-1 cursor-pointer">
                      <div className="font-medium">Conservador</div>
                      <div className="text-sm text-muted-foreground">
                        Priorizo segurança e retornos estáveis
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="flex-1 cursor-pointer">
                      <div className="font-medium">Moderado</div>
                      <div className="text-sm text-muted-foreground">
                        Busco equilíbrio entre risco e retorno
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <Label htmlFor="aggressive" className="flex-1 cursor-pointer">
                      <div className="font-medium">Agressivo</div>
                      <div className="text-sm text-muted-foreground">
                        Aceito mais risco por maiores retornos
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Horizonte de investimento</Label>
                <RadioGroup
                  value={profile.investmentHorizon}
                  onValueChange={(value) =>
                    setProfile({ ...profile, investmentHorizon: value as any })
                  }
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short" className="flex-1 cursor-pointer">
                      <div className="font-medium">Curto prazo</div>
                      <div className="text-sm text-muted-foreground">Menos de 2 anos</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex-1 cursor-pointer">
                      <div className="font-medium">Médio prazo</div>
                      <div className="text-sm text-muted-foreground">2 a 5 anos</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long" className="flex-1 cursor-pointer">
                      <div className="font-medium">Longo prazo</div>
                      <div className="text-sm text-muted-foreground">Mais de 5 anos</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 5: Tolerância ao Risco */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Sobre sua tolerância ao risco</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Entenda melhor seu perfil de investidor.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Tolerância ao risco: {profile.riskTolerance}/10</Label>
                  <Slider
                    value={[profile.riskTolerance || 5]}
                    onValueChange={(value) => setProfile({ ...profile, riskTolerance: value[0] })}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    {(profile.riskTolerance || 5) <= 3 && 'Prefiro segurança acima de tudo'}
                    {(profile.riskTolerance || 5) > 3 &&
                      (profile.riskTolerance || 5) <= 7 &&
                      'Aceito algum risco por melhores retornos'}
                    {(profile.riskTolerance || 5) > 7 && 'Estou confortável com alta volatilidade'}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Você possui reserva de emergência?</Label>
                  <RadioGroup
                    value={profile.hasEmergencyFund ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      setProfile({ ...profile, hasEmergencyFund: value === 'yes' })
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="flex-1 cursor-pointer">
                        Sim, tenho 6+ meses de despesas guardadas
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="flex-1 cursor-pointer">
                        Não, ainda estou construindo
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Perguntas Adicionais */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div>
                <h3 className="text-xl font-semibold mb-2">Mais algumas informações</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Isso nos ajuda a personalizar ainda mais suas recomendações.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Você já investe atualmente?</Label>
                  <RadioGroup
                    value={profile.hasInvestments ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      setProfile({ ...profile, hasInvestments: value === 'yes' })
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="yes" id="invests-yes" />
                      <Label htmlFor="invests-yes" className="flex-1 cursor-pointer">
                        Sim, já tenho investimentos
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="no" id="invests-no" />
                      <Label htmlFor="invests-no" className="flex-1 cursor-pointer">
                        Não, estou começando agora
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Possui dívidas ativas?</Label>
                  <RadioGroup
                    value={profile.hasDebts ? 'yes' : 'no'}
                    onValueChange={(value) =>
                      setProfile({ ...profile, hasDebts: value === 'yes' })
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="yes" id="debts-yes" />
                      <Label htmlFor="debts-yes" className="flex-1 cursor-pointer">
                        Sim, tenho dívidas a pagar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <RadioGroupItem value="no" id="debts-no" />
                      <Label htmlFor="debts-no" className="flex-1 cursor-pointer">
                        Não, estou sem dívidas
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dependents">Quantas pessoas dependem da sua renda?</Label>
                  <Input
                    id="dependents"
                    type="number"
                    placeholder="Ex: 2"
                    min="0"
                    value={profile.dependents || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, dependents: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Perfil Calculado */}
          {step === 7 && investorProfile && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Seu Perfil de Investidor</h3>
                <p className="text-sm text-muted-foreground">
                  Baseado nas suas respostas, identificamos seu perfil
                </p>
              </div>

              <div className={`p-6 rounded-xl bg-gradient-to-br from-${investorProfile.color}-50 to-${investorProfile.color}-100 dark:from-${investorProfile.color}-900/20 dark:to-${investorProfile.color}-800/20 border-2 border-${investorProfile.color}-200 dark:border-${investorProfile.color}-800`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full bg-white dark:bg-gray-800 shadow-lg`}>
                    {investorProfile.icon}
                  </div>
                  <Badge className={`text-lg px-4 py-2 bg-${investorProfile.color}-600 text-white`}>
                    {investorProfile.profileType}
                  </Badge>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {investorProfile.description}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Características do seu perfil:</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Horizonte: {profile.investmentHorizon === 'short' ? 'Curto prazo' : profile.investmentHorizon === 'medium' ? 'Médio prazo' : 'Longo prazo'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Tolerância ao risco: {profile.riskTolerance}/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Reserva de emergência: {profile.hasEmergencyFund ? 'Sim' : 'Em construção'}</span>
                  </div>
                  {profile.hasDebts && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recomendamos priorizar quitação de dívidas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Confirmação Final */}
          {step === 8 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Tudo pronto!</h3>
                <p className="text-sm text-muted-foreground">
                  Seu perfil foi criado com sucesso. Vamos começar sua jornada de investimentos!
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2">O que você vai encontrar:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Alocação personalizada baseada no seu perfil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Análises de mercado em tempo real</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Controle financeiro inteligente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Notificações de oportunidades</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {step === totalSteps ? 'Começar' : 'Próximo'}
              {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
