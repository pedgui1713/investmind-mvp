'use client';

import { useState } from 'react';
import { ArrowRight, Check, Star, TrendingUp, Shield, Zap, Users, Award, ChevronDown, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCTAClick = () => {
    window.location.href = 'https://pay.kirvano.com/d371567d-be5c-4c9e-bd5f-58e424ab7e9d';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InvestMind IA
            </span>
          </div>
          <button 
            onClick={handleCTAClick}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Começar Agora
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Mais de 10.000 investidores já transformaram suas finanças
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Invista com <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Inteligência Artificial</span> e Multiplique seu Patrimônio
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Descubra seu perfil de investidor em 2 minutos e receba uma carteira personalizada com análises em tempo real. <strong>Sem complicação, sem jargões</strong>, apenas resultados.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleCTAClick}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Assinar por R$ 19,90/mês
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollToSection('beneficios')}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 transition-all duration-300"
              >
                Ver Como Funciona
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">R$ 50M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Gerenciados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">4.9/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Depoimentos */}
      <section className="py-20 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            O Que Nossos Usuários Dizem
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Mais de 10.000 pessoas já transformaram suas finanças com o InvestMind IA
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Depoimento 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "Nunca imaginei que investir pudesse ser tão simples! Em 3 meses, minha carteira já rendeu <strong>18% acima da poupança</strong>. O InvestMind IA me mostrou exatamente onde colocar meu dinheiro."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  MC
                </div>
                <div>
                  <div className="font-semibold">Maria Clara Santos</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Professora, 34 anos</div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "Estava perdido no mundo dos investimentos. O questionário identificou meu perfil moderado e criou uma carteira perfeita. <strong>Já recuperei R$ 12 mil</strong> que estava parado na conta corrente!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  RS
                </div>
                <div>
                  <div className="font-semibold">Roberto Silva</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Engenheiro, 41 anos</div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "Como iniciante, tinha medo de perder dinheiro. A IA me guiou passo a passo e hoje <strong>invisto com confiança</strong>. As análises em tempo real são incríveis! Melhor decisão que tomei."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  JO
                </div>
                <div>
                  <div className="font-semibold">Juliana Oliveira</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Designer, 28 anos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Por Que Escolher o InvestMind IA?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Tecnologia de ponta para você investir como os profissionais
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefício 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Análise em Tempo Real</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receba alertas instantâneos sobre oportunidades de mercado e ajustes na sua carteira
              </p>
            </div>

            {/* Benefício 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">100% Seguro</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seus dados são criptografados e protegidos. Nunca pedimos acesso às suas contas bancárias
              </p>
            </div>

            {/* Benefício 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Carteira Personalizada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                IA analisa seu perfil e cria uma estratégia única para seus objetivos financeiros
              </p>
            </div>

            {/* Benefício 4 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Suporte Especializado</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tire dúvidas com nossa equipe de especialistas em investimentos sempre que precisar
              </p>
            </div>

            {/* Benefício 5 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Educação Financeira</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aprenda enquanto investe com conteúdos exclusivos e análises detalhadas
              </p>
            </div>

            {/* Benefício 6 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Interface Intuitiva</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Design moderno e fácil de usar. Acesse de qualquer lugar, pelo celular ou computador
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preco" className="py-20 bg-white dark:bg-gray-800/50 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Invista no Seu Futuro Financeiro
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Acesso completo a todas as funcionalidades por apenas R$ 19,90/mês
          </p>

          <div className="max-w-md mx-auto">
            {/* Plano Premium Único */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl border-2 border-blue-500 relative overflow-hidden shadow-2xl">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                MELHOR ESCOLHA
              </div>

              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Plano Premium</h3>
                <div className="text-5xl font-bold mb-2">R$ 19,90</div>
                <div className="text-blue-100">por mês</div>
              </div>

              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Análise completa de perfil de investidor</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Carteira personalizada com IA avançada</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Análises em tempo real do mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Alertas de oportunidades exclusivas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Suporte prioritário 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Relatórios mensais detalhados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Acesso a conteúdos exclusivos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Controle financeiro pessoal completo</span>
                </li>
              </ul>

              <button 
                onClick={handleCTAClick}
                className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Assinar Agora por R$ 19,90/mês
              </button>

              <div className="mt-4 text-center text-blue-100 text-sm">
                🔒 Garantia de 7 dias - Cancele quando quiser
              </div>
            </div>

            <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
              <p className="text-lg font-semibold mb-2">💎 Investimento que se paga sozinho</p>
              <p className="text-sm">
                Com as estratégias da nossa IA, muitos usuários recuperam o valor da assinatura já no primeiro mês através de melhores decisões de investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Tire suas dúvidas antes de começar
          </p>

          <div className="space-y-4">
            {[
              {
                q: 'O InvestMind IA é seguro? Vocês têm acesso às minhas contas?',
                a: 'Sim, é 100% seguro! Nós NUNCA pedimos acesso às suas contas bancárias ou de investimento. O InvestMind IA apenas analisa seus dados financeiros que você fornece voluntariamente e sugere estratégias. Todos os dados são criptografados e protegidos.'
              },
              {
                q: 'Preciso ter conhecimento em investimentos para usar?',
                a: 'Não! O InvestMind IA foi criado justamente para quem está começando. Nossa IA traduz tudo em linguagem simples e te guia passo a passo. Você aprende enquanto investe.'
              },
              {
                q: 'Quanto tempo leva para ver resultados?',
                a: 'Muitos usuários relatam melhorias na organização financeira em 7 dias. Para investimentos, os resultados variam conforme o mercado e seu perfil, mas nossa IA otimiza suas chances de sucesso desde o primeiro dia.'
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim! Não há fidelidade. Você pode cancelar a assinatura a qualquer momento. Além disso, oferecemos garantia de 7 dias - se não gostar, devolvemos 100% do seu dinheiro.'
              },
              {
                q: 'A IA realmente funciona? Como ela analisa meus investimentos?',
                a: 'Sim! Nossa IA utiliza algoritmos avançados de machine learning que analisam milhares de dados do mercado em tempo real, cruzando com seu perfil de investidor. Ela identifica padrões, tendências e oportunidades que seriam impossíveis de detectar manualmente.'
              },
              {
                q: 'Por que apenas R$ 19,90? Não é muito barato?',
                a: 'Acreditamos que educação financeira e ferramentas de qualidade devem ser acessíveis a todos. Nosso objetivo é democratizar o acesso a análises profissionais de investimento. Quanto mais pessoas investirem bem, melhor para toda a economia!'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Transformar Suas Finanças?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Junte-se a mais de 10.000 investidores que já estão multiplicando seu patrimônio com inteligência artificial
          </p>
          
          <button 
            onClick={handleCTAClick}
            className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
          >
            Assinar por R$ 19,90/mês
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="mt-6 text-blue-100">
            ✓ Garantia de 7 dias • ✓ Configuração em 2 minutos • ✓ Cancele quando quiser
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">InvestMind IA</span>
          </div>
          <p className="mb-4">
            Análise gráfica educacional e simulação de alocação personalizada
          </p>
          <p className="text-sm">
            © 2024 InvestMind IA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
