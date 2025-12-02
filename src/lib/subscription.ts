// Utilitários para gerenciar assinatura do InvestMind IA

export interface SubscriptionData {
  isActive: boolean;
  expiryDate: string;
  plan: 'premium';
  price: number;
}

/**
 * Ativa a assinatura do usuário
 * @param durationInDays Duração da assinatura em dias (padrão: 30 dias)
 */
export function activateSubscription(durationInDays: number = 30): void {
  if (typeof window === 'undefined') return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + durationInDays);

  const subscriptionData: SubscriptionData = {
    isActive: true,
    expiryDate: expiryDate.toISOString(),
    plan: 'premium',
    price: 19.90,
  };

  localStorage.setItem('investmind_subscription', JSON.stringify(subscriptionData));
  
  // Remove o cancelamento se existir
  localStorage.removeItem('investmind_cancellation');
}

/**
 * Verifica se o usuário tem assinatura ativa
 */
export function hasActiveSubscription(): boolean {
  if (typeof window === 'undefined') return false;

  const subscription = localStorage.getItem('investmind_subscription');
  
  if (!subscription) return false;

  try {
    const subData: SubscriptionData = JSON.parse(subscription);
    const expiryDate = new Date(subData.expiryDate);
    const now = new Date();
    
    return expiryDate > now && subData.isActive;
  } catch {
    return false;
  }
}

/**
 * Obtém os dados da assinatura
 */
export function getSubscriptionData(): SubscriptionData | null {
  if (typeof window === 'undefined') return null;

  const subscription = localStorage.getItem('investmind_subscription');
  
  if (!subscription) return null;

  try {
    return JSON.parse(subscription);
  } catch {
    return null;
  }
}

/**
 * Cancela a assinatura (marca como cancelada mas mantém acesso até expirar)
 */
export function cancelSubscription(reason: string): void {
  if (typeof window === 'undefined') return;

  const cancellationData = {
    date: new Date().toISOString(),
    reason,
  };

  localStorage.setItem('investmind_cancellation', JSON.stringify(cancellationData));
}

/**
 * Verifica se a assinatura foi cancelada
 */
export function isSubscriptionCancelled(): boolean {
  if (typeof window === 'undefined') return false;

  return !!localStorage.getItem('investmind_cancellation');
}

/**
 * Reativa a assinatura (remove o cancelamento)
 */
export function reactivateSubscription(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('investmind_cancellation');
}

/**
 * Obtém o número de dias restantes da assinatura
 */
export function getDaysRemaining(): number {
  const subData = getSubscriptionData();
  
  if (!subData) return 0;

  const expiryDate = new Date(subData.expiryDate);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Formata a data de expiração para exibição
 */
export function formatExpiryDate(): string {
  const subData = getSubscriptionData();
  
  if (!subData) return '';

  const expiryDate = new Date(subData.expiryDate);
  return expiryDate.toLocaleDateString('pt-BR');
}
