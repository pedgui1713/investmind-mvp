'use client';

import { useState } from 'react';
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

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    opportunities: true,
  });

  const savePersonalData = () => {
    localStorage.setItem('investmind_personal_data', JSON.stringify(personalData));
    alert('Dados salvos com sucesso!');
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
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              Premium
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

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Próxima cobrança</span>
            </div>
            <span className="text-sm font-semibold">15/02/2025</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Alterar Plano
            </Button>
            <Button variant="destructive" className="flex-1">
              Cancelar Assinatura
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados Pessoais */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>Dados Pessoais</CardTitle>
          </div>
          <CardDescription>Mantenha suas informações atualizadas</CardDescription>
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
                onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
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
                onChange={(e) => setPersonalData({ ...personalData, phone: formatPhone(e.target.value) })}
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
                onChange={(e) => setPersonalData({ ...personalData, cpf: formatCPF(e.target.value) })}
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
                onChange={(e) => setPersonalData({ ...personalData, cep: formatCEP(e.target.value) })}
                maxLength={9}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Rua, número, complemento"
                value={personalData.address}
                onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="São Paulo"
                value={personalData.city}
                onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="SP"
                value={personalData.state}
                onChange={(e) => setPersonalData({ ...personalData, state: e.target.value.toUpperCase() })}
                maxLength={2}
              />
            </div>
          </div>

          <Button onClick={savePersonalData} className="w-full">
            Salvar Dados Pessoais
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
                <Label>E-mail</Label>
                <p className="text-sm text-muted-foreground">Receber atualizações por e-mail</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push</Label>
                <p className="text-sm text-muted-foreground">Notificações no navegador</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Oportunidades</Label>
                <p className="text-sm text-muted-foreground">Alertas de boas oportunidades</p>
              </div>
              <Switch
                checked={notifications.opportunities}
                onCheckedChange={(checked) => setNotifications({ ...notifications, opportunities: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
