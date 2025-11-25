import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
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
  X,
  Calculator,
  Plus,
  Trash2,
  ArrowDown,
  Ship,
  FileCheck,
  Download,
  XCircle,
  TrendingDown,
  Home
} from 'lucide-react';

// --- CONSTANTES & CONFIGURAÇÃO ---
const COLORS = {
  bg: 'slate-950', // #020817
  primary: 'primary-600', // #2563EB
  accent: 'accent-500', // #06B6D4
  warning: 'orange-500', // #F97316
  textMain: 'white',
  textMuted: 'slate-400'
};

// --- COMPONENTES AUXILIARES ---

const ShipAnimationComponent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <div ref={ref} className="relative w-full h-80 overflow-hidden mt-10 md:mt-0 flex items-end justify-center bg-gradient-to-t from-blue-900/10 to-transparent rounded-xl border-b border-blue-900/30">
      <div className="absolute inset-0 flex items-end justify-between px-4 lg:px-10 opacity-10 text-slate-500 pointer-events-none">
        <div className="w-12 h-64 border-t-8 border-r-4 border-current rounded-tr-xl transform -skew-x-12 origin-bottom"></div>
        <div className="w-20 h-48 border-t-8 border-l-4 border-current rounded-tl-xl transform skew-x-6 origin-bottom ml-auto"></div>
        <div className="absolute bottom-10 left-1/3 w-8 h-32 border-l-2 border-current"></div>
      </div>
      <div className="absolute bottom-0 w-full h-4 bg-gradient-to-r from-transparent via-blue-900/50 to-transparent"></div>
      <motion.div
        className="relative z-10 mb-2"
        initial={{ x: 300, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : { x: 300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 30, damping: 25, duration: 2 }}
      >
        <div className="relative">
          <div className="flex gap-0.5 absolute bottom-full mb-0 left-8">
            <div className="w-10 h-8 bg-blue-700 border border-blue-900 rounded-sm shadow-sm"></div>
            <div className="w-10 h-8 bg-orange-600 border border-orange-800 rounded-sm shadow-sm"></div>
            <div className="w-10 h-8 bg-cyan-700 border border-cyan-900 rounded-sm shadow-sm"></div>
          </div>
          <div className="flex gap-0.5 absolute bottom-full mb-8 left-12">
             <div className="w-10 h-8 bg-slate-600 border border-slate-800 rounded-sm shadow-sm"></div>
             <div className="w-10 h-8 bg-blue-600 border border-blue-800 rounded-sm shadow-sm"></div>
          </div>
          <div className="absolute bottom-full right-6 w-16 h-20 bg-slate-100 border-2 border-slate-300 rounded-t-md flex flex-col items-center justify-start pt-2 shadow-lg">
            <div className="w-12 h-4 bg-slate-800 rounded-sm mb-1 border border-slate-600"></div>
            <div className="w-12 h-4 bg-slate-800 rounded-sm border border-slate-600"></div>
            <div className="mt-auto mb-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <div className="w-96 h-20 bg-slate-800 rounded-bl-[3rem] rounded-br-xl relative overflow-hidden shadow-2xl border-t-4 border-red-700">
             <div className="absolute top-3 right-6 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 opacity-60 uppercase">TrueNorth Spirit</span>
             </div>
             <div className="absolute bottom-0 w-full h-2 bg-black/30"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardMockup = () => {
  return (
    <div className="relative group perspective-1000 mt-10 lg:mt-0">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden transform rotate-y-2 transition-transform duration-700 hover:rotate-0">
        <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          <div className="ml-4 flex-1 text-center lg:text-left">
            <div className="text-[10px] text-slate-400 font-mono bg-slate-950/50 px-2 py-0.5 rounded inline-block">truenorth.app/dashboard/duimp</div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/40 p-3 rounded border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">DUIMPs Ativas</div>
              <div className="text-xl font-bold text-white mt-1">42</div>
              <div className="text-[10px] text-green-400 mt-1 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Em dia</div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Risco Elevado</div>
              <div className="text-xl font-bold text-orange-500 mt-1">3</div>
              <div className="text-[10px] text-orange-400 mt-1">Ação imediata</div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Demurrage Evitado</div>
              <div className="text-xl font-bold text-accent-400 mt-1">R$ 84k</div>
              <div className="text-[10px] text-slate-400 mt-1">Últimos 30 dias</div>
            </div>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-end">
               <h4 className="text-xs font-semibold text-slate-300">Tendência de Custos Extras</h4>
               <span className="text-[10px] text-green-400 font-mono">-32% este mês</span>
             </div>
             <div className="h-20 flex items-end justify-between gap-1 pt-2 border-b border-slate-800 pb-2">
                {[65, 50, 70, 40, 35, 55, 30, 20, 25, 15].map((h, i) => (
                  <div key={i} className={`w-full rounded-t hover:opacity-80 transition-opacity ${i > 6 ? 'bg-green-500/40' : 'bg-slate-700'}`} style={{ height: `${h}%` }}></div>
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Alertas Prioritários</div>
            {[
              { msg: "DUIMP 23/45678 — Risco baixo", sub: "Aguardando canal", type: "green" },
              { msg: "DUIMP 23/98765 — Divergência Valor Aduaneiro", sub: "Risco de multa 1%", type: "red" },
              { msg: "DUIMP 24/12345 — LPCO pendente (MAPA)", sub: "Licença não vinculada", type: "yellow" },
            ].map((alert, i) => (
              <div key={i} className="flex items-start justify-between p-2.5 bg-slate-950/30 border border-slate-800 rounded hover:bg-slate-800/50 transition-colors cursor-pointer group/item">
                <div className="flex items-start gap-2.5">
                   <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${alert.type === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : alert.type === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                   <div>
                     <div className="text-xs text-slate-200 font-medium">{alert.msg}</div>
                     <div className="text-[10px] text-slate-500 group-hover/item:text-slate-400">{alert.sub}</div>
                   </div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTES DA LANDING PAGE ---

const Navbar = ({ onSimulateClick }: { onSimulateClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Anchor className="h-7 w-7 text-accent-500" />
            <span className="font-bold text-xl tracking-tight text-white">TrueNorth</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <button onClick={() => scrollToSection('produto')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Produto</button>
              <button onClick={() => scrollToSection('como-funciona')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Como Funciona</button>
              <button onClick={() => scrollToSection('para-quem')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Para Quem</button>
              {/* Botão Simulação agora muda de tela */}
              <button onClick={onSimulateClick} className="text-accent-400 hover:text-accent-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Simulação</button>
              <button onClick={() => scrollToSection('contato')} className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contato</button>
            </div>
          </div>
          <div className="hidden md:block">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40">
              Falar com o time
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => scrollToSection('produto')} className="text-slate-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Produto</button>
              <button onClick={() => scrollToSection('como-funciona')} className="text-slate-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Como Funciona</button>
              <button onClick={() => { setIsOpen(false); onSimulateClick(); }} className="text-accent-400 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Simulação</button>
              <button onClick={() => scrollToSection('contato')} className="text-slate-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Contato</button>
              <button className="w-full text-left bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium mt-4 shadow-md">
                Falar com o time
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onSimulateClick }: { onSimulateClick: () => void }) => {
  return (
    <section id="produto" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/15 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50 text-accent-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
              Plataforma DUIMP Ready
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Menos erro na <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">DUIMP</span>.<br />
              Menos contêiner parado no porto.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Plataforma que integra DUIMP, NCM, LPCO e tributos com os portais oficiais, 
              reduzindo multas, demurrage e retrabalho nas suas importações.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onSimulateClick}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 flex items-center justify-center gap-2 group"
              >
                Quero ver a Simulação <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onSimulateClick}
                className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-slate-200 px-8 py-4 rounded-lg text-base font-medium transition-all flex items-center justify-center hover:border-slate-500"
              >
                Entenda o impacto financeiro
              </button>
            </div>
            <div className="pt-8 border-t border-slate-800/50">
               <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-4">Solução ideal para</p>
               <div className="flex flex-wrap gap-4 text-slate-400 text-sm font-medium">
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-slate-800"><Container className="w-4 h-4" /> Importadores</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-slate-800"><Globe2 className="w-4 h-4" /> Trading Companies</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded border border-slate-800"><Ship className="w-4 h-4" /> Logística</span>
               </div>
            </div>
          </div>
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { id: 1, title: "Importação dos dados", desc: "Ingestão automática de BL, Invoices, Packing List, NCM e catálogo de produtos.", icon: <Globe2 className="w-5 h-5 text-white" /> },
    { id: 2, title: "Validação Inteligente", desc: "Checagem cruzada de NCM, necessidade de LPCO e consistência de dados tributários.", icon: <FileSearch className="w-5 h-5 text-white" /> },
    { id: 3, title: "Integração Portal Único", desc: "Pré-validação dos dados simulando as regras oficiais da Receita Federal.", icon: <ShieldCheck className="w-5 h-5 text-white" /> },
    { id: 4, title: "Alertas e Risco", desc: "Sugestão de correção e estimativa de economia antes do registro oficial.", icon: <AlertTriangle className="w-5 h-5 text-white" /> }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Como a TrueNorth funciona</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Transformamos documentos dispersos em uma operação blindada contra erros.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative group">
              {step.id !== 4 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[1px] bg-slate-800 -z-10 group-hover:bg-primary-900/50 transition-colors" />
              )}
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-primary-600/30 transition-all duration-300 h-full relative z-10 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-xl">
                <div className="w-12 h-12 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:border-primary-500 transition-colors">
                  {step.icon}
                </div>
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                   <span className="text-xs font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded border border-slate-800">0{step.id}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HighLevelFlow = () => {
  return (
    <section className="py-16 bg-slate-950 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400">
          <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-lg border border-slate-800 shadow-sm">
            <Container className="w-5 h-5 text-slate-500" />
            <div className="text-sm font-medium">
              <div className="text-white">Dados de Origem</div>
              <div className="text-xs text-slate-500">Cliente / Exportador</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
          <ArrowDown className="w-5 h-5 text-slate-600 md:hidden" />
          <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-lg border-2 border-primary-900/30 shadow-[0_0_20px_rgba(37,99,235,0.1)] relative">
            <div className="absolute -top-3 left-4 bg-primary-600 text-[10px] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Engine</div>
            <Anchor className="w-6 h-6 text-primary-500" />
            <div className="text-sm font-medium">
              <div className="text-white font-bold">TrueNorth</div>
              <div className="text-xs text-primary-400/80">Validação & Inteligência</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
          <ArrowDown className="w-5 h-5 text-slate-600 md:hidden" />
          <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-lg border border-slate-800 shadow-sm opacity-80">
            <Globe2 className="w-5 h-5 text-slate-500" />
            <div className="text-sm font-medium">
              <div className="text-white">Portal Único</div>
              <div className="text-xs text-slate-500">Receita Federal</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
          <ArrowDown className="w-5 h-5 text-slate-600 md:hidden" />
          <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-lg border border-slate-800 shadow-sm opacity-80">
            <CheckCircle2 className="w-5 h-5 text-green-500/50" />
            <div className="text-sm font-medium">
              <div className="text-white">Liberação</div>
              <div className="text-xs text-slate-500">Desembaraço Ágil</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const BenefitsSection = () => {
  const benefits = [
    { title: "Redução de Demurrage", value: "Até 40%", sub: "menos incidentes", desc: "Menos tempo de conferência significa liberação mais rápida e menos custos de armazenagem.", icon: <Clock /> },
    { title: "Menos multas NCM", value: "Zero", sub: "erros de classificação", desc: "Validação preditiva elimina multas por classificação incorreta antes do registro.", icon: <ShieldCheck /> },
    { title: "Eficiência Operacional", value: "-80h", sub: "por mês", desc: "Elimine o retrabalho manual e a conferência de planilhas infinitas.", icon: <BarChart3 /> },
    { title: "Previsibilidade", value: "100%", sub: "controle de lead time", desc: "Controle centralizado de todos os processos, licenças e custos estimados.", icon: <Container /> },
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
                <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300 font-medium text-sm">{item.title}</span>
                    <span className="text-primary-500 bg-primary-500/10 p-1.5 rounded-md">{React.cloneElement(item.icon, { className: "w-4 h-4" })}</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-0.5">{item.value}</div>
                  <div className="text-xs font-semibold text-accent-500 uppercase tracking-wide mb-3">{item.sub}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[500px] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden p-8">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
             <div className="w-full max-w-sm">
                <div className="flex justify-between text-xs text-slate-500 mb-2 uppercase font-semibold tracking-wider">
                  <span>Sem TrueNorth</span>
                  <span>Com TrueNorth</span>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 flex flex-col gap-1 items-end">
                    <div className="w-full h-8 bg-red-900/40 rounded flex items-center justify-end px-2 text-xs text-red-200">Risco Alto</div>
                  </div>
                  <div className="w-px h-10 bg-slate-800"></div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="w-1/4 h-8 bg-green-900/40 rounded flex items-center px-2 text-xs text-green-200 whitespace-nowrap">Risco Baixo</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 flex flex-col gap-1 items-end">
                    <div className="w-3/4 h-8 bg-slate-700 rounded flex items-center justify-end px-2 text-xs text-slate-300">5 dias</div>
                  </div>
                  <div className="w-px h-10 bg-slate-800"></div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="w-1/4 h-8 bg-primary-900/40 rounded border border-primary-500/30 flex items-center px-2 text-xs text-primary-200">1 dia</div>
                  </div>
                </div>
                <div className="mt-8 flex justify-center relative">
                   <div className="w-48 h-48 rounded-full border border-slate-800 bg-slate-900/50 flex items-center justify-center relative shadow-[0_0_40px_rgba(2,6,23,0.8)_inset]">
                      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 192 192">
                         <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                         <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={2 * Math.PI * 80} strokeDashoffset={2 * Math.PI * 80 * (1 - 0.98)} strokeLinecap="round" className="text-primary-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      </svg>
                      <div className="text-center z-10">
                        <div className="text-4xl font-bold text-white tracking-tight">98%</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Conformidade</div>
                      </div>
                   </div>
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
    <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-white mb-6">O porto seguro da sua operação</h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>Somos um time focado em reduzir erro e ociosidade nas importações brasileiras. A complexidade da DUIMP não precisa ser um risco para o seu negócio.</p>
              <p>Combinamos conhecimento aduaneiro profundo, tecnologia de ponta e IA para tornar o processo de importação mais inteligente, previsível e ágil.</p>
              <div className="bg-slate-950/50 p-6 border-l-4 border-primary-600 rounded-r-lg">
                <p className="text-white font-medium italic">"Nosso objetivo é dar previsibilidade de custo e tempo para operações que não podem se dar ao luxo de ficar com contêiner parado no porto."</p>
              </div>
            </div>
          </div>
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
    { title: "Importadores Médios", items: ["Visão consolidada de todos os processos", "Alertas de custo em tempo real", "Compliance fiscal automatizado"] },
    { title: "Trading Companies", items: ["Gestão de múltiplos clientes e CNPJs", "Histórico centralizado de NCMs", "Redução de lead-time operacional"] },
    { title: "Operadores Logísticos", items: ["Previsibilidade de atracação", "Integração via API com sistemas legados", "Status unificado para o cliente final"] },
    { title: "Despachantes Aduaneiros", items: ["Validação prévia de documentos", "Menos digitação manual", "Foco em inteligência e consultoria"] }
  ];

  return (
    <section id="para-quem" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">Quem usa a TrueNorth?</h2>
          <p className="mt-4 text-slate-400">Desenhado para quem movimenta o comércio exterior brasileiro.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-accent-500/30 hover:shadow-lg transition-all group">
              <h3 className="text-lg font-bold text-white mb-6 group-hover:text-accent-400 transition-colors">{persona.title}</h3>
              <ul className="space-y-4">
                {persona.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
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

const CTASection = ({ onSimulateClick }: { onSimulateClick: () => void }) => {
  return (
    <section id="contato" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-900/10 radial-gradient-mask pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Quer testar a TrueNorth na sua operação?
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Conectamos com seus dados atuais de forma segura e mostramos onde você pode reduzir custos e atrasos na sua importação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg shadow-primary-600/25 w-full sm:w-auto hover:-translate-y-1">
              Agendar conversa
            </button>
            <button 
              onClick={onSimulateClick}
              className="bg-transparent border border-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all w-full sm:w-auto"
            >
              Ver Simulação de Impacto
            </button>
          </div>
          <div className="mt-8 text-xs text-slate-500">
             Sem compromisso. Setup inicial em menos de 24h.
          </div>
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
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Inteligência e compliance para o novo processo de importação brasileiro. 
              Tecnologia que navega a burocracia para você, do embarque ao desembaraço.
            </p>
            <div className="mt-6 flex gap-4">
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">In</div>
              <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors">Ig</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Funcionalidades</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Integração Portal Único</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">API & Docs</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Segurança</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Termos de Uso</a></li>
              <li><a href="mailto:contato@truenorth.com.br" className="text-slate-400 hover:text-primary-400 transition-colors">contato@truenorth.com.br</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} TrueNorth RegTech Ltda. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
             <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Sistema Operacional</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- PÁGINAS PRINCIPAIS ---

// 1. LANDING PAGE WRAPPER
const LandingPage = ({ onNavigateToSimulation }: { onNavigateToSimulation: () => void }) => {
  return (
    <>
      <Navbar onSimulateClick={onNavigateToSimulation} />
      <Hero onSimulateClick={onNavigateToSimulation} />
      <HighLevelFlow />
      <HowItWorks />
      <BenefitsSection />
      <AboutSectionWithShip />
      <ForWhomSection />
      <CTASection onSimulateClick={onNavigateToSimulation} />
    </>
  );
};

// 2. SIMULATION PAGE WRAPPER
// Modal de Relatório Detalhado
const ReportModal = ({ results, onClose }: { results: any, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-accent-500" /> Relatório Detalhado
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
             {/* Item 1 */}
             <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-red-900/30 rounded text-red-400"><AlertTriangle className="w-4 h-4" /></div>
                     <div>
                       <div className="text-sm font-semibold text-slate-200">Mitigação de Multas</div>
                       <div className="text-xs text-slate-500">NCM e Administrativas</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{results.details?.fines}</div>
                    <div className="text-[10px] text-green-400">Economia projetada</div>
                  </div>
               </div>
               <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-red-500 h-full w-[40%] rounded-full"></div>
               </div>
             </div>

             {/* Item 2 */}
             <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-orange-900/30 rounded text-orange-400"><Clock className="w-4 h-4" /></div>
                     <div>
                       <div className="text-sm font-semibold text-slate-200">Redução de Demurrage</div>
                       <div className="text-xs text-slate-500">Otimização de tempo</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{results.details?.demurrage}</div>
                    <div className="text-[10px] text-green-400">Economia projetada</div>
                  </div>
               </div>
               <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-orange-500 h-full w-[60%] rounded-full"></div>
               </div>
             </div>

             {/* Item 3 */}
             <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-blue-900/30 rounded text-blue-400"><TrendingDown className="w-4 h-4" /></div>
                     <div>
                       <div className="text-sm font-semibold text-slate-200">Eficiência Operacional</div>
                       <div className="text-xs text-slate-500">Redução de retrabalho</div>
                     </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{results.details?.ops}</div>
                    <div className="text-[10px] text-green-400">Economia projetada</div>
                  </div>
               </div>
               <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full w-[25%] rounded-full"></div>
               </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
             <div>
               <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total de Economia</span>
               <div className="text-2xl font-bold text-green-400">{results.details?.total}</div>
             </div>
             <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
               <Download className="w-4 h-4" /> Baixar PDF
             </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PlatformSimulationPage = ({ onNavigateHome }: { onNavigateHome: () => void }) => {
  const [operationData, setOperationData] = useState({
    type: 'Importação Própria',
    urf: 'Santos (SP)',
    country: 'China',
    modality: 'Normal',
    sector: 'Outros'
  });

  const [items, setItems] = useState([
    { id: 1, desc: '', ncm: '', weight: '', value: '' }
  ]);

  const [compliance, setCompliance] = useState({
    anvisa: false,
    mapa: false,
    outros: false,
    lpcoRequested: false
  });

  const [calculating, setCalculating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [results, setResults] = useState<null | {
    risks: string[],
    impactRange: string,
    totalImpact: string,
    avoided: string,
    details: {
      fines: string,
      demurrage: string,
      ops: string,
      total: string
    }
  }>(null);

  const handleItemChange = (id: number, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    if (items.length < 3) {
      setItems([...items, { id: Date.now(), desc: '', ncm: '', weight: '', value: '' }]);
    }
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const runSimulation = () => {
    setCalculating(true);
    setResults(null);
    setShowReport(false);

    setTimeout(() => {
      const risks = [];
      let impactLow = 0;
      let impactHigh = 0;

      const emptyNCMs = items.filter(i => !i.ncm);
      if (emptyNCMs.length > 0) {
        risks.push(`NCM não informada para ${emptyNCMs.length} item(s). Multa potencial de 1% sobre valor aduaneiro.`);
        impactLow += 500 * emptyNCMs.length;
        impactHigh += 2000 * emptyNCMs.length;
      }

      const subValueRisks = items.filter(i => {
         const w = parseFloat(i.weight) || 0;
         const v = parseFloat(i.value) || 0;
         return w > 0 && v < w * 2;
      });
      if (subValueRisks.length > 0) {
        risks.push("Risco de subfaturamento identificado (Valor/Peso abaixo da média do setor).");
        impactLow += 5000;
        impactHigh += 15000;
      }

      const requiresAnuente = ['Alimentos/Bebidas', 'Cosméticos', 'Químico'].includes(operationData.sector);
      const hasAnuenteChecked = compliance.anvisa || compliance.mapa || compliance.outros;
      
      if (requiresAnuente && !hasAnuenteChecked) {
        risks.push(`Setor ${operationData.sector} geralmente exige LPCO (Anuente) não assinalado.`);
        impactLow += 2000;
        impactHigh += 5000;
      }

      if (requiresAnuente && !compliance.lpcoRequested) {
        risks.push("LPCO não solicitado previamente. Alto risco de retenção de carga (Demurrage).");
        impactLow += 10000;
        impactHigh += 40000;
      }

      if (risks.length === 0) {
        risks.push("Nenhum risco crítico identificado nesta simulação preliminar.");
      }

      const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      
      const totalAvoidedRaw = impactHigh * 0.85;
      const finesPart = totalAvoidedRaw * 0.40;
      const demurragePart = totalAvoidedRaw * 0.40;
      const opsPart = totalAvoidedRaw * 0.20;

      setResults({
        risks,
        impactRange: `${fmt(impactLow)} a ${fmt(impactHigh)}`,
        totalImpact: fmt(impactHigh + (impactHigh * 0.2)),
        avoided: fmt(totalAvoidedRaw),
        details: {
          fines: fmt(finesPart),
          demurrage: fmt(demurragePart),
          ops: fmt(opsPart),
          total: fmt(totalAvoidedRaw)
        }
      });

      setCalculating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-primary-600 selection:text-white">
      {/* Simulation Header */}
      <nav className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
              <Anchor className="h-6 w-6 text-accent-500" />
              <span className="font-bold text-lg tracking-tight text-white">TrueNorth</span>
           </div>
           <button 
             onClick={onNavigateHome}
             className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
           >
             <Home className="w-4 h-4" /> Home
           </button>
        </div>
      </nav>

      <main className="py-12 md:py-16">
        <AnimatePresence>
          {showReport && results && (
            <ReportModal results={results} onClose={() => setShowReport(false)} />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-4">
               Ambiente de Teste
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Simulação da Plataforma TrueNorth</h1>
             <p className="text-slate-400 max-w-2xl mx-auto">
               Preencha os dados abaixo para estimar riscos, impacto financeiro e oportunidades de redução de inconsistências nas suas importações.
             </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            
            {/* Coluna 1: Formulário */}
            <div className="space-y-8">
              {/* Bloco 1: Dados da Operação */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
                  <span className="bg-primary-600 text-xs rounded px-2 py-0.5">1</span> Dados da Operação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-slate-400 mb-1.5">Tipo de Operação</label>
                     <select 
                       className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                       value={operationData.type}
                       onChange={(e) => setOperationData({...operationData, type: e.target.value})}
                     >
                       <option>Importação Própria</option>
                       <option>Conta e Ordem</option>
                       <option>Encomenda</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs text-slate-400 mb-1.5">URF de Despacho</label>
                     <select 
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                        value={operationData.urf}
                        onChange={(e) => setOperationData({...operationData, urf: e.target.value})}
                     >
                       <option>Santos (SP)</option>
                       <option>Rio de Janeiro (RJ)</option>
                       <option>Itajaí (SC)</option>
                       <option>Paranaguá (PR)</option>
                       <option>Aeroporto Guarulhos (SP)</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs text-slate-400 mb-1.5">País de Procedência</label>
                     <select 
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                        value={operationData.country}
                        onChange={(e) => setOperationData({...operationData, country: e.target.value})}
                     >
                       <option>China</option>
                       <option>Estados Unidos</option>
                       <option>Alemanha</option>
                       <option>Argentina</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs text-slate-400 mb-1.5">Setor do Produto</label>
                     <select 
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500"
                        value={operationData.sector}
                        onChange={(e) => setOperationData({...operationData, sector: e.target.value})}
                     >
                       <option>Outros</option>
                       <option>Químico</option>
                       <option>Cosméticos</option>
                       <option>Alimentos/Bebidas</option>
                       <option>Autopeças</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Bloco 2: Itens e NCM */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="bg-primary-600 text-xs rounded px-2 py-0.5">2</span> Itens e NCM
                  </h3>
                  <button onClick={addItem} className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50" disabled={items.length >= 3}>
                    <Plus className="w-3 h-3" /> Adicionar Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="relative bg-slate-950/50 p-3 rounded border border-slate-800">
                      <div className="grid grid-cols-12 gap-3">
                         <div className="col-span-12 sm:col-span-5">
                            <input 
                              placeholder="Descrição do Produto"
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 focus:border-primary-500 outline-none placeholder:text-slate-600"
                              value={item.desc}
                              onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)}
                            />
                         </div>
                         <div className="col-span-6 sm:col-span-3">
                            <input 
                              placeholder="NCM (8 dígitos)"
                              maxLength={8}
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 focus:border-primary-500 outline-none placeholder:text-slate-600"
                              value={item.ncm}
                              onChange={(e) => handleItemChange(item.id, 'ncm', e.target.value)}
                            />
                         </div>
                         <div className="col-span-3 sm:col-span-2">
                            <input 
                              placeholder="Peso (kg)"
                              type="number"
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 focus:border-primary-500 outline-none placeholder:text-slate-600"
                              value={item.weight}
                              onChange={(e) => handleItemChange(item.id, 'weight', e.target.value)}
                            />
                         </div>
                         <div className="col-span-3 sm:col-span-2">
                            <input 
                              placeholder="Valor ($)"
                              type="number"
                              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 focus:border-primary-500 outline-none placeholder:text-slate-600"
                              value={item.value}
                              onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                            />
                         </div>
                      </div>
                      {items.length > 1 && (
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 bg-slate-800 text-slate-400 p-1 rounded-full hover:bg-red-900/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco 3: Compliance & Action */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
                 <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                    <span className="bg-primary-600 text-xs rounded px-2 py-0.5">3</span> Compliance (Simulação)
                 </h3>
                 
                 <div className="flex flex-col sm:flex-row gap-6 mb-6">
                   <div className="flex-1">
                      <span className="block text-xs text-slate-400 mb-2">Exige anuência?</span>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                          <input type="checkbox" checked={compliance.anvisa} onChange={e => setCompliance({...compliance, anvisa: e.target.checked})} className="rounded bg-slate-900 border-slate-700 text-primary-600 focus:ring-offset-slate-900" />
                          ANVISA
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                          <input type="checkbox" checked={compliance.mapa} onChange={e => setCompliance({...compliance, mapa: e.target.checked})} className="rounded bg-slate-900 border-slate-700 text-primary-600 focus:ring-offset-slate-900" />
                          MAPA
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                          <input type="checkbox" checked={compliance.outros} onChange={e => setCompliance({...compliance, outros: e.target.checked})} className="rounded bg-slate-900 border-slate-700 text-primary-600 focus:ring-offset-slate-900" />
                          Outros
                        </label>
                      </div>
                   </div>
                   <div className="flex-1">
                      <span className="block text-xs text-slate-400 mb-2">LPCO já solicitado?</span>
                      <div className="flex items-center gap-4">
                         <button 
                           onClick={() => setCompliance({...compliance, lpcoRequested: true})}
                           className={`flex-1 py-2 px-3 rounded text-sm font-medium border transition-colors ${compliance.lpcoRequested ? 'bg-primary-600/20 border-primary-600 text-primary-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                         >
                           Sim
                         </button>
                         <button 
                           onClick={() => setCompliance({...compliance, lpcoRequested: false})}
                           className={`flex-1 py-2 px-3 rounded text-sm font-medium border transition-colors ${!compliance.lpcoRequested ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                         >
                           Não
                         </button>
                      </div>
                   </div>
                 </div>

                 <button 
                   onClick={runSimulation}
                   disabled={calculating}
                   className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary-900/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                   {calculating ? (
                     <>
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processando...
                     </>
                   ) : (
                     <>
                      <Calculator className="w-5 h-5" /> Rodar Validação Simulada
                     </>
                   )}
                 </button>
              </div>
            </div>

            {/* Coluna 2: Resultados */}
            <div className="relative">
               {!results && !calculating && (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 border border-slate-800 border-dashed rounded-xl z-10 backdrop-blur-[2px]">
                   <div className="text-center p-8">
                     <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                       <FileCheck className="w-8 h-8 text-slate-600" />
                     </div>
                     <h3 className="text-lg font-medium text-slate-300">Aguardando dados</h3>
                     <p className="text-sm text-slate-500 mt-2">Preencha o formulário e clique em "Rodar Validação" para ver os resultados.</p>
                   </div>
                 </div>
               )}

               <div className={`space-y-6 transition-opacity duration-500 ${(results || calculating) ? 'opacity-100' : 'opacity-30 blur-sm'}`}>
                  {/* Card de Riscos */}
                  <div className="bg-slate-900 border-l-4 border-l-orange-500 p-6 rounded-r-xl border-y border-r border-slate-800 shadow-md">
                     <h4 className="text-orange-500 font-bold mb-4 flex items-center gap-2">
                       <AlertTriangle className="w-5 h-5" /> Riscos Identificados
                     </h4>
                     <ul className="space-y-3">
                       {results?.risks.map((risk, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 bg-slate-950/50 p-3 rounded">
                           <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                           {risk}
                         </li>
                       )) || (
                         <li className="text-sm text-slate-500 italic">Aguardando processamento...</li>
                       )}
                     </ul>
                  </div>

                  {/* Card de Impacto Financeiro */}
                  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-md relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <BarChart3 className="w-24 h-24 text-slate-500" />
                     </div>
                     <h4 className="text-white font-bold mb-6 relative z-10">Impacto Financeiro Potencial</h4>
                     
                     <div className="mb-6">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Custo estimado de erros</span>
                        <div className="text-2xl sm:text-3xl font-bold text-white mt-1">
                          {results?.impactRange || "R$ 0,00"}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Considerando multas, retificações e custo base de armazenagem.</p>
                     </div>
                     
                     <div className="pt-4 border-t border-slate-800">
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Impacto Total (Risco)</span>
                        <div className="text-lg font-semibold text-red-400 mt-1">
                          {results?.totalImpact || "R$ 0,00"}
                        </div>
                     </div>
                  </div>

                  {/* Card de Economia (Verde) */}
                  <div className="bg-gradient-to-br from-primary-900/40 to-slate-900 p-6 rounded-xl border border-primary-900/50 shadow-lg relative overflow-hidden group hover:border-primary-600/30 transition-colors">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>
                     
                     <h4 className="text-white font-bold mb-2 relative z-10 flex items-center gap-2">
                       <ShieldCheck className="w-5 h-5 text-green-400" /> Custos Evitados com TrueNorth
                     </h4>
                     
                     <p className="text-sm text-slate-400 mb-6 relative z-10">
                       Com validação pré-DUIMP, nossa IA detecta 98% destes erros antes do registro.
                     </p>

                     <div className="relative z-10 bg-slate-950/60 p-4 rounded-lg border border-primary-900/30">
                        <span className="text-xs text-green-400 uppercase font-bold tracking-wider block mb-1">Economia Projetada</span>
                        <div className="text-3xl font-bold text-white tracking-tight">
                          {results?.avoided || "R$ 0,00"}
                        </div>
                     </div>
                     
                     <div className="mt-4 text-center">
                       <button 
                         onClick={() => setShowReport(true)}
                         className="text-xs text-primary-400 hover:text-primary-300 font-medium underline underline-offset-4"
                       >
                         Ver relatório detalhado
                       </button>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'simulation'>('landing');

  // Função para navegar para a simulação (rola para o topo)
  const navigateToSimulation = () => {
    setCurrentScreen('simulation');
    window.scrollTo(0, 0);
  };

  // Função para voltar para a home (rola para o topo)
  const navigateHome = () => {
    setCurrentScreen('landing');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentScreen === 'landing' ? (
        <LandingPage onNavigateToSimulation={navigateToSimulation} />
      ) : (
        <PlatformSimulationPage onNavigateHome={navigateHome} />
      )}
    </>
  );
}
