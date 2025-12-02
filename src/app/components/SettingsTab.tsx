'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Crown,
  Check,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import ThemeToggle from '@/components/custom/ThemeToggle';

interface PersonalData {
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  address: string;
  city: string;
  state: string;
}

export default function SettingsTab() {
  const [personalData, setPersonalData] = useState<PersonalData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('investmind_personal_data');
      return saved ? JSON.parse(saved) : {
        email: '',
        phone: '',
        cpf: '',
        cep: '',
        address: '',
        city: '',
        state: '',
      };
    }
    return {
      email: '',
      phone: '',
      cpf: '',
      cep: '',
      address: '',
      city: '',
      state: '',
    };
  });

  const [notifications, setNotifications] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Verifica se a assinatura foi cancelada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cancellation = localStorage.getItem('investmind_cancellation');
      setIsCancelled(!!cancellation);
    }
  }, []);

  // Salva dados automaticamente quando alterados
  const updatePersonalData = (field: keyof PersonalData, value: string) => {
    const newData = { ...personalData, [field]: value };
    setPersonalData(newData);
    
    // Salva automaticamente no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('investmind_personal_data', JSON.stringify(newData));
    }
  };

  const savePersonalData = () => {
    setIsSaving(true);
    localStorage.setItem('investmind_personal_data', JSON.stringify(personalData));
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Dados salvos com sucesso! ✅');
    }, 500);
  };

  const handleCancelSubscription = () => {
    if (!cancelReason.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }

    // Salva o motivo do cancelamento
    const cancellationData = {
      date: new Date().toISOString(),
      reason: cancelReason,
      userData: personalData,
    };
    
    localStorage.setItem('investmind_cancellation', JSON.stringify(cancellationData));
    setIsCancelled(true);
    
    alert('Assinatura cancelada com sucesso. Você terá acesso até o final do período pago (15/02/2025).');
    setShowCancelDialog(false);
    setCancelReason('');
  };

  const handleResubscribe = () => {
    // Redireciona para o link de pagamento
    window.open('https://pay.kirvano.com/d371567d-be5c-4c9e-bd5f-58e424ab7e9d', '_blank');
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Assinatura */}
      <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-purple-600" />
              <CardTitle>Plano de Assinatura</CardTitle>
            </div>
            <Badge className={isCancelled ? "bg-gray-500" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"}>
              {isCancelled ? 'Cancelada' : 'Premium'}
            </Badge>
          </div>
          <CardDescription>Gerencie sua assinatura e benefícios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-lg">InvestMind Premium</h4>
                <p className="text-sm text-muted-foreground">Acesso completo a todas as funcionalidades</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">R$ 19,90</p>
                <p className="text-xs text-muted-foreground">por mês</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Análises ilimitadas de mercado</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Notificações de oportunidades em tempo real</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Controle financeiro com IA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Suporte prioritário</span>
              </div>
            </div>
          </div>

          {!isCancelled && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Próxima cobrança</span>
              </div>
              <span className="text-sm font-semibold">15/02/2025</span>
            </div>
          )}

          {isCancelled && (
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Sua assinatura foi cancelada. Você ainda tem acesso até 15/02/2025.
              </p>
            </div>
          )}

          {isCancelled ? (
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={handleResubscribe}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Assinar Novamente
            </Button>
          ) : (
            <>
              {!showCancelDialog ? (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancelar Assinatura
                </Button>
              ) : (
                <div className="space-y-4 p-4 rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 dark:text-red-100">
                        Tem certeza que deseja cancelar?
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Você perderá acesso a todas as funcionalidades premium após o período pago.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancelReason" className="text-sm font-medium">
                      Por favor, nos conte o motivo do cancelamento:
                    </Label>
                    <textarea
                      id="cancelReason"
                      className="w-full min-h-[100px] p-3 rounded-md border bg-white dark:bg-gray-800 text-sm"
                      placeholder="Seu feedback é importante para melhorarmos nosso serviço..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowCancelDialog(false);
                        setCancelReason('');
                      }}
                    >
                      Manter Assinatura
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleCancelSubscription}
                    >
                      Confirmar Cancelamento
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>Dados Pessoais</CardTitle>
          </div>
          <CardDescription>
            Suas informações são salvas automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={personalData.email}
                onChange={(e) => updatePersonalData('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={personalData.phone}
                onChange={(e) => updatePersonalData('phone', formatPhone(e.target.value))}
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                CPF
              </Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={personalData.cpf}
                onChange={(e) => updatePersonalData('cpf', formatCPF(e.target.value))}
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                CEP
              </Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={personalData.cep}
                onChange={(e) => updatePersonalData('cep', formatCEP(e.target.value))}
                maxLength={9}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, número, complemento"
                value={personalData.address}
                onChange={(e) => updatePersonalData('address', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="São Paulo"
                value={personalData.city}
                onChange={(e) => updatePersonalData('city', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="SP"
                value={personalData.state}
                onChange={(e) => updatePersonalData('state', e.target.value.toUpperCase())}
                maxLength={2}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Seus dados são salvos automaticamente enquanto você digita
            </p>
          </div>

          <Button onClick={savePersonalData} className="w-full" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Manualmente'}
          </Button>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Personalize sua experiência</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema do Aplicativo</Label>
              <p className="text-sm text-muted-foreground">Alterne entre modo claro e escuro</p>
            </div>
            <ThemeToggle />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Notificações</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Oportunidades</Label>
                <p className="text-sm text-muted-foreground">
                  Receber alertas sobre boas oportunidades de investimento
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => {
                  setNotifications(checked);
                  localStorage.setItem('investmind_notifications', JSON.stringify(checked));
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
