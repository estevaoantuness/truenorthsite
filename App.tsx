import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Anchor, 
  ShieldCheck, 
  BarChart3, 
  FileSearch, 
  AlertTriangle, 
  Container, 
  ArrowRight,
  Globe2,
  CheckCircle2,
  Clock,
  Menu,
  X
} from 'lucide-react';

// --- COMPONENTES AUXILIARES ---

/**
 * ShipAnimationComponent
 * Animação vetorial (CSS/SVG) do navio entrando no porto.
 * Disparado via Scroll (Framer Motion).
 */
const ShipAnimationComponent = () => {
  const ref = useRef(null);
  // Gatilho da animação quando 30% do elemento estiver visível
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div ref={ref} className="relative w-full h-64 overflow-hidden mt-10 md:mt-0 flex items-end justify-center">
      {/* Background Elements (Porto/Guindastes sutis) */}
      <div className="absolute inset-0 flex items-end justify-between px-10 opacity-20 text-slate-600">
        <div className="w-10 h-40 border-t-8 border-r-4 border-current rounded-tr-xl transform -skew-x-12"></div>
        <div className="w-16 h-56 border-t-8 border-l-4 border-current rounded-tl-xl transform skew-x-6"></div>
      </div>

      {/* Água (Linha decorativa) */}
      <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-50"></div>

      {/* O Navio */}
      <motion.div
        className="relative z-10"
        initial={{ x: 200, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 40, 
          damping: 20, 
          duration: 1.5 
        }}
      >
        {/* Corpo do Navio */}
        <div className="relative">
          {/* Containers Stack */}
          <div className="flex gap-1 absolute bottom-full mb-0 left-6">
            <div className="w-8 h-6 bg-blue-600 border border-blue-800 rounded-sm"></div>
            <div className="w-8 h-6 bg-orange-600 border border-orange-800 rounded-sm"></div>
            <div className="w-8 h-6 bg-cyan-600 border border-cyan-800 rounded-sm"></div>
          </div>
          <div className="flex gap-1 absolute bottom-full mb-6 left-10">
             <div className="w-8 h-6 bg-slate-500 border border-slate-700 rounded-sm"></div>
             <div className="w-8 h-6 bg-blue-500 border border-blue-700 rounded-sm"></div>
          </div>

          {/* Ponte de Comando */}
          <div className="absolute bottom-full right-4 w-12 h-16 bg-white border-2 border-slate-300 rounded-t-sm flex flex-col items-center justify-start pt-2">
            <div className="w-10 h-3 bg-slate-800 rounded-sm mb-1"></div>
            <div className="w-10 h-3 bg-slate-800 rounded-sm"></div>
          </div>

          {/* Casco */}
          <div className="w-80 h-16 bg-slate-800 rounded-bl-3xl rounded-br-lg relative overflow-hidden shadow-xl border-t-4 border-red-800">
             {/* Texto no casco */}
             <div className="absolute top-2 right-4 text-[10px] font-bold tracking-widest text-slate-500 opacity-50 uppercase">
                TrueNorth Line
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- COMPONENTES DA PÁGINA ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Anchor className="h-8 w-8 text-accent-500" />
            <span className="font-bold text-xl tracking-tight text-white">TrueNorth</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#produto" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Produto</a>
              <a href="#como-funciona" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Como Funciona</a>
              <a href="#beneficios" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Benefícios</a>
              <a href="#contato" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contato</a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-600/20">
              Falar com o time
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#produto" className="text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Produto</a>
            <a href="#como-funciona" className="text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Como Funciona</a>
            <a href="#contato" className="text-slate-300 block px-3 py-2 rounded-md text-base font-medium">Contato</a>
            <button className="w-full text-left bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium mt-4">
              Falar com o time
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="produto" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-accent-400 text-xs font-medium uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
              MVP Disponível
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Menos erro na <span className="text-primary-600">DUIMP</span>.<br />
              Menos contêiner parado no porto.
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Plataforma enterprise que integra DUIMP, NCM e LPCO aos portais oficiais. 
              Reduza multas, demurrage e retrabalho manual nas suas importações com validação preditiva.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2">
                Quero ver o MVP <ArrowRight className="h-4 w-4" />
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-8 py-3.5 rounded-lg text-base font-medium transition-all flex items-center justify-center">
                Entenda o impacto
              </button>
            </div>

            {/* Social Proof / Trust */}
            <div className="pt-6 border-t border-slate-800/50">
               <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Projetado para times de alta performance</p>
               <div className="flex gap-4 text-slate-600">
                  {/* Placeholders de logos de "tech partners" ou estilo similar */}
                  <div className="h-6 w-20 bg-slate-800/50 rounded flex items-center justify-center text-[10px]">LOGISTICS</div>
                  <div className="h-6 w-20 bg-slate-800/50 rounded flex items-center justify-center text-[10px]">TRADING</div>
                  <div className="h-6 w-20 bg-slate-800/50 rounded flex items-center justify-center text-[10px]">COMEX</div>
               </div>
            </div>
          </div>

          {/* Right Content: Dashboard Mockup */}
          <div className="relative group perspective-1000">
             {/* Efeito de brilho atrás do card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            {/* O Mockup em si */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden transform rotate-y-3 transition-transform duration-700 hover:rotate-0">
              {/* Header do Mockup */}
              <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-4 text-xs text-slate-400 font-mono">TrueNorth - Operations Dashboard</div>
              </div>

              {/* Corpo do Mockup */}
              <div className="p-6 space-y-6">
                
                {/* Status Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase">Em trânsito</div>
                    <div className="text-xl font-bold text-white mt-1">124</div>
                    <div className="text-[10px] text-green-400 mt-1">▲ 12% vs mês ant.</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase">Risco NCM</div>
                    <div className="text-xl font-bold text-orange-500 mt-1">3</div>
                    <div className="text-[10px] text-orange-400 mt-1">Ação requerida</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                    <div className="text-[10px] text-slate-400 uppercase">Econ. Demurrage</div>
                    <div className="text-xl font-bold text-accent-400 mt-1">R$ 45k</div>
                    <div className="text-[10px] text-slate-400 mt-1">Nesta semana</div>
                  </div>
                </div>

                {/* Lista de Alertas (Mock Data) */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Alertas Recentes</div>
                  
                  {[
                    { msg: "Inconsistência NCM 8517.62 vs Descrição", type: "red", time: "10 min" },
                    { msg: "LPCO pendente - MAPA (Processo #4492)", type: "yellow", time: "2h" },
                    { msg: "Divergência Valor Aduaneiro vs Invoice", type: "red", time: "4h" },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${alert.type === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                         <span className="text-xs text-slate-300">{alert.msg}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{alert.time}</span>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="h-24 flex items-end justify-between gap-1 px-2 pt-4 border-t border-slate-800">
                    {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50].map((h, i) => (
                      <div key={i} className="w-full bg-primary-600/20 rounded-t hover:bg-primary-500 transition-colors" style={{ height: `${h}%` }}></div>
                    ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { 
      id: 1, 
      title: "Importação dos dados", 
      desc: "Ingestão automática de BL, Invoices, Packing List e seu catálogo de produtos via API ou upload.",
      icon: <Globe2 className="w-6 h-6 text-primary-400" />
    },
    { 
      id: 2, 
      title: "Validação Inteligente", 
      desc: "Nossa IA cruza NCMs com a descrição, verifica LPCOs necessários e consistência tributária.",
      icon: <FileSearch className="w-6 h-6 text-primary-400" />
    },
    { 
      id: 3, 
      title: "Pré-validação Gov", 
      desc: "Simulamos o registro no Portal Único para antecipar erros antes do envio oficial.",
      icon: <ShieldCheck className="w-6 h-6 text-primary-400" />
    },
    { 
      id: 4, 
      title: "Relatório de Risco", 
      desc: "Receba alertas de correção e estimativa de economia antes de confirmar a DUIMP.",
      icon: <AlertTriangle className="w-6 h-6 text-primary-400" />
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-slate-900 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Como a TrueNorth funciona</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Transformamos dados dispersos em decisões seguras. Do documento bruto ao desembaraço.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative group">
              {/* Connector Line (Desktop only) */}
              {step.id !== 4 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-slate-800 -z-10 group-hover:bg-primary-900 transition-colors" />
              )}
              
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-primary-600/50 transition-all duration-300 h-full relative z-10">
                <div className="w-16 h-16 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  {step.icon}
                </div>
                <div className="absolute top-6 right-6 text-4xl font-bold text-slate-800 select-none">0{step.id}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    { title: "Redução de Demurrage", value: "Até 30%", desc: "Menos tempo de conferência significa liberação mais rápida.", icon: <Clock /> },
    { title: "Precisão na Classificação", value: "Zero", desc: "Redução drástica de multas por erro de NCM.", icon: <ShieldCheck /> },
    { title: "Eficiência Operacional", value: "-15h", desc: "Horas a menos por semana em digitação manual.", icon: <BarChart3 /> },
    { title: "Visibilidade Total", value: "100%", desc: "Controle centralizado de todos os processos e licenças.", icon: <Container /> },
  ];

  return (
    <section id="beneficios" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Resultados que impactam o caixa</h2>
            <p className="text-slate-400 text-lg mb-8">
              A TrueNorth não é apenas um software de conformidade. É uma ferramenta de eficiência financeira para sua operação de comércio exterior.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">{item.title}</span>
                    <span className="text-primary-500 opacity-80 scale-75">{item.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Abstract Visualization */}
          <div className="relative h-96 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
             {/* Chart Visual */}
             <div className="w-3/4 h-3/4 flex items-end justify-around px-8 pb-8 gap-4 border-l border-b border-slate-700">
                <div className="w-12 bg-slate-700 h-[30%] rounded-t opacity-50 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100">Antes</div>
                </div>
                <div className="w-12 bg-slate-600 h-[50%] rounded-t opacity-50"></div>
                <div className="w-12 bg-slate-500 h-[40%] rounded-t opacity-50"></div>
                <div className="w-12 bg-primary-600 h-[85%] rounded-t shadow-[0_0_20px_rgba(37,99,235,0.5)] relative group">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-primary-400 font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap">Com TrueNorth</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSectionWithShip = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Texto Sobre */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-white mb-6">O porto seguro da sua operação</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                Somos um time de especialistas em Comex e Engenheiros de Dados focados em resolver o gargalo da ineficiência nas importações brasileiras.
              </p>
              <p>
                A complexidade da DUIMP não precisa ser um risco. Combinamos conhecimento aduaneiro profundo com tecnologia de IA para tornar o processo previsível.
              </p>
              <p className="text-white font-medium border-l-4 border-primary-600 pl-4 mt-4">
                Nosso objetivo é dar previsibilidade de custo e tempo para operações que não podem se dar ao luxo de ficar com contêiner parado.
              </p>
            </div>
          </div>

          {/* Animação do Navio */}
          <div className="order-1 md:order-2">
            <ShipAnimationComponent />
          </div>

        </div>
      </div>
    </section>
  );
};

const ForWhomSection = () => {
  const personas = [
    {
      title: "Importadores Médios",
      items: ["Visão consolidada de processos", "Alertas de custo em tempo real", "Compliance fiscal automatizado"]
    },
    {
      title: "Trading Companies",
      items: ["Gestão de múltiplos clientes", "Histórico centralizado de NCMs", "Redução de lead-time operacional"]
    },
    {
      title: "Operadores Logísticos",
      items: ["Previsibilidade de atracação", "Integração via API", "Status unificado para o cliente final"]
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Quem usa a TrueNorth?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {personas.map((persona, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-accent-500/30 transition-colors group">
              <h3 className="text-xl font-bold text-white mb-6 group-hover:text-accent-400 transition-colors">{persona.title}</h3>
              <ul className="space-y-3">
                {persona.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section id="contato" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-primary-900/10 radial-gradient-mask"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-12 rounded-2xl shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Quer testar o MVP da TrueNorth?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Conectamos com seus dados atuais (simulação segura) e mostramos onde você pode reduzir custos e atrasos na sua próxima DUIMP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg shadow-primary-600/25 w-full sm:w-auto">
              Agendar demonstração
            </button>
            <button className="bg-transparent border border-slate-600 hover:bg-slate-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all w-full sm:w-auto">
              Ver simulação de impacto
            </button>
          </div>
          {/* TODO: Add simple lead capture form input here in V2 */}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
               <Anchor className="h-6 w-6 text-accent-500" />
               <span className="font-bold text-xl text-white">TrueNorth</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Inteligência e compliance para o novo processo de importação brasileiro. 
              Tecnologia que navega a burocracia para você.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Integrações (API)</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Segurança</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Termos de Uso</a></li>
              <li><span className="text-slate-700 cursor-default">contato@truenorth.com.br</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} TrueNorth RegTech Ltda. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             {/* Social placeholders */}
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center hover:bg-slate-800 cursor-pointer">In</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  // FUTURO: Implementar lazy loading para seções abaixo da dobra
  // FUTURO: Adicionar Context Provider para tema/estado global se crescer
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-primary-600 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <BenefitsSection />
        <AboutSectionWithShip />
        <ForWhomSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}