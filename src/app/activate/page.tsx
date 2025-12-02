'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, ArrowRight } from 'lucide-react';
import { activateSubscription } from '@/lib/subscription';
import { useRouter } from 'next/navigation';

export default function ActivatePage() {
  const [isActivating, setIsActivating] = useState(false);
  const router = useRouter();

  const handleActivate = () => {
    setIsActivating(true);
    
    // Ativa a assinatura por 30 dias
    activateSubscription(30);
    
    setTimeout(() => {
      setIsActivating(false);
      alert('✅ Assinatura ativada com sucesso! Redirecionando...');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ativar Assinatura
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Parabéns! Você está a um passo de acessar o InvestMind IA Premium
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold mb-4">Instruções para Ativar</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold">Complete o pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    Finalize o pagamento no link fornecido (Kirvano)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold">Aguarde a confirmação</p>
                  <p className="text-sm text-muted-foreground">
                    O pagamento pode levar alguns minutos para ser processado
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold">Clique em "Ativar Minha Assinatura"</p>
                  <p className="text-sm text-muted-foreground">
                    Após a confirmação do pagamento, clique no botão abaixo
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
              O que você terá acesso:
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Análises ilimitadas de mercado com IA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Notificações de oportunidades em tempo real</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Controle financeiro personalizado</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span>Suporte prioritário</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleActivate}
            disabled={isActivating}
            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          >
            {isActivating ? (
              'Ativando...'
            ) : (
              <>
                <Crown className="w-5 h-5 mr-2" />
                Ativar Minha Assinatura
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Problemas com a ativação? Entre em contato com o suporte.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
