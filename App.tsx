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
  ChevronDown,
  Ship,
  FileCheck,
  Download,
  XCircle,
  TrendingDown,
  Home,
  FileText,
  Upload,
  Sparkles,
  Copy,
  Zap,
  Timer,
  AlertCircle,
  Building2,
  DollarSign,
  Lock,
  LogOut,
  User,
  Pen
} from 'lucide-react';

// --- API CLIENT ---
import * as api from './api';

// --- CONSTANTES & CONFIGURAÇÃO ---
const COLORS = {
  bg: 'slate-950', // #020817
  primary: 'primary-600', // #2563EB
  accent: 'accent-500', // #06B6D4
  warning: 'orange-500', // #F97316
  textMain: 'white',
  textMuted: 'slate-400'
};

// --- LISTA DE PAÍSES QUE MAIS EXPORTAM PARA O BRASIL ---
const PAISES_IMPORTADORES = [
  'China',
  'Estados Unidos',
  'Alemanha',
  'Argentina',
  'Índia',
  'Coreia do Sul',
  'Itália',
  'Japão',
  'França',
  'México',
  'Reino Unido',
  'Chile',
  'Espanha',
  'Rússia',
  'Países Baixos',
  'Canadá',
  'Paraguai',
  'Taiwan',
  'Suíça',
  'Bélgica',
  'Colômbia',
  'Vietnã',
  'Tailândia',
  'Malásia',
  'Arábia Saudita',
  'Nigéria',
  'Indonésia',
  'Portugal',
  'Peru',
  'Uruguai'
];

// --- LISTA DE ÓRGÃOS ANUENTES ---
const LISTA_ANUENTES = [
  'ANVISA',
  'ANATEL',
  'ANM',
  'ANEEL',
  'ANP',
  'CNEN',
  'CNPq',
  'COMEXE',
  'DECEX',
  'DPF',
  'ECT',
  'IBAMA',
  'INMETRO',
  'MAPA',
  'MCTI',
  'SUFRAMA'
];

// --- FUNÇÕES AUXILIARES DE NEGÓCIO ---

// Lógica crítica de risco NCM
function calcularRiscoNCM(ncm: string, inadimplencia: number): number {
  const limpo = (ncm || "").replace(/\D/g, "");
  const ncmInvalido = limpo.length !== 8;

  if (ncmInvalido) {
    // Clamping inadimplencia entre 0 e 1
    const inad = Math.min(Math.max(inadimplencia, 0), 1);
    // Fórmula: 85 + (inadimplencia * 15)
    const risco = 85 + (inad * 15);
    return Math.round(risco); // Retorna inteiro entre 85 e 100
  }

  return 0; // NCM válido (8 dígitos) não gera risco específico de formato
}

// --- BASE DE NCMs COM REGRAS DE COMPLIANCE ---
const NCM_DATABASE: Record<string, {
  desc: string;
  aliquotaII: number;
  aliquotaIPI: number;
  anuentes: string[];
  exTarifario?: boolean;
  destaque?: string;
}> = {
  // ELETRÔNICOS (Cap. 84-85)
  '85171231': { desc: 'Telefones celulares', aliquotaII: 16, aliquotaIPI: 15, anuentes: ['ANATEL'] },
  '85171291': { desc: 'Aparelhos para transmissão de dados sem fio', aliquotaII: 16, aliquotaIPI: 15, anuentes: ['ANATEL'] },
  '85183000': { desc: 'Fones de ouvido e auriculares', aliquotaII: 20, aliquotaIPI: 15, anuentes: ['ANATEL'] },
  '84713012': { desc: 'Notebooks e laptops', aliquotaII: 16, aliquotaIPI: 15, anuentes: ['ANATEL'], exTarifario: true },
  '84717020': { desc: 'Unidades de disco rígido (HDD)', aliquotaII: 2, aliquotaIPI: 0, anuentes: [] },
  '85234110': { desc: 'Cartões de memória flash', aliquotaII: 16, aliquotaIPI: 15, anuentes: [] },
  '85285990': { desc: 'Monitores de vídeo', aliquotaII: 20, aliquotaIPI: 15, anuentes: [] },
  '84719000': { desc: 'Outras máquinas de processamento de dados', aliquotaII: 16, aliquotaIPI: 0, anuentes: [] },

  // AUTOPEÇAS (Cap. 87)
  '87089990': { desc: 'Outras partes e acessórios de veículos', aliquotaII: 18, aliquotaIPI: 5, anuentes: ['INMETRO'] },
  '87088000': { desc: 'Amortecedores de suspensão', aliquotaII: 18, aliquotaIPI: 5, anuentes: ['INMETRO'] },
  '87083010': { desc: 'Freios e suas partes', aliquotaII: 18, aliquotaIPI: 5, anuentes: ['INMETRO'] },
  '87084090': { desc: 'Caixas de marchas', aliquotaII: 18, aliquotaIPI: 5, anuentes: ['INMETRO'] },
  '87085099': { desc: 'Eixos e semi-eixos', aliquotaII: 18, aliquotaIPI: 5, anuentes: ['INMETRO'] },
  '87087010': { desc: 'Rodas e suas partes', aliquotaII: 18, aliquotaIPI: 5, anuentes: ['INMETRO'] },
  '40111000': { desc: 'Pneus novos para automóveis', aliquotaII: 16, aliquotaIPI: 0, anuentes: ['INMETRO', 'IBAMA'] },
  '68138100': { desc: 'Pastilhas de freio', aliquotaII: 14, aliquotaIPI: 0, anuentes: ['INMETRO'] },

  // COSMÉTICOS (Cap. 33)
  '33049990': { desc: 'Outros produtos de beleza ou maquiagem', aliquotaII: 18, aliquotaIPI: 22, anuentes: ['ANVISA'] },
  '33049100': { desc: 'Pós para maquiagem', aliquotaII: 18, aliquotaIPI: 22, anuentes: ['ANVISA'] },
  '33041000': { desc: 'Produtos de maquiagem para lábios', aliquotaII: 18, aliquotaIPI: 22, anuentes: ['ANVISA'] },
  '33042090': { desc: 'Produtos de maquiagem para olhos', aliquotaII: 18, aliquotaIPI: 22, anuentes: ['ANVISA'] },
  '33051000': { desc: 'Xampus', aliquotaII: 18, aliquotaIPI: 7, anuentes: ['ANVISA'] },
  '33059000': { desc: 'Outras preparações capilares', aliquotaII: 18, aliquotaIPI: 7, anuentes: ['ANVISA'] },
  '33061000': { desc: 'Dentifrícios', aliquotaII: 18, aliquotaIPI: 0, anuentes: ['ANVISA'] },
  '33030010': { desc: 'Perfumes e águas-de-colônia', aliquotaII: 18, aliquotaIPI: 42, anuentes: ['ANVISA'] },

  // ALIMENTOS (Cap. 16-22)
  '22041000': { desc: 'Vinhos espumantes', aliquotaII: 27, aliquotaIPI: 40, anuentes: ['MAPA'] },
  '22042100': { desc: 'Outros vinhos em recipientes até 2L', aliquotaII: 27, aliquotaIPI: 30, anuentes: ['MAPA'] },
  '22030000': { desc: 'Cervejas de malte', aliquotaII: 20, aliquotaIPI: 40, anuentes: ['MAPA'] },
  '18063100': { desc: 'Chocolates recheados', aliquotaII: 20, aliquotaIPI: 5, anuentes: ['MAPA'] },
  '18063200': { desc: 'Chocolate em tabletes ou barras', aliquotaII: 20, aliquotaIPI: 5, anuentes: ['MAPA'] },
  '21069090': { desc: 'Outras preparações alimentícias', aliquotaII: 16, aliquotaIPI: 0, anuentes: ['ANVISA', 'MAPA'] },
  '16010000': { desc: 'Embutidos e produtos similares de carne', aliquotaII: 16, aliquotaIPI: 0, anuentes: ['MAPA'] },
  '04069000': { desc: 'Outros queijos', aliquotaII: 28, aliquotaIPI: 0, anuentes: ['MAPA'] },
  '20098900': { desc: 'Outros sucos de frutas', aliquotaII: 14, aliquotaIPI: 0, anuentes: ['MAPA'] },

  // MÁQUINAS INDUSTRIAIS (Cap. 84)
  '84798999': { desc: 'Outras máquinas e aparelhos mecânicos', aliquotaII: 14, aliquotaIPI: 0, anuentes: [], exTarifario: true },
  '84212300': { desc: 'Aparelhos para filtrar óleos', aliquotaII: 14, aliquotaIPI: 0, anuentes: [] },
  '84229090': { desc: 'Partes de máquinas de lavar louça', aliquotaII: 18, aliquotaIPI: 0, anuentes: [] },
  '84314990': { desc: 'Partes de guindastes e gruas', aliquotaII: 14, aliquotaIPI: 5, anuentes: [] },
  '84329000': { desc: 'Partes de máquinas agrícolas', aliquotaII: 0, aliquotaIPI: 0, anuentes: ['MAPA'], destaque: 'Máquinas agrícolas' },
  '84248990': { desc: 'Outros aparelhos mecânicos para projetar', aliquotaII: 14, aliquotaIPI: 5, anuentes: [] },
  '84223000': { desc: 'Máquinas de encher, fechar ou etiquetar', aliquotaII: 14, aliquotaIPI: 0, anuentes: [], exTarifario: true },
  '84669400': { desc: 'Partes para máquinas-ferramenta', aliquotaII: 14, aliquotaIPI: 0, anuentes: [] },

  // TÊXTEIS (Cap. 50-63)
  '62034200': { desc: 'Calças masculinas de algodão', aliquotaII: 35, aliquotaIPI: 0, anuentes: [] },
  '62046200': { desc: 'Calças femininas de algodão', aliquotaII: 35, aliquotaIPI: 0, anuentes: [] },
  '61091000': { desc: 'T-shirts de malha de algodão', aliquotaII: 35, aliquotaIPI: 0, anuentes: [] },
  '62052000': { desc: 'Camisas masculinas de algodão', aliquotaII: 35, aliquotaIPI: 0, anuentes: [] },
  '61046200': { desc: 'Calças femininas de malha de algodão', aliquotaII: 35, aliquotaIPI: 0, anuentes: [] },
  '64039990': { desc: 'Outros calçados de couro', aliquotaII: 35, aliquotaIPI: 0, anuentes: [] },
  '42021200': { desc: 'Malas e maletas com superfície exterior de plástico', aliquotaII: 20, aliquotaIPI: 0, anuentes: [] },
  '42022200': { desc: 'Bolsas com superfície exterior de plástico', aliquotaII: 20, aliquotaIPI: 0, anuentes: [] },

  // QUÍMICOS (Cap. 28-38)
  '29181400': { desc: 'Ácido cítrico', aliquotaII: 12, aliquotaIPI: 0, anuentes: ['ANVISA'], destaque: 'Uso farmacêutico' },
  '29362100': { desc: 'Vitaminas A e seus derivados', aliquotaII: 0, aliquotaIPI: 0, anuentes: ['ANVISA'] },
  '38089410': { desc: 'Desinfetantes', aliquotaII: 14, aliquotaIPI: 0, anuentes: ['ANVISA'] },
  '32089090': { desc: 'Outras tintas e vernizes', aliquotaII: 14, aliquotaIPI: 0, anuentes: ['IBAMA'] },
  '34022000': { desc: 'Preparações tensoativas', aliquotaII: 14, aliquotaIPI: 0, anuentes: ['ANVISA'] },
};

// --- DADOS DE EXEMPLO PARA DEMONSTRAÇÃO ---
const SAMPLE_INVOICES = {
  electronics: {
    // Dados do documento
    name: "Invoice_Eletrônicos_Shenzhen.pdf",
    invoiceNumber: "INV-2024-SZ-00847",
    invoiceDate: "2024-11-15",

    // Dados do fornecedor
    supplier: {
      name: "Shenzhen TechPro Electronics Co., Ltd.",
      address: "Building A12, Huaqiang North, Futian District, Shenzhen 518031, China",
      contact: "export@techpro-sz.cn"
    },

    // Dados comerciais
    incoterm: "FOB Shenzhen",
    currency: "USD",
    totalValue: 18450.00,
    freight: 1250.00,
    insurance: 185.00,

    // Dados da operação
    operation: {
      type: 'Importação Própria',
      urf: 'Santos (SP)',
      country: 'China',
      modality: 'Normal',
      sector: 'Outros'
    },

    // Dados logísticos
    portOrigin: "Shenzhen (CNSZX)",
    portDestination: "Santos (BRSSZ)",
    vessel: "MSC PALOMA III",
    container: "MSCU7234561 - 20' DRY",
    etd: "2024-11-20",
    eta: "2024-12-25",

    // Itens detalhados
    items: [
      {
        id: 1,
        desc: 'Smartphone Android 128GB - Model TP-X15 Pro',
        ncm: '85171231',
        weight: '150',
        value: '15000',
        quantity: '100 UN',
        unitPrice: '150.00',
        origin: 'CN'
      },
      {
        id: 2,
        desc: 'Fone Bluetooth TWS - Model AirBuds Pro 3',
        ncm: '85183000',
        weight: '50',
        value: '3000',
        quantity: '200 UN',
        unitPrice: '15.00',
        origin: 'CN'
      }
    ],

    // Compliance
    compliance: { anvisa: false, mapa: false, outros: false, lpcoRequested: true },
    anuentes: ['ANATEL'],

    // Métricas de processamento
    processingTime: 6,
    manualTimeEstimate: 25
  },

  autoparts: {
    name: "Invoice_Autopeças_Stuttgart.pdf",
    invoiceNumber: "DE-2024-AUT-003291",
    invoiceDate: "2024-11-10",

    supplier: {
      name: "Süddeutsche Automotive GmbH",
      address: "Industriestraße 45, 70565 Stuttgart, Germany",
      contact: "export@sud-auto.de"
    },

    incoterm: "CIF Paranaguá",
    currency: "EUR",
    totalValue: 8750.00,
    freight: 0, // Incluído no CIF
    insurance: 0, // Incluído no CIF

    operation: {
      type: 'Importação Própria',
      urf: 'Paranaguá (PR)',
      country: 'Alemanha',
      modality: 'Normal',
      sector: 'Autopeças'
    },

    portOrigin: "Hamburg (DEHAM)",
    portDestination: "Paranaguá (BRPNG)",
    vessel: "HAMBURG EXPRESS",
    container: "HLCU8547123 - 20' DRY",
    etd: "2024-11-15",
    eta: "2024-12-10",

    items: [
      {
        id: 1,
        desc: 'Kit Embreagem Completo - Ref. VAG-001234',
        ncm: '87089990',
        weight: '25',
        value: '4500',
        quantity: '15 KIT',
        unitPrice: '300.00',
        origin: 'DE'
      },
      {
        id: 2,
        desc: 'Amortecedor Dianteiro Par - Ref. BILSTEIN-B4',
        ncm: '87088000',
        weight: '18',
        value: '3200',
        quantity: '20 PAR',
        unitPrice: '160.00',
        origin: 'DE'
      },
      {
        id: 3,
        desc: 'Pastilha Freio Cerâmica Premium - Ref. ATE-13046',
        ncm: '68138100',
        weight: '5',
        value: '1050',
        quantity: '30 JG',
        unitPrice: '35.00',
        origin: 'DE'
      }
    ],

    compliance: { anvisa: false, mapa: false, outros: true, lpcoRequested: true },
    anuentes: ['INMETRO'],

    processingTime: 8,
    manualTimeEstimate: 30
  },

  cosmetics: {
    name: "Invoice_Cosméticos_NewYork.pdf",
    invoiceNumber: "US-NYC-2024-78456",
    invoiceDate: "2024-11-08",

    supplier: {
      name: "Manhattan Beauty Supplies Inc.",
      address: "350 Fifth Avenue, Suite 4500, New York, NY 10118, USA",
      contact: "international@manhattanbeauty.com"
    },

    incoterm: "DAP Guarulhos Airport",
    currency: "USD",
    totalValue: 12500.00,
    freight: 0, // Incluído no DAP
    insurance: 0, // Incluído no DAP

    operation: {
      type: 'Conta e Ordem',
      urf: 'Aeroporto Guarulhos (SP)',
      country: 'Estados Unidos',
      modality: 'Normal',
      sector: 'Cosméticos'
    },

    portOrigin: "JFK Airport (USJFK)",
    portDestination: "Guarulhos (BRGRU)",
    vessel: "LATAM CARGO 8064",
    awb: "957-12345678",
    etd: "2024-11-12",
    eta: "2024-11-13",

    items: [
      {
        id: 1,
        desc: 'Sérum Vitamina C 30ml - SkinCeuticals C E Ferulic',
        ncm: '33049990',
        weight: '2',
        value: '8500',
        quantity: '50 UN',
        unitPrice: '170.00',
        origin: 'US'
      },
      {
        id: 2,
        desc: 'Creme Anti-idade 50g - La Prairie Platinum Rare',
        ncm: '33049100',
        weight: '3',
        value: '4000',
        quantity: '8 UN',
        unitPrice: '500.00',
        origin: 'CH' // Produto suíço distribuído dos EUA
      }
    ],

    compliance: { anvisa: true, mapa: false, outros: false, lpcoRequested: false },
    anuentes: ['ANVISA'],
    lpcoStatus: 'Pendente - Aguardando registro de produto',

    processingTime: 12,
    manualTimeEstimate: 45
  }
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

// --- COMPONENTES DA FICHA DE PRODUTO ---

const FichaProdutoSimulada = ({ operation, items, inadimplencia }: { operation: any, items: any[], inadimplencia: number }) => {
  const itemPrincipal = items[0];
  const riscoNcmPrincipal = itemPrincipal ? calcularRiscoNCM(itemPrincipal.ncm, inadimplencia) : 0;
  
  // Helpers para estilo de campo desabilitado
  const Field = ({ label, value, highlightRisk, riskLabel, grow }: { label: string, value: string | number, highlightRisk?: boolean, riskLabel?: string, grow?: boolean }) => (
    <div className={`${grow ? 'md:col-span-2' : ''} flex flex-col`}>
      <label className="text-[10px] font-semibold text-slate-500 mb-1">{label}</label>
      <div className={`flex items-center px-3 py-2 rounded text-xs border ${highlightRisk ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
        {value}
      </div>
      {highlightRisk && riskLabel && <span className="text-[9px] text-amber-600 mt-0.5 font-medium">{riskLabel}</span>}
    </div>
  );

  const codigoProduto = itemPrincipal?.desc ? `PRD-${String(Math.floor(Math.random()*9000)+1000)}` : 'PRD-0000';
  const descricaoComplementar = `Operação de importação de ${operation.sector.toLowerCase()} procedente de ${operation.country}, modalidade ${operation.modality.toLowerCase()}. Contém ${items.length} item(ns) com NCM principal ${itemPrincipal?.ncm || 'não informada'}.`;

  return (
    <div className="mt-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-white font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent-500" /> Ficha de Produto (Simulação)
        </h3>
        <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded">Visualização estilo Portal Único</span>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-200 font-sans">
        {/* Header estilo Portal Único */}
        <div className="bg-slate-100 border-b border-slate-300 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">Inclusão de Produto</h2>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <span>Produto</span> <span className="text-slate-400">/</span> <span>Inclusão de Produto</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">RASCUNHO</span>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-slate-50 px-6 pt-4 border-b border-slate-300 flex gap-1 overflow-x-auto">
          <button className="px-6 py-2 bg-white text-slate-800 text-sm font-semibold rounded-t-lg border-t border-x border-slate-300 -mb-px relative z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]">Dados Básicos</button>
          <button className="px-6 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-t-lg border-t border-x border-transparent hover:text-slate-600 cursor-not-allowed">Atributos</button>
          <button className="px-6 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-t-lg border-t border-x border-transparent hover:text-slate-600 cursor-not-allowed">Anexos</button>
          <button className="px-6 py-2 bg-slate-100 text-slate-400 text-sm font-medium rounded-t-lg border-t border-x border-transparent hover:text-slate-600 cursor-not-allowed">Histórico</button>
        </div>

        {/* Conteúdo da Ficha */}
        <div className="p-6 md:p-8 bg-white min-h-[400px]">
          <div className="mb-6 flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-200 pb-2">
             <div className="w-1 h-4 bg-amber-500 rounded-sm"></div> Resumo
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <Field label="Código do produto" value={codigoProduto} />
             <Field label="Versão" value="1.0 (simulação)" />
             <Field label="Situação" value="Rascunho" />
             <Field label="* Modalidade de operação" value={operation.modality} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
             <Field label="* CNPJ raiz da empresa responsável" value={operation.cnpj || "12.345.678/0001-90"} grow />
             <Field label="NALADi" value="—" />
             <Field label="UNSPSC" value="—" />
             <Field label="GPC" value="—" />
             <Field label="GPC - Brick" value="—" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] gap-4 mb-6">
             <Field 
               label="* NCM" 
               value={itemPrincipal?.ncm || ""} 
               highlightRisk={riscoNcmPrincipal >= 85} 
               riskLabel={riscoNcmPrincipal >= 85 ? "NCM INVÁLIDO/RISCO" : undefined}
             />
             <Field label="Descrição NCM" value={itemPrincipal?.desc || "Descrição do produto simulado"} />
             <Field label="Unidade de medida estatística" value="UN" />
          </div>

          <div className="mb-8">
            <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Descrição complementar</label>
            <div className="w-full h-24 bg-slate-100 border border-slate-300 rounded p-3 text-xs text-slate-700 resize-none">
              {descricaoComplementar}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 text-right">3700 restantes</div>
          </div>

          {/* Tabela de Itens */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
             <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                   <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">NCM</th>
                      <th className="px-4 py-3">Peso (kg)</th>
                      <th className="px-4 py-3">Valor ($)</th>
                      <th className="px-4 py-3 text-center">Risco Calculado</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {items.map((item, idx) => {
                     const riscoNcm = calcularRiscoNCM(item.ncm, inadimplencia);
                     const riscoFinal = Math.max(riscoNcm, 0); // Simplificação para visualização
                     const isHighRisk = riscoFinal >= 85;

                     return (
                       <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{item.desc || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded ${isHighRisk ? 'bg-amber-100 text-amber-700 font-bold' : 'text-slate-600'}`}>
                              {item.ncm || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{item.weight}</td>
                          <td className="px-4 py-3 text-slate-600">{item.value}</td>
                          <td className="px-4 py-3 text-center">
                            {isHighRisk ? (
                              <span className="text-red-600 font-bold">{riscoFinal}%</span>
                            ) : (
                              <span className="text-green-600 font-medium">Baixo</span>
                            )}
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
          
          <div className="mt-4 text-[10px] text-slate-400 text-center italic">
             * Campos simulados. O layout acima é uma representação visual inspirada no Portal Único para fins de demonstração.
          </div>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE SECTIONS ---

const HighLevelFlow = () => {
  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Em 3 passos simples</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full md:w-64">
                <Upload className="w-10 h-10 text-primary-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload</h3>
                <p className="text-slate-400 text-sm">Envie PDF, XML ou imagem da invoice comercial.</p>
            </div>
            <ArrowRight className="hidden md:block w-8 h-8 text-slate-600" />
            <ArrowDown className="md:hidden w-8 h-8 text-slate-600" />
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full md:w-64">
                <Sparkles className="w-10 h-10 text-accent-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Análise IA</h3>
                <p className="text-slate-400 text-sm">Extração automática + classificação NCM inteligente.</p>
            </div>
            <ArrowRight className="hidden md:block w-8 h-8 text-slate-600" />
            <ArrowDown className="md:hidden w-8 h-8 text-slate-600" />
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 w-full md:w-64">
                <Download className="w-10 h-10 text-green-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-white mb-2">Exportação</h3>
                <p className="text-slate-400 text-sm">XML pronto para Siscomex + estimativa de impostos.</p>
            </div>
        </div>
      </div>
    </section>
  )
}

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Como a TrueNorth funciona</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Processo simples e automático. Sua invoice vira dados estruturados em segundos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Upload", desc: "Arraste seu PDF, XML ou foto da invoice comercial. Aceitamos qualquer formato legível.", icon: <FileText className="w-6 h-6" /> },
             { title: "Extração IA", desc: "Nossa IA (Gemini 2.0) extrai fornecedor, itens, valores e sugere NCM com nível de confiança.", icon: <Sparkles className="w-6 h-6" /> },
             { title: "Resultado", desc: "Veja impostos estimados (II, IPI, PIS/COFINS), anuentes necessários e exporte XML para Siscomex.", icon: <CheckCircle2 className="w-6 h-6" /> }
           ].map((item, i) => (
             <div key={i} className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
               <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-primary-400 mb-6">
                 {item.icon}
               </div>
               <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
               <p className="text-slate-400 leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}

const BenefitsSection = () => {
   return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              O que você ganha com TrueNorth
            </h2>
            <div className="space-y-6">
              {[
                "Classificação NCM automática com nível de confiança (Alta, Média, Baixa).",
                "Estimativa instantânea de II, IPI e PIS/COFINS.",
                "Identificação automática de anuentes (ANVISA, MAPA, ANATEL...).",
                "Exportação XML compatível com Siscomex.",
                "Alerta de possível subfaturamento na operação."
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-primary-600/20 blur-3xl rounded-full"></div>
             <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="text-sm text-slate-500 uppercase font-semibold mb-2">Tempo de processamento</div>
                  <div className="text-5xl font-bold text-white">~30s</div>
                  <div className="text-slate-400 text-sm mt-2">por invoice</div>
                </div>
                <div className="space-y-4 border-t border-slate-800 pt-6">
                   <div className="flex items-center gap-3">
                     <FileText className="w-5 h-5 text-primary-400" />
                     <span className="text-slate-300">PDF, XML, Imagem</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <Sparkles className="w-5 h-5 text-accent-400" />
                     <span className="text-slate-300">Powered by Gemini 2.0 Flash</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <Download className="w-5 h-5 text-green-400" />
                     <span className="text-slate-300">XML Siscomex pronto</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-cyan-400" />
                     <span className="text-slate-300">Base NCM atualizada</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
   )
}

const AboutSectionWithShip = () => {
    return (
        <section id="sobre" className="py-24 bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                       <ShipAnimationComponent />
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Navegue com segurança no novo processo de importação</h2>
                        <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                            A chegada da DUIMP muda completamente a forma como o Brasil importa. 
                            A TrueNorth é a bússola que guia sua empresa através dessas mudanças, 
                            transformando conformidade em vantagem competitiva.
                        </p>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Não deixe sua carga parada por erros de preenchimento ou falta de licenciamento.
                            Nossa tecnologia antecipa problemas antes que eles cheguem ao porto.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ForWhomSection = () => {
  return (
    <section id="para-quem" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Para quem é a TrueNorth?</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 hover:border-primary-500/50 transition-all group">
               <Ship className="w-10 h-10 text-primary-500 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold text-white mb-3">Importadores</h3>
               <p className="text-slate-400">Que buscam agilidade no desembaraço e redução de custos operacionais.</p>
            </div>
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 hover:border-accent-500/50 transition-all group">
               <Globe2 className="w-10 h-10 text-accent-500 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold text-white mb-3">Trading Companies</h3>
               <p className="text-slate-400">Que gerenciam múltiplas operações e precisam de controle centralizado.</p>
            </div>
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all group">
               <FileCheck className="w-10 h-10 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold text-white mb-3">Despachantes</h3>
               <p className="text-slate-400">Que desejam oferecer um serviço premium e à prova de erros para seus clientes.</p>
            </div>
         </div>
      </div>
    </section>
  )
}

const CTASection = ({ onSimulateClick }: { onSimulateClick: () => void }) => {
  return (
    <section id="contato" className="py-24 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Teste agora com sua invoice</h2>
            <p className="text-primary-100 text-xl mb-10 max-w-2xl mx-auto">
                Faça upload da sua invoice e veja a mágica acontecer. NCM, impostos e anuentes em segundos.
            </p>
            <button
                onClick={onSimulateClick}
                className="bg-white text-primary-600 hover:bg-slate-100 px-10 py-4 rounded-lg text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 mx-auto"
            >
                <Upload className="w-5 h-5" /> Fazer Upload Agora
            </button>
        </div>
    </section>
  )
}

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
           <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                 <Anchor className="h-6 w-6 text-accent-500" />
                 <span className="font-bold text-lg text-white">TrueNorth</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                 Extraia dados de invoices, classifique NCM e calcule impostos automaticamente com IA.
              </p>
           </div>
           <div>
              <h4 className="text-white font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                 <li><button onClick={() => scrollToSection('produto')} className="hover:text-accent-400 transition-colors">Produto</button></li>
                 <li><button onClick={() => scrollToSection('como-funciona')} className="hover:text-accent-400 transition-colors">Como Funciona</button></li>
                 <li><button onClick={() => scrollToSection('para-quem')} className="hover:text-accent-400 transition-colors">Para Quem</button></li>
                 <li><button onClick={() => scrollToSection('contato')} className="hover:text-accent-400 transition-colors">Contato</button></li>
              </ul>
           </div>
           <div>
              <h4 className="text-white font-semibold mb-4">Funcionalidades</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                 <li className="flex items-center gap-2"><FileText className="w-4 h-4" /> Upload PDF/XML de Invoice</li>
                 <li className="flex items-center gap-2"><Calculator className="w-4 h-4" /> Classificação NCM com IA</li>
                 <li className="flex items-center gap-2"><FileSearch className="w-4 h-4" /> Estimativa de Impostos</li>
                 <li className="flex items-center gap-2"><Download className="w-4 h-4" /> Exportação XML Siscomex</li>
              </ul>
           </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-slate-500 text-sm">© {new Date().getFullYear()} TrueNorth. Todos os direitos reservados.</p>
           <p className="text-slate-600 text-xs">Powered by Gemini 2.0 Flash</p>
        </div>
      </div>
    </footer>
  )
}

// --- PÁGINAS PRINCIPAIS ---

// 1. LANDING PAGE WRAPPER
const Navbar = ({ onSimulateClick, onOpenAuth }: { onSimulateClick: () => void; onOpenAuth: () => void }) => {
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
            <button
              onClick={onOpenAuth}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40"
            >
              Entrar / Cadastrar
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
              <button
                onClick={() => { setIsOpen(false); onOpenAuth(); }}
                className="w-full text-left bg-primary-600 text-white px-3 py-2 rounded-md text-base font-medium mt-4 shadow-md"
              >
                Entrar / Cadastrar
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
              Sua invoice analisada em <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">segundos</span>.<br />
              NCM, impostos e anuentes automáticos.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Faça upload da invoice, nossa IA extrai os dados, classifica NCM e calcula impostos.
              Exporte direto para o Siscomex.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onSimulateClick}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 flex items-center justify-center gap-2 group"
              >
                Testar com minha Invoice <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onSimulateClick}
                className="bg-slate-900/50 hover:bg-slate-800 border border-slate-700 text-slate-200 px-8 py-4 rounded-lg text-base font-medium transition-all flex items-center justify-center hover:border-slate-500"
              >
                Ver como funciona
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

// --- COMPONENTE DE AUTENTICAÇÃO ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  setMode: (mode: 'login' | 'register') => void;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, confirmPassword: string, name?: string) => void;
  loading: boolean;
  error: string | null;
}

const AuthModal = ({ isOpen, onClose, mode, setMode, onLogin, onRegister, loading, error }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin(email, password);
    } else {
      onRegister(email, password, confirmPassword, name);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const switchMode = (newMode: 'login' | 'register') => {
    resetForm();
    setMode(newMode);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-6">
            {mode === 'login'
              ? 'Entre para acessar a simulação completa'
              : 'Crie sua conta para acessar a simulação'}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Nome (opcional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Confirmar Senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary-900/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-sm text-slate-400">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </span>
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="ml-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Criar conta' : 'Fazer login'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const LandingPage = ({ onNavigateToSimulation, onOpenAuth }: { onNavigateToSimulation: () => void; onOpenAuth: () => void }) => {
  return (
    <>
      <Navbar onSimulateClick={onNavigateToSimulation} onOpenAuth={onOpenAuth} />
      <Hero onSimulateClick={onNavigateToSimulation} />
      <HighLevelFlow />
      <HowItWorks />
      <BenefitsSection />
      <AboutSectionWithShip />
      <ForWhomSection />
      <CTASection onSimulateClick={onNavigateToSimulation} />
      <Footer />
    </>
  );
};

// 2. SIMULATION PAGE WRAPPER
// Modal de Relatório Detalhado
const ReportModal = ({
  results,
  extractionSummary,
  impostosEstimados,
  selectedAnuentes,
  items,
  aiFeedback,
  alertaSubfaturamento,
  invoiceInfo,
  uploadedFileName,
  timeStats,
  apiValidation,
  lpcoRequested,
  onClose
}: {
  results: {
    risks: string[];
    impactRange: string;
    totalImpact: string;
    avoided: string;
    details: { fines: string; demurrage: string; ops: string; total: string };
    inadimplencia: number;
  };
  extractionSummary: {
    totalItems: number;
    totalValue: number;
    currency: string;
    sector: string;
    country: string;
    processingTimeMs: number;
    ncmConfidence: { alta: number; media: number; baixa: number };
  } | null;
  impostosEstimados: {
    ii: number;
    ipi: number;
    pis_cofins: number;
    total_impostos: number;
    base_calculo: number;
  } | null;
  selectedAnuentes: string[];
  items: Array<{
    id: number;
    desc: string;
    ncm: string;
    weight: string;
    value: string;
    ncmDescricao?: string;
    ncmConfianca?: string;
    quantity?: string;
    unitPrice?: string;
    origin?: string;
    anuentes?: string[];
  }>;
  aiFeedback: string | null;
  alertaSubfaturamento: string | null;
  invoiceInfo: { invoice_number: string; supplier: { name: string; country: string } } | null;
  uploadedFileName: string | null;
  timeStats: { started: number; ended: number; saved: number };
  apiValidation: api.ValidationResult | null;
  lpcoRequested: boolean;
  onClose: () => void;
}) => {
  const formatBRL = (value?: number | null) => {
    if (value === null || value === undefined || isNaN(Number(value))) return 'N/D';
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  const sanitizeNcm = (ncm: string) => (ncm || '').replace(/\D/g, '');
  const totalItems = extractionSummary?.totalItems ?? items.length;
  const totalValue = extractionSummary?.totalValue ?? items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const currency = extractionSummary?.currency || 'USD';
  const totalValueLabel = totalValue > 0 ? `${currency} ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/D';
  const ncmConfidence = extractionSummary?.ncmConfidence || {
    alta: items.filter(i => i.ncmConfianca === 'ALTA').length,
    media: items.filter(i => i.ncmConfianca === 'MEDIA').length,
    baixa: items.filter(i => i.ncmConfianca !== 'ALTA' && i.ncmConfianca !== 'MEDIA').length,
  };
  const genericNcmCount = items.filter(i => sanitizeNcm(i.ncm).length !== 8).length;
  const timeSavedLabel = typeof timeStats?.saved === 'number' ? `${timeStats.saved} min` : 'N/D';
  const impostosBreakdown = impostosEstimados ? [
    { label: 'II', value: formatBRL(impostosEstimados.ii) },
    { label: 'IPI', value: formatBRL(impostosEstimados.ipi) },
    { label: 'PIS/COFINS', value: formatBRL(impostosEstimados.pis_cofins) },
    { label: 'Total Estimado', value: formatBRL(impostosEstimados.total_impostos) },
  ] : [];
  const anuentesNaoMarcados = LISTA_ANUENTES.filter(a => !selectedAnuentes.includes(a));
  const riscoGeral = apiValidation?.risco_geral || null;
  const custosValidacao = apiValidation?.custos?.custoTotal ? formatBRL(apiValidation.custos.custoTotal) : null;
  const alertasBase = [
    ...(alertaSubfaturamento ? [alertaSubfaturamento] : []),
    ...results.risks,
  ];
  const alertas = Array.from(new Set(alertasBase));
  const recomendacoes: string[] = [];
  if (aiFeedback) recomendacoes.push(aiFeedback);
  const missingNcm = items.filter(i => !sanitizeNcm(i.ncm)).length;
  if (missingNcm > 0) {
    recomendacoes.push(`${missingNcm} item(s) ainda sem NCM definido. Preencha para reduzir risco.`);
  }
  if (selectedAnuentes.length === 0) {
    recomendacoes.push('Nenhum anuente marcado. Confirme exigências antes do registro.');
  }
  if (!lpcoRequested && selectedAnuentes.length > 0) {
    recomendacoes.push('LPCO não marcado como solicitado. Solicite se houver anuente aplicável.');
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('TrueNorth - Relatório da Operação', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(9);
    doc.text(
      `Arquivo: ${uploadedFileName || invoiceInfo?.invoice_number || 'N/D'} | País: ${extractionSummary?.country || invoiceInfo?.supplier?.country || 'N/D'}`,
      pageWidth / 2,
      26,
      { align: 'center' }
    );

    y = 42;
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(13);
    doc.text('Sumário Executivo', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Economia estimada: ${results.details?.total || 'N/D'}`, 14, y); y += 6;
    doc.text(`Riscos mitigados: ${results.risks.length}`, 14, y); y += 6;
    doc.text(`Tempo economizado: ${timeSavedLabel}`, 14, y); y += 8;

    doc.setFontSize(13);
    doc.text('Classificação NCM', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Itens classificados: ${totalItems}`, 14, y); y += 6;
    doc.text(`Confiança - Alta: ${ncmConfidence.alta} | Média: ${ncmConfidence.media} | Baixa: ${ncmConfidence.baixa}`, 14, y); y += 6;
    doc.text(`NCMs genéricos/pendentes: ${genericNcmCount}`, 14, y); y += 8;

    doc.setFontSize(13);
    doc.text('Impostos Estimados', 14, y);
    y += 8;
    doc.setFontSize(10);
    if (impostosBreakdown.length > 0) {
      impostosBreakdown.forEach(item => {
        doc.text(`${item.label}: ${item.value}`, 14, y);
        y += 6;
      });
    } else {
      doc.text('Não disponível para esta operação.', 14, y);
      y += 6;
    }
    y += 2;

    doc.setFontSize(13);
    doc.text('Compliance & Anuentes', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Selecionados: ${selectedAnuentes.length > 0 ? selectedAnuentes.join(', ') : 'Nenhum'}`, 14, y); y += 6;
    doc.text(`Pendentes: ${anuentesNaoMarcados.length > 0 ? anuentesNaoMarcados.join(', ') : 'Nenhum'}`, 14, y); y += 8;

    doc.setFontSize(13);
    doc.text('Alertas e Recomendações', 14, y);
    y += 8;
    doc.setFontSize(10);
    (alertas.length > 0 ? alertas : ['Nenhum alerta informado']).forEach(alerta => {
      doc.text(`• ${alerta}`, 14, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    recomendacoes.forEach(rec => {
      doc.text(`• ${rec}`, 14, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.addPage();
    y = 20;
    doc.setFontSize(13);
    doc.text('Itens da Operação', 14, y);
    y += 8;
    doc.setFontSize(10);
    items.forEach((item, idx) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`Item ${idx + 1}: ${item.desc || 'Sem descrição'}`, 14, y); y += 6;
      doc.text(`NCM: ${item.ncm || 'N/A'} | Valor: ${item.value || '0'} | Peso: ${item.weight || '0'}`, 14, y); y += 6;
      if (item.ncmConfianca) { doc.text(`Confiança: ${item.ncmConfianca}`, 14, y); y += 6; }
      y += 2;
    });

    doc.save(`truenorth-relatorio-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 10 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.95, y: 10 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-accent-500" /> Relatório Completo da Operação
            </h3>
            <p className="text-xs text-slate-400">
              {uploadedFileName || invoiceInfo?.invoice_number || 'Operação simulada'} • {extractionSummary?.country || invoiceInfo?.supplier?.country || 'Origem não informada'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" /> Baixar PDF
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-1">Economia estimada</div>
              <div className="text-lg font-bold text-green-400">{results.details?.total || 'N/D'}</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-1">Riscos mapeados</div>
              <div className="text-lg font-bold text-orange-400">{results.risks.length}</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-1">Tempo economizado</div>
              <div className="text-lg font-bold text-blue-400">{timeSavedLabel}</div>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-1">Risco geral</div>
              <div className="text-lg font-bold text-slate-100">{riscoGeral || 'Simulação'}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-accent-500" /> Classificação NCM
                  </div>
                  <div className="text-xs text-slate-400">Itens: {totalItems} • Valor: {totalValueLabel}</div>
                </div>
                <div className="text-xs text-slate-500">Setor: {extractionSummary?.sector || 'N/D'}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-300">Alta</div>
                  <div className="text-lg font-bold text-green-400">{ncmConfidence.alta}</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                  <div className="text-xs text-amber-200">Média</div>
                  <div className="text-lg font-bold text-amber-300">{ncmConfidence.media}</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                  <div className="text-xs text-red-200">Baixa/Pendente</div>
                  <div className="text-lg font-bold text-red-300">{ncmConfidence.baixa}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">NCMs genéricos ou incompletos: {genericNcmCount}</div>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-accent-500" /> Impostos Estimados
                </div>
                <div className="text-xs text-slate-400">{impostosEstimados ? 'Fonte: Extração' : 'Não informado'}</div>
              </div>
              {impostosBreakdown.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {impostosBreakdown.map(item => (
                    <div key={item.label} className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-500">{item.label}</div>
                      <div className="text-sm font-semibold text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400">Impostos não retornados pela API para esta operação.</div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-500" /> Compliance & Anuentes
              </div>
              <div className="text-xs text-slate-400">Selecionados: {selectedAnuentes.length > 0 ? selectedAnuentes.join(', ') : 'Nenhum'}</div>
              <div className="text-xs text-slate-500">Pendentes para revisão: {anuentesNaoMarcados.join(', ') || 'Nenhum'}</div>
              <div className="text-xs text-slate-400">LPCO: {lpcoRequested ? 'Solicitado' : 'Não indicado'}</div>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" /> Alertas e Recomendações
              </div>
              <div className="space-y-2">
                {(alertas.length > 0 ? alertas : ['Nenhum alerta registrado']).map((alerta, idx) => (
                  <div key={`alerta-${idx}`} className="text-sm text-slate-200 flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" /> {alerta}
                  </div>
                ))}
                {recomendacoes.map((rec, idx) => (
                  <div key={`rec-${idx}`} className="text-sm text-slate-300 flex gap-2">
                    <Sparkles className="w-4 h-4 text-accent-500 mt-0.5" /> {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-accent-500" /> Itens da Operação
              </div>
              <div className="text-xs text-slate-400">{items.length} item(s)</div>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <div className="flex justify-between text-sm text-white">
                    <span className="font-semibold">Item {idx + 1}</span>
                    <span className="text-xs text-slate-400">{item.ncm || 'NCM pendente'}</span>
                  </div>
                  <div className="text-sm text-slate-200 mt-1">{item.desc || 'Sem descrição'}</div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-3">
                    <span>Valor: {item.value || '0'}</span>
                    <span>Peso: {item.weight || '0'} kg</span>
                    {item.ncmConfianca && <span>Confiança: {item.ncmConfianca}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-accent-500" /> Valor agregado desta análise
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                <div className="text-xs text-slate-500">Multas evitadas</div>
                <div className="text-sm font-semibold text-white">{results.details?.fines || 'N/D'}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                <div className="text-xs text-slate-500">Demurrage evitado</div>
                <div className="text-sm font-semibold text-white">{results.details?.demurrage || 'N/D'}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                <div className="text-xs text-slate-500">Eficiência operacional</div>
                <div className="text-sm font-semibold text-white">{results.details?.ops || 'N/D'}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                <div className="text-xs text-slate-500">Custos (validação real)</div>
                <div className="text-sm font-semibold text-white">{custosValidacao || 'N/D'}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PlatformSimulationPage = ({ onNavigateHome, openAuthOnMount = false }: { onNavigateHome: () => void; openAuthOnMount?: boolean }) => {
  const [operationData, setOperationData] = useState({
    type: 'Importação Própria',
    urf: 'Santos (SP)',
    country: 'China',
    modality: 'Normal',
    sector: 'Outros'
  });
  const [duimpFields, setDuimpFields] = useState({
    cnpj: '',
    nome: '',
    uf: '',
    codigoURF: 'NAO_INFORMADO',
    viaTransporte: 'MARITIMO',
    tipoDeclaracao: 'CONSUMO',
    dataEmbarque: '',
    incoterm: 'FOB',
    moeda: 'USD'
  });

  const [items, setItems] = useState([
    { id: 1, desc: '', ncm: '', weight: '', value: '', unitPrice: '', quantity: '', origin: '' }
  ]);

  // Estado de compliance usando novo sistema de multi-select
  const [selectedAnuentes, setSelectedAnuentes] = useState<string[]>([]);
  const [lpcoRequested, setLpcoRequested] = useState(false);
  const [anuentsDropdownOpen, setAnuentsDropdownOpen] = useState(false);

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
    },
    inadimplencia: number
  }>(null);

  // --- NOVOS ESTADOS PARA O FLUXO DO COPILOTO ---
  const [workflowStep, setWorkflowStep] = useState<'upload' | 'processing' | 'summary' | 'form' | 'document'>('upload');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [timeStats, setTimeStats] = useState({ started: 0, ended: 0, saved: 17 }); // minutos economizados

  // --- ESTADOS PARA INTEGRAÇÃO COM API REAL ---
  const [currentOperationId, setCurrentOperationId] = useState<string | null>(null);
  const [apiValidation, setApiValidation] = useState<api.ValidationResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS PARA HISTÓRICO DE OPERAÇÕES ---
  const [operationsHistory, setOperationsHistory] = useState<api.Operation[]>([]);
  const [operationsStats, setOperationsStats] = useState<api.OperationsStats | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<api.User | null>(() => api.getStoredUser());
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // --- ESTADOS PARA NOVO LAYOUT ---
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [errorsExpanded, setErrorsExpanded] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Novas features - Impostos, Descrição DI, Subfaturamento
  const [impostosEstimados, setImpostosEstimados] = useState<{
    ii: number;
    ipi: number;
    pis_cofins: number;
    total_impostos: number;
    base_calculo: number;
  } | null>(null);
  const [descricaoDI, setDescricaoDI] = useState<string | null>(null);
  const [alertaSubfaturamento, setAlertaSubfaturamento] = useState<string | null>(null);
  const [invoiceInfo, setInvoiceInfo] = useState<{
    invoice_number: string;
    supplier: { name: string; country: string };
  } | null>(null);

  // --- ESTADOS PARA UX CLEAN (Summary Card + Campos Avançados) ---
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [extractionSummary, setExtractionSummary] = useState<{
    totalItems: number;
    totalValue: number;
    currency: string;
    sector: string;
    country: string;
    processingTimeMs: number;
    ncmConfidence: { alta: number; media: number; baixa: number };
  } | null>(null);
  const [editEssentials, setEditEssentials] = useState(false);

  // Abrir modal de auth se veio da landing page
  useEffect(() => {
    if (openAuthOnMount && !currentUser) {
      setShowAuthModal(true);
    }
  }, [openAuthOnMount]);

  // Verificar token armazenado ao carregar
  useEffect(() => {
    const token = api.getStoredToken();
    if (token && !currentUser) {
      api.getCurrentUser(token)
        .then(({ user }) => {
          setCurrentUser(user);
          api.setStoredUser(user);
        })
        .catch(() => {
          api.logout();
          setCurrentUser(null);
        });
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { user, token } = await api.login(email, password);
      api.setStoredToken(token);
      api.setStoredUser(user);
      setCurrentUser(user);
      setShowAuthModal(false);
      // Rodar simulação após login bem-sucedido
      runSimulation();
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string, name?: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { user, token } = await api.register(email, password, confirmPassword, name);
      api.setStoredToken(token);
      api.setStoredUser(user);
      setCurrentUser(user);
      setShowAuthModal(false);
      // Rodar simulação após registro bem-sucedido
      runSimulation();
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Carrega histórico de operações
  const loadOperationsHistory = async () => {
    setLoadingHistory(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        api.listOperations(5, 0),
        api.getOperationsStats()
      ]);
      setOperationsHistory(historyRes.operations);
      setOperationsStats(statsRes);
    } catch (error) {
      console.warn('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Carrega histórico ao montar o componente
  useEffect(() => {
    loadOperationsHistory();
  }, []);

  // Função para fazer upload de arquivo real
  const handleFileUpload = async (file: File) => {
    // Verificar se usuário está logado antes de fazer upload
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setWorkflowStep('processing');
    setProcessingProgress(0);
    setTimeStats({ ...timeStats, started: Date.now() });
    setUploadedFileName(file.name);
    setSelectedInvoice(null); // Not using sample invoice

    try {
      // Step 1: Upload & Process (0-70%) - Now done in single call
      setProcessingProgress(10);
      const { operationId, extractedData } = await api.uploadFile(file);
      setCurrentOperationId(operationId);
      setProcessingProgress(70);

      // Step 2: Validate (70-100%)
      setProcessingProgress(80);
      const validation = await api.validateOperation(operationId);
      setApiValidation(validation);
      setProcessingProgress(100);

      // Convert API data to form format
      const apiItems = (extractedData?.items || []).map((item: any, idx: number) => ({
        id: idx + 1,
        desc: item.description || '',
        ncm: item.ncm_sugerido || '',
        ncmDescricao: item.ncm_descricao || '',
        ncmConfianca: item.ncm_confianca || '',
        weight: (item.peso_bruto ?? item.peso_kg ?? item.peso_liquido ?? '').toString(),
        value: item.total_price?.toString() || '0',
        quantity: `${item.quantity || ''} ${item.unit || ''}`.trim(),
        unitPrice: item.unit_price?.toString() || '0',
        origin: item.origem || '',
        anuentes: item.anuentes_necessarios || []
      }));

      // Update form with extracted data
      const detectedSector = extractedData?.setor_detectado || 'Outros';
      setOperationData({
        type: 'Importação Própria',
        urf: 'Santos (SP)',
        country: extractedData?.supplier?.country || 'Desconhecido',
        modality: 'Normal',
        sector: detectedSector
      });
      setDuimpFields({
        cnpj: extractedData?.buyer?.cnpj || '',
        nome: extractedData?.buyer?.name || '',
        uf: extractedData?.buyer?.estado || '',
        codigoURF: extractedData?.codigo_urf || 'NAO_INFORMADO',
        viaTransporte: extractedData?.via_transporte || extractedData?.modal || 'MARITIMO',
        tipoDeclaracao: extractedData?.tipo_declaracao || 'CONSUMO',
        dataEmbarque: extractedData?.invoice_date || '',
        incoterm: extractedData?.incoterm || 'FOB',
        moeda: extractedData?.currency || 'USD'
      });
      setItems(apiItems.length > 0 ? apiItems : [{ id: 1, desc: '', ncm: '', weight: '', value: '', unitPrice: '', quantity: '', origin: '' }]);

      // Set AI feedback if available
      setAiFeedback(extractedData?.feedback_especialista || null);

      // Set new features - Impostos, Descrição DI, Subfaturamento
      setImpostosEstimados(extractedData?.impostos_estimados || null);
      setDescricaoDI(extractedData?.descricao_di || null);
      setAlertaSubfaturamento(extractedData?.alerta_subfaturamento || null);
      setInvoiceInfo({
        invoice_number: extractedData?.invoice_number || 'N/A',
        supplier: extractedData?.supplier || { name: 'N/A', country: 'N/A' }
      });

      // Calculate time saved
      const processingTimeMs = Date.now() - timeStats.started;
      const processingTime = Math.round(processingTimeMs / 1000 / 60);
      setTimeStats(prev => ({ ...prev, ended: Date.now(), saved: Math.max(17, 25 - processingTime) }));

      // Calculate extraction summary for Summary Card
      const ncmConfidence = { alta: 0, media: 0, baixa: 0 };
      apiItems.forEach((item: any) => {
        if (item.ncmConfianca === 'ALTA') ncmConfidence.alta++;
        else if (item.ncmConfianca === 'MEDIA') ncmConfidence.media++;
        else ncmConfidence.baixa++;
      });

      const totalValue = apiItems.reduce((sum: number, item: any) => sum + (parseFloat(item.value) || 0), 0);

      setExtractionSummary({
        totalItems: apiItems.length,
        totalValue,
        currency: extractedData?.currency || 'USD',
        sector: detectedSector,
        country: extractedData?.supplier?.country || 'Desconhecido',
        processingTimeMs,
        ncmConfidence
      });

      // Go to summary step instead of form
      setWorkflowStep('summary');

      // Reload history after successful operation
      loadOperationsHistory();
    } catch (error: any) {
      console.error('Error processing file:', error);
      // Se erro de autenticação, mostrar modal de login
      if (error.message.includes('Autenticação') || error.message.includes('logado') || error.message.includes('Token')) {
        setShowAuthModal(true);
      } else {
        alert('Erro ao processar arquivo: ' + error.message);
      }
      setWorkflowStep('upload');
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Função para copiar dados para clipboard
  const handleCopyFields = () => {
    const fieldsText = items.map((item, idx) =>
      `Item ${idx + 1}:
- Descrição: ${item.desc}
- NCM: ${item.ncm}
- Peso: ${item.weight} kg
- Valor: USD ${item.value}`
    ).join('\n\n');

    const fullText = `=== DADOS DA OPERAÇÃO ===
Tipo: ${operationData.type}
URF: ${operationData.urf}
País de Origem: ${operationData.country}
Modalidade: ${operationData.modality}

=== ITENS ===
${fieldsText}

=== ANUENTES ===
${selectedAnuentes.join(', ') || 'Nenhum'}
LPCO: ${lpcoRequested ? 'Sim' : 'Não'}`;

    navigator.clipboard.writeText(fullText).then(() => {
      alert('Dados copiados para a área de transferência!');
    }).catch(() => {
      alert('Erro ao copiar dados.');
    });
  };

  // Função para copiar TODOS os dados extraídos formatados
  const handleCopyAll = () => {
    const itemsText = items.map((item, idx) =>
      `${idx + 1}. ${item.desc || 'Item sem descrição'} - NCM ${item.ncm || 'N/A'} - USD ${item.value || '0.00'}`
    ).join('\n');

    const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

    let fullText = `══════════════════════════════════════
INVOICE: ${invoiceInfo?.invoice_number || 'N/A'}
FORNECEDOR: ${invoiceInfo?.supplier?.name || 'N/A'} (${invoiceInfo?.supplier?.country || 'N/A'})
VALOR TOTAL: USD ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
══════════════════════════════════════

ITENS:
${itemsText}`;

    if (impostosEstimados) {
      fullText += `

══════════════════════════════════════
IMPOSTOS ESTIMADOS:
II: R$ ${impostosEstimados.ii.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
IPI: R$ ${impostosEstimados.ipi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
PIS/COFINS: R$ ${impostosEstimados.pis_cofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
TOTAL: R$ ${impostosEstimados.total_impostos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Base de cálculo: R$ ${impostosEstimados.base_calculo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
══════════════════════════════════════`;
    }

    if (selectedAnuentes.length > 0) {
      fullText += `

ANUENTES NECESSÁRIOS: ${selectedAnuentes.join(', ')}`;
    }

    if (alertaSubfaturamento) {
      fullText += `

⚠️ ALERTA: ${alertaSubfaturamento}`;
    }

    navigator.clipboard.writeText(fullText).then(() => {
      alert('Todos os dados copiados para a área de transferência!');
    }).catch(() => {
      alert('Erro ao copiar dados.');
    });
  };

  // Função para exportar XML Siscomex
  const handleExportSiscomexXml = async () => {
    if (!currentOperationId) {
      alert('Nenhuma operação selecionada para exportar');
      return;
    }

    try {
      const overrides = buildExportOverrides();
      const preview = await api.getExportPreview(currentOperationId, overrides);

      if (preview.validationErrors.length > 0) {
        alert(`Corrija os campos antes de exportar:\n${preview.validationErrors.join('\n')}`);
        return;
      }

      await api.exportSiscomexXml(currentOperationId, overrides, true);
      alert('XML exportado com sucesso!');
    } catch (error: any) {
      // Format error message with line breaks for validation errors
      const message = error.message?.includes('\n')
        ? error.message
        : `Erro ao exportar XML:\n${error.message}`;
      alert(message);
    }
  };

  // Função para exportar DUIMP como PDF
  const handleExportDUIMP = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('TrueNorth - Rascunho DUIMP', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Operação ID: ${currentOperationId || 'N/A'}`, pageWidth / 2, 38, { align: 'center' });

    y = 55;
    doc.setTextColor(0, 0, 0);

    // Dados da Operação
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados da Operação', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tipo de Operação: ${operationData.type}`, 14, y); y += 6;
    doc.text(`URF de Despacho: ${operationData.urf}`, 14, y); y += 6;
    doc.text(`País de Origem: ${operationData.country}`, 14, y); y += 6;
    doc.text(`Modalidade: ${operationData.modality}`, 14, y); y += 10;

    // Itens
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Itens da Importação', 14, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    items.forEach((item, idx) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`Item ${idx + 1}:`, 14, y);
      doc.setFont('helvetica', 'normal');
      y += 5;
      doc.text(`  NCM: ${item.ncm || 'Não informado'}`, 14, y); y += 5;
      doc.text(`  Descrição: ${(item.desc || 'Não informado').substring(0, 60)}`, 14, y); y += 5;
      doc.text(`  Peso: ${item.weight || '0'} kg | Valor: USD ${item.value || '0'}`, 14, y); y += 8;
    });

    // Anuentes
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Anuentes e Compliance', 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Órgãos Anuentes: ${selectedAnuentes.length > 0 ? selectedAnuentes.join(', ') : 'Nenhum'}`, 14, y);
    y += 6;
    doc.text(`LPCO Requerido: ${lpcoRequested ? 'Sim' : 'Não'}`, 14, y);

    // Resultado da Validação API
    if (apiValidation) {
      y += 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resultado da Validação', 14, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Risco Geral: ${apiValidation.risco_geral || 'N/A'}`, 14, y);
      y += 6;
      doc.text(`Custo Total de Erros: R$ ${(apiValidation.custos?.custoTotal || 0).toLocaleString('pt-BR')}`, 14, y);
      y += 6;
      doc.text(`Dias de Atraso Estimado: ${apiValidation.custos?.diasAtrasoEstimado || 0} dias`, 14, y);
    }

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('TrueNorth - Documento gerado automaticamente. Verifique os dados antes de submeter ao SISCOMEX.', pageWidth / 2, y, { align: 'center' });

    doc.save(`duimp-rascunho-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Função para processar invoice (simula extração de dados)
  const processInvoice = (invoiceKey: keyof typeof SAMPLE_INVOICES) => {
    setSelectedInvoice(invoiceKey);
    setWorkflowStep('processing');
    setProcessingProgress(0);
    setTimeStats({ ...timeStats, started: Date.now() });

    // Simula progresso de processamento
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Após 2.5 segundos, preenche o formulário
    setTimeout(() => {
      const invoice = SAMPLE_INVOICES[invoiceKey];
      setOperationData(invoice.operation);
      setItems(invoice.items);
      // Usar campo anuentes se disponível, senão converter do compliance antigo
      if (invoice.anuentes) {
        setSelectedAnuentes(invoice.anuentes);
      } else {
        const anuentes: string[] = [];
        if (invoice.compliance.anvisa) anuentes.push('ANVISA');
        if (invoice.compliance.mapa) anuentes.push('MAPA');
        setSelectedAnuentes(anuentes);
      }
      setLpcoRequested(invoice.compliance.lpcoRequested);
      setWorkflowStep('form');
      setTimeStats(prev => ({ ...prev, ended: Date.now(), saved: 25 - invoice.processingTime }));
    }, 2500);
  };

  // Função para gerar documento
  const generateDocument = () => {
    setShowDocumentPreview(true);
    setWorkflowStep('document');
  };

  // Função para voltar ao início
  const resetWorkflow = () => {
    setWorkflowStep('upload');
    setSelectedInvoice(null);
    setProcessingProgress(0);
    setShowDocumentPreview(false);
    setResults(null);
    setOperationData({
      type: 'Importação Própria',
      urf: 'Santos (SP)',
      country: 'China',
      modality: 'Normal',
      sector: 'Outros'
    });
    setDuimpFields({
      cnpj: '',
      nome: '',
      uf: '',
      codigoURF: 'NAO_INFORMADO',
      viaTransporte: 'MARITIMO',
      tipoDeclaracao: 'CONSUMO',
      dataEmbarque: '',
      incoterm: 'FOB',
      moeda: 'USD'
    });
    setItems([{ id: 1, desc: '', ncm: '', weight: '', value: '', unitPrice: '', quantity: '', origin: '' }]);
    setSelectedAnuentes([]);
    setLpcoRequested(false);
    // Reset API states
    setCurrentOperationId(null);
    setApiValidation(null);
    setUploadedFileName(null);
  };

  const handleItemChange = (id: number, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    if (items.length < 3) {
      setItems([...items, { id: Date.now(), desc: '', ncm: '', weight: '', value: '', unitPrice: '', quantity: '', origin: '' }]);
    }
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const toNumber = (value: any): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined;
    const cleaned = String(value).replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
  };

  const parseQuantityUnit = (value: string) => {
    if (!value) return { quantity: undefined, unit: undefined };
    const match = value.match(/([\d.,]+)/);
    const quantity = match ? parseFloat(match[1].replace(',', '.')) : undefined;
    const unit = value.replace(match ? match[1] : '', '').trim() || undefined;
    return { quantity, unit };
  };

  const buildExportOverrides = (): api.ExportOverrides => {
    const itemOverrides = items.map((item, idx) => {
      const { quantity, unit } = parseQuantityUnit(item.quantity || '');
      return {
        sequencial: idx + 1,
        ncm: item.ncm,
        description: item.desc,
        quantity,
        unit,
        total_price: toNumber(item.value),
        unit_price: toNumber(item.unitPrice),
        peso_bruto: toNumber(item.weight),
        peso_kg: toNumber(item.weight),
        peso_liquido: toNumber(item.weight),
        origem: item.origin || undefined,
      };
    });

    return {
      numeroReferencia: invoiceInfo?.invoice_number,
      dataEmbarque: duimpFields.dataEmbarque,
      incoterm: duimpFields.incoterm,
      moeda: duimpFields.moeda,
      codigo_urf: duimpFields.codigoURF,
      via_transporte: duimpFields.viaTransporte,
      tipo_declaracao: duimpFields.tipoDeclaracao,
      importador: {
        cnpj: duimpFields.cnpj,
        nome: duimpFields.nome,
        uf: duimpFields.uf,
      },
      buyer: {
        cnpj: duimpFields.cnpj,
        name: duimpFields.nome,
        estado: duimpFields.uf,
      },
      items: itemOverrides,
    };
  };

  // Handler do botão que verifica autenticação antes de rodar a simulação
  const handleSimulationClick = () => {
    if (!currentUser) {
      setAuthMode('login');
      setAuthError(null);
      setShowAuthModal(true);
      return;
    }
    runSimulation();
  };

  const runSimulation = () => {
    setCalculating(true);
    setResults(null);
    setShowReport(false);

    setTimeout(() => {
      // Simulação de inadimplência (0 a 1) para cálculo de risco NCM
      const inadimplenciaSimulada = 0.6; // 60%

      const risks = [];
      let impactLow = 0;
      let impactHigh = 0;

      // 1. Verificação de NCM (vazio ou inválido) com regra de risco
      const itemsWithRisk = items.map(item => {
        const riscoNcm = calcularRiscoNCM(item.ncm, inadimplenciaSimulada);
        return { ...item, riscoNcm };
      });

      const invalidNCMs = itemsWithRisk.filter(i => i.riscoNcm >= 85);

      if (invalidNCMs.length > 0) {
        risks.push(`${invalidNCMs.length} item(s) com NCM inválida ou de alto risco (>85%).`);
        impactLow += 500 * invalidNCMs.length;
        impactHigh += 2000 * invalidNCMs.length;
      }

      const emptyNCMs = items.filter(i => !i.ncm);
      if (emptyNCMs.length > 0) {
        risks.push(`NCM não informada para ${emptyNCMs.length} item(s).`);
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
      const hasAnuenteChecked = selectedAnuentes.length > 0;

      if (requiresAnuente && !hasAnuenteChecked) {
        risks.push(`Setor ${operationData.sector} geralmente exige LPCO (Anuente) não assinalado.`);
        impactLow += 2000;
        impactHigh += 5000;
      }

      if (requiresAnuente && !lpcoRequested) {
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
        },
        inadimplencia: inadimplenciaSimulada
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
           <div className="flex items-center gap-3">
             {currentUser && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                 <User className="w-4 h-4 text-primary-400" />
                 <span className="text-sm text-slate-300">{currentUser.name || currentUser.email}</span>
                 <button
                   onClick={handleLogout}
                   className="ml-1 p-1 hover:bg-slate-700 rounded transition-colors"
                   title="Sair"
                 >
                   <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                 </button>
               </div>
             )}
             <button
               onClick={onNavigateHome}
               className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
             >
               <Home className="w-4 h-4" /> Home
             </button>
           </div>
        </div>
      </nav>

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={authLoading}
        error={authError}
      />

      <main className="py-12 md:py-16">
        <AnimatePresence>
          {showReport && results && (
            <ReportModal
              results={results}
              extractionSummary={extractionSummary}
              impostosEstimados={impostosEstimados}
              selectedAnuentes={selectedAnuentes}
              items={items}
              aiFeedback={aiFeedback}
              alertaSubfaturamento={alertaSubfaturamento}
              invoiceInfo={invoiceInfo}
              uploadedFileName={uploadedFileName}
              timeStats={timeStats}
              apiValidation={apiValidation}
              lpcoRequested={lpcoRequested}
              onClose={() => setShowReport(false)}
            />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header dinâmico baseado no step */}
          <div className="mb-12 text-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-4">
               <Sparkles className="w-3 h-3" /> Seu Copiloto de Importação
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
               {workflowStep === 'upload' && 'Comece enviando sua Invoice'}
               {workflowStep === 'processing' && 'Seu copiloto está analisando...'}
               {workflowStep === 'summary' && 'Invoice processada com sucesso'}
               {workflowStep === 'form' && 'Revise os dados extraídos'}
               {workflowStep === 'document' && 'Documento pronto para uso'}
             </h1>
             <p className="text-slate-400 max-w-2xl mx-auto">
               {workflowStep === 'upload' && 'Arraste uma invoice ou escolha um exemplo para ver a mágica acontecer.'}
               {workflowStep === 'processing' && 'Extraindo dados, validando NCMs e verificando anuências...'}
               {workflowStep === 'summary' && 'Confira o resumo da extração antes de prosseguir.'}
               {workflowStep === 'form' && `Campos preenchidos automaticamente. Você economizou ${timeStats.saved} minutos!`}
               {workflowStep === 'document' && 'Copie os dados ou exporte o rascunho para o Portal Único.'}
             </p>

             {/* Indicador de progresso */}
             {workflowStep !== 'upload' && (
               <div className="flex items-center justify-center gap-2 mt-6">
                 <button onClick={resetWorkflow} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                   ← Nova operação
                 </button>
               </div>
             )}
          </div>

          {/* === STEP 1: UPLOAD === */}
          {workflowStep === 'upload' && (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Área de Upload */}
              <div
                className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary-500/50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.xml,.png,.jpg,.jpeg,.webp,.heic,.heif,image/*"
                  className="hidden"
                />
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600/20 transition-colors">
                  <Upload className="w-10 h-10 text-slate-500 group-hover:text-primary-400 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Arraste sua Invoice aqui</h3>
                <p className="text-slate-500 text-sm mb-4">PDF, XML ou Imagem • Processado com IA</p>
                <div className="text-xs text-slate-600">ou clique para selecionar</div>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-800"></div>
                <span className="text-slate-600 text-sm">ou escolha um exemplo</span>
                <div className="flex-1 h-px bg-slate-800"></div>
              </div>

              {/* Exemplos de Invoice */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => processInvoice('electronics')}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-primary-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Eletrônicos</div>
                      <div className="text-slate-500 text-xs">China → Santos</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">2 itens • ~6 min</div>
                </button>

                <button
                  onClick={() => processInvoice('autoparts')}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-accent-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Autopeças</div>
                      <div className="text-slate-500 text-xs">Alemanha → Paranaguá</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">3 itens • ~8 min</div>
                </button>

                <button
                  onClick={() => processInvoice('cosmetics')}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left hover:border-green-500/50 hover:bg-slate-800/50 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Cosméticos</div>
                      <div className="text-slate-500 text-xs">EUA → Guarulhos</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600">2 itens • ANVISA • ~12 min</div>
                </button>
              </div>

              {/* Histórico de Operações */}
              {operationsHistory.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-800"></div>
                    <span className="text-slate-600 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Últimas operações
                    </span>
                    <div className="flex-1 h-px bg-slate-800"></div>
                  </div>

                  {/* Estatísticas Rápidas */}
                  {operationsStats && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{operationsStats.totalOperations}</div>
                        <div className="text-xs text-slate-500">Operações</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          R$ {(operationsStats.totalCostsAvoided || 0).toLocaleString('pt-BR')}
                        </div>
                        <div className="text-xs text-slate-500">Custos evitados</div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-accent-400">{operationsStats.totalTimeSavedMin || 0} min</div>
                        <div className="text-xs text-slate-500">Tempo economizado</div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Operações */}
                  <div className="space-y-2">
                    {operationsHistory.map((op) => (
                      <div
                        key={op.id}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            op.status === 'VALIDADO' ? 'bg-green-500/10' :
                            op.status === 'COM_ERROS' ? 'bg-orange-500/10' :
                            'bg-slate-800'
                          }`}>
                            {op.status === 'VALIDADO' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : op.status === 'COM_ERROS' ? (
                              <AlertTriangle className="w-5 h-5 text-orange-400" />
                            ) : (
                              <FileText className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {op.arquivoNome || 'Operação sem nome'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(op.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {op.arquivoTipo && ` • ${op.arquivoTipo}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {op.custoTotalErros && Number(op.custoTotalErros) > 0 ? (
                            <div className="text-orange-400 text-sm font-medium">
                              R$ {Number(op.custoTotalErros).toLocaleString('pt-BR')}
                            </div>
                          ) : (
                            <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> OK
                            </div>
                          )}
                          {op.tempoEconomizadoMin && (
                            <div className="text-xs text-slate-500">
                              {op.tempoEconomizadoMin} min economizados
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {loadingHistory && (
                    <div className="text-center py-4 text-slate-500 text-sm">
                      Carregando histórico...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* === STEP 2: PROCESSING === */}
          {workflowStep === 'processing' && (
            <div className="max-w-xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                {/* Animação do Copiloto */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-primary-600/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-primary-600/30 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary-400 animate-pulse" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">Analisando invoice...</h3>

                {/* Barra de progresso */}
                <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-primary-600 to-accent-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Status de processamento */}
                <div className="space-y-2 text-sm text-slate-400">
                  <div className={`flex items-center justify-center gap-2 ${processingProgress > 15 ? 'text-green-400' : ''}`}>
                    {processingProgress > 15 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full animate-spin border-t-primary-500" />}
                    Lendo documento...
                  </div>
                  <div className={`flex items-center justify-center gap-2 ${processingProgress > 35 ? 'text-green-400' : ''}`}>
                    {processingProgress > 35 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full animate-spin border-t-primary-500" />}
                    Extraindo dados dos itens...
                  </div>
                  <div className={`flex items-center justify-center gap-2 ${processingProgress > 55 ? 'text-green-400' : ''}`}>
                    {processingProgress > 55 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full animate-spin border-t-primary-500" />}
                    Classificando NCMs...
                  </div>
                  <div className={`flex items-center justify-center gap-2 ${processingProgress > 75 ? 'text-green-400' : ''}`}>
                    {processingProgress > 75 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full animate-spin border-t-primary-500" />}
                    Verificando anuentes...
                  </div>
                  <div className={`flex items-center justify-center gap-2 ${processingProgress > 90 ? 'text-green-400' : ''}`}>
                    {processingProgress > 90 ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-slate-600 rounded-full animate-spin border-t-primary-500" />}
                    Calculando impostos...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === STEP 2.5: SUMMARY CARD (Feedback Breve) === */}
          {workflowStep === 'summary' && extractionSummary && (
            <div className="max-w-xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Header com status */}
                <div className="bg-gradient-to-r from-green-900/40 to-accent-900/40 border-b border-slate-800 p-6">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Extração Concluída</h3>
                      <p className="text-sm text-slate-400">{uploadedFileName || 'Invoice processada'}</p>
                    </div>
                  </div>
                </div>

                {/* Métricas principais */}
                <div className="p-6 space-y-6">
                  {/* Grid de métricas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-950/50 rounded-xl p-4 text-center border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Setor</div>
                      <div className="text-lg font-bold text-white">{extractionSummary.sector}</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 text-center border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Itens</div>
                      <div className="text-lg font-bold text-white">{extractionSummary.totalItems}</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-4 text-center border border-slate-800">
                      <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Origem</div>
                      <div className="text-lg font-bold text-white">{extractionSummary.country}</div>
                    </div>
                  </div>

                  {/* Valor total e confiança */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary-900/30 to-primary-950/30 rounded-xl p-4 border border-primary-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-primary-400" />
                        <span className="text-xs text-primary-400 uppercase tracking-wider">Valor Total</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {extractionSummary.currency} {extractionSummary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 rounded-xl p-4 border border-green-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400 uppercase tracking-wider">NCM Confiança</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {extractionSummary.ncmConfidence.alta > 0 && (
                          <span className="bg-green-500/20 text-green-400 text-sm font-bold px-2 py-1 rounded">
                            {extractionSummary.ncmConfidence.alta} ALTA
                          </span>
                        )}
                        {extractionSummary.ncmConfidence.media > 0 && (
                          <span className="bg-yellow-500/20 text-yellow-400 text-sm font-bold px-2 py-1 rounded">
                            {extractionSummary.ncmConfidence.media} MÉD
                          </span>
                        )}
                        {extractionSummary.ncmConfidence.baixa > 0 && (
                          <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-1 rounded">
                            {extractionSummary.ncmConfidence.baixa} BAIXA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tempo economizado */}
                  <div className="bg-gradient-to-r from-accent-900/20 to-primary-900/20 rounded-xl p-4 border border-accent-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-accent-400" />
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Processado em {(extractionSummary.processingTimeMs / 1000).toFixed(1)}s</div>
                          <div className="text-lg font-bold text-accent-400">Você economizou ~{timeStats.saved} minutos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insight da IA */}
                  {aiFeedback && (
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-accent-400" />
                        </div>
                        <div>
                          <div className="text-xs text-accent-400 font-semibold mb-1">Insight do Copiloto</div>
                          <p className="text-sm text-slate-300 leading-relaxed">{aiFeedback}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botões de ação */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setWorkflowStep('form')}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FileSearch className="w-4 h-4" />
                      Revisar Detalhes
                    </button>
                    <button
                      onClick={() => {
                        setWorkflowStep('form');
                        // Auto-scroll to simulation button after a short delay
                        setTimeout(() => {
                          const simBtn = document.querySelector('[data-simulation-btn]');
                          if (simBtn) simBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }}
                      className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-900/30"
                    >
                      Prosseguir
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* === STEP 3: FORM (Layout Single-Column Limpo) === */}
          {workflowStep === 'form' && (
          <div className="max-w-2xl mx-auto">
            {/* Métricas de Produtividade - Compacto */}
            <div className="bg-gradient-to-r from-primary-900/30 to-accent-900/30 border border-primary-800/30 rounded-xl p-4 mb-8">
              <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                <div>
                  <div className="text-xl font-bold text-white">{selectedInvoice ? SAMPLE_INVOICES[selectedInvoice as keyof typeof SAMPLE_INVOICES].processingTime : Math.round((extractionSummary?.processingTimeMs || 8000) / 1000)} s</div>
                  <div className="text-xs text-slate-400">Com copiloto</div>
                </div>
                <div className="text-slate-600 text-sm">vs</div>
                <div>
                  <div className="text-xl font-bold text-slate-500 line-through">25 min</div>
                  <div className="text-xs text-slate-500">Manual</div>
                </div>
                <div className="bg-green-500/10 px-3 py-1.5 rounded-lg">
                  <div className="text-xl font-bold text-green-400 flex items-center gap-1">
                    <Zap className="w-4 h-4" /> {timeStats.saved} min
                  </div>
                  <div className="text-xs text-green-400/70">economizados</div>
                </div>
              </div>
            </div>

          {/* === FEEDBACK DA IA === */}
          {aiFeedback && (
            <div className="bg-gradient-to-r from-accent-900/20 to-primary-900/20 border border-accent-700/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-accent-500/20 p-2 rounded-lg shrink-0">
                  <Sparkles className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-accent-400 mb-1">💡 Feedback da IA</div>
                  <p className="text-white/90 text-sm leading-relaxed">{aiFeedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* === ALERTA DE SUBFATURAMENTO === */}
          {alertaSubfaturamento && (
            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-orange-500/20 p-2 rounded-lg shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-400 mb-1">Alerta de Subfaturamento</div>
                  <p className="text-white/90 text-sm leading-relaxed">{alertaSubfaturamento}</p>
                </div>
              </div>
            </div>
          )}

          {/* === ESTIMATIVA DE IMPOSTOS === */}
          {impostosEstimados && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-primary-400" />
                <h3 className="text-sm font-semibold text-white">Estimativa de Impostos</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">II (Imposto de Importação)</div>
                  <div className="text-lg font-bold text-white">
                    R$ {impostosEstimados.ii.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">IPI</div>
                  <div className="text-lg font-bold text-white">
                    R$ {impostosEstimados.ipi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">PIS/COFINS (11,65%)</div>
                  <div className="text-lg font-bold text-white">
                    R$ {impostosEstimados.pis_cofins.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-primary-900/30 border border-primary-700/30 rounded-lg p-3">
                  <div className="text-xs text-primary-400 mb-1">Total Estimado</div>
                  <div className="text-lg font-bold text-primary-400">
                    R$ {impostosEstimados.total_impostos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500 text-center">
                Base de cálculo: R$ {impostosEstimados.base_calculo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          )}

          {/* === DESCRIÇÃO PARA DI === */}
          {descricaoDI && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-400" />
                  <h3 className="text-sm font-semibold text-white">Descrição para DI</h3>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(descricaoDI);
                  }}
                  className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 bg-accent-500/10 hover:bg-accent-500/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar
                </button>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{descricaoDI}</p>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Texto formatado para Portal Único - pronto para colar na DI
              </div>
            </div>
          )}

          {/* === VALIDAÇÃO API - Colapsável === */}
          {apiValidation && (
            <div className="mb-6">
              {/* Badge de Risco - Clicável para expandir */}
              <button
                onClick={() => setErrorsExpanded(!errorsExpanded)}
                className={`w-full border rounded-xl p-4 transition-all ${
                  apiValidation.risco_geral === 'CRITICO' ? 'bg-red-900/20 border-red-800/50 hover:border-red-700' :
                  apiValidation.risco_geral === 'ALTO' ? 'bg-orange-900/20 border-orange-800/50 hover:border-orange-700' :
                  apiValidation.risco_geral === 'MEDIO' ? 'bg-yellow-900/20 border-yellow-800/50 hover:border-yellow-700' :
                  'bg-green-900/20 border-green-800/50 hover:border-green-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      apiValidation.risco_geral === 'CRITICO' ? 'bg-red-600' :
                      apiValidation.risco_geral === 'ALTO' ? 'bg-orange-600' :
                      apiValidation.risco_geral === 'MEDIO' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}>
                      {apiValidation.risco_geral === 'CRITICO' || apiValidation.risco_geral === 'ALTO' ? (
                        <AlertTriangle className="w-5 h-5 text-white" />
                      ) : apiValidation.risco_geral === 'MEDIO' ? (
                        <AlertCircle className="w-5 h-5 text-white" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">
                        Risco {apiValidation.risco_geral || 'N/A'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {apiValidation.erros?.length || 0} erros • R$ {(apiValidation.custos?.custoTotal || 0).toLocaleString('pt-BR')} em risco
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${errorsExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Detalhes Expandidos */}
              <AnimatePresence>
                {errorsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 space-y-3">
                      {/* Lista de Erros */}
                      {apiValidation.erros && apiValidation.erros.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                            <XCircle className="w-4 h-4" /> Erros ({apiValidation.erros.length})
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {apiValidation.erros.map((erro: any, idx: number) => (
                              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="text-sm text-white font-medium">{erro.campo}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{erro.explicacao}</div>
                                  </div>
                                  {erro.custo_estimado && (
                                    <span className="text-sm font-bold text-red-400">
                                      R$ {Number(erro.custo_estimado).toLocaleString('pt-BR')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Impacto Financeiro Resumido */}
                      {apiValidation.custos && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Custo Total Potencial</span>
                            <span className="text-lg font-bold text-red-400">
                              R$ {(apiValidation.custos.custoTotal || 0).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                            <span>Multas: R$ {(apiValidation.custos.custoMultas || 0).toLocaleString('pt-BR')}</span>
                            <span>Demurrage: R$ {(apiValidation.custos.custoDemurrage || 0).toLocaleString('pt-BR')}</span>
                            <span>{apiValidation.custos.diasAtrasoEstimado || 0} dias atraso</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Formulário Single-Column - CLEAN */}
          <div className="space-y-4">
              {/* Bloco 1: Dados Essenciais (País + Setor) */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs uppercase text-slate-500 tracking-wide">Dados essenciais</div>
                    <div className="text-[11px] text-accent-400">Preenchido automaticamente pela IA</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditEssentials(!editEssentials)}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700 transition-colors"
                  >
                    <Pen className="w-3.5 h-3.5" /> {editEssentials ? 'Fechar' : 'Editar'}
                  </button>
                </div>

                {!editEssentials && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2">
                      <div className="text-[11px] text-slate-500">País de Procedência</div>
                      <div className="text-sm font-semibold text-white">{operationData.country || 'N/D'}</div>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2">
                      <div className="text-[11px] text-slate-500">Setor do Produto</div>
                      <div className="text-sm font-semibold text-white">{operationData.sector || 'N/D'}</div>
                    </div>
                  </div>
                )}

                {editEssentials && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">País de Procedência</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                        value={operationData.country}
                        onChange={(e) => setOperationData({...operationData, country: e.target.value})}
                      >
                        {PAISES_IMPORTADORES.map(pais => (
                          <option key={pais} value={pais}>{pais}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Setor do Produto</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                        value={operationData.sector}
                        onChange={(e) => setOperationData({...operationData, sector: e.target.value})}
                      >
                        <option>Outros</option>
                        <option>Eletronicos</option>
                        <option>Químico</option>
                        <option>Cosméticos</option>
                        <option>Alimentos/Bebidas</option>
                        <option>Autopeças</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Campos Avançados - Colapsável */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                  className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 py-2 border-t border-slate-800 mt-3 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    Configurações avançadas
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFields ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showAdvancedFields && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Tipo de Operação</label>
                          <select
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                            value={operationData.type}
                            onChange={(e) => setOperationData({...operationData, type: e.target.value})}
                          >
                            <option>Importação Própria</option>
                            <option>Conta e Ordem</option>
                            <option>Encomenda</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">URF de Despacho</label>
                          <select
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
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
                          <label className="block text-[11px] text-slate-400 mb-1">Modalidade</label>
                          <select
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                            value={operationData.modality}
                            onChange={(e) => setOperationData({...operationData, modality: e.target.value})}
                          >
                            <option>Normal</option>
                            <option>Admissão Temporária</option>
                            <option>Drawback</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bloco 2: Itens e NCM */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="bg-primary-600 text-xs rounded px-2 py-0.5">2</span> Itens e NCM
                  </h3>
                  <button onClick={addItem} className="text-xs flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50" disabled={items.length >= 3}>
                    <Plus className="w-3 h-3" /> Adicionar Item
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(showAllItems ? items : items.slice(0, 2)).map((item, index) => (
                    <div key={item.id} className="relative bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                      {/* Layout Clean - Descrição + NCM com badge */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">{item.desc || 'Item sem descrição'}</div>
                          {item.ncmDescricao && (
                            <div className="text-xs text-slate-500 mt-0.5 truncate">{item.ncmDescricao}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400">NCM</span>
                            <input
                              maxLength={8}
                              className="w-24 bg-slate-900 border border-slate-700 text-slate-200 text-sm font-mono rounded px-2 py-1 focus:border-primary-500 outline-none"
                              value={item.ncm}
                              onChange={(e) => handleItemChange(item.id, 'ncm', e.target.value)}
                            />
                          </div>
                          {item.ncm && item.ncmConfianca && (
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                item.ncmConfianca === 'ALTA' ? 'bg-green-500' :
                                item.ncmConfianca === 'MEDIA' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              title={`Confiança ${item.ncmConfianca}`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Linha de valores - mais compacta */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Valor:</span>
                          <span className="text-white font-medium">USD {parseFloat(item.value || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Peso:</span>
                          <span className="text-white">{item.weight || '0'} kg</span>
                        </div>
                        {item.quantity && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">Qtd:</span>
                            <span className="text-white">{item.quantity}</span>
                          </div>
                        )}
                      </div>

                      {/* Campos editáveis para DUIMP */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 text-xs">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Peso bruto (kg)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            value={item.weight}
                            onChange={(e) => handleItemChange(item.id, 'weight', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Valor total (USD)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            value={item.value}
                            onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Quantidade (ex: 100 UN)</label>
                          <input
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Valor unitário (USD)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">País de origem</label>
                          <input
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            value={item.origin}
                            onChange={(e) => handleItemChange(item.id, 'origin', e.target.value)}
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

                  {/* Botão Ver Mais/Menos */}
                  {items.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setShowAllItems(!showAllItems)}
                      className="w-full py-2 text-xs text-slate-400 hover:text-slate-300 border border-dashed border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      {showAllItems ? (
                        <>Mostrar menos</>
                      ) : (
                        <>+ Ver mais {items.length - 2} {items.length - 2 === 1 ? 'item' : 'itens'}</>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Bloco 2.5: Dados obrigatórios para DUIMP */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <span className="bg-accent-500 text-xs rounded px-2 py-0.5">2.5</span> Dados para DUIMP
                  </h3>
                  <span className="text-[11px] text-slate-500">Preencha para habilitar o XML</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">CNPJ do Importador</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="00.000.000/0000-00"
                      value={duimpFields.cnpj}
                      onChange={(e) => setDuimpFields({ ...duimpFields, cnpj: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Razão Social do Importador</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Empresa Importadora LTDA"
                      value={duimpFields.nome}
                      onChange={(e) => setDuimpFields({ ...duimpFields, nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">UF do Importador</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="SP"
                      value={duimpFields.uf}
                      onChange={(e) => setDuimpFields({ ...duimpFields, uf: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Código URF</label>
                    <input
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: 0817600 (Santos/SP)"
                      value={duimpFields.codigoURF}
                      onChange={(e) => setDuimpFields({ ...duimpFields, codigoURF: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Via de Transporte</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      value={duimpFields.viaTransporte}
                      onChange={(e) => setDuimpFields({ ...duimpFields, viaTransporte: e.target.value })}
                    >
                      <option value="MARITIMO">Marítimo</option>
                      <option value="AEREO">Aéreo</option>
                      <option value="RODOVIARIO">Rodoviário</option>
                      <option value="FERROVIARIO">Ferroviário</option>
                      <option value="COURIER">Courier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tipo de Declaração</label>
                    <select
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      value={duimpFields.tipoDeclaracao}
                      onChange={(e) => setDuimpFields({ ...duimpFields, tipoDeclaracao: e.target.value })}
                    >
                      <option value="CONSUMO">Consumo</option>
                      <option value="ADMISSAO_TEMPORARIA">Admissão temporária</option>
                      <option value="ENTREPOSTO">Entreposto</option>
                      <option value="REIMPORTACAO">Reimportação</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Data de Embarque</label>
                    <input
                      type="date"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                      value={duimpFields.dataEmbarque}
                      onChange={(e) => setDuimpFields({ ...duimpFields, dataEmbarque: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Incoterm</label>
                      <input
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="FOB"
                        value={duimpFields.incoterm}
                        onChange={(e) => setDuimpFields({ ...duimpFields, incoterm: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Moeda</label>
                      <select
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                        value={duimpFields.moeda}
                        onChange={(e) => setDuimpFields({ ...duimpFields, moeda: e.target.value })}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="BRL">BRL</option>
                        <option value="CNY">CNY</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Dica: o peso bruto e valores por item são editáveis nos cartões de itens acima.
                </div>
              </div>

              {/* Bloco 3: Compliance & Action */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                 <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                    <span className="bg-primary-600 text-xs rounded px-2 py-0.5">3</span> Compliance (Simulação)
                 </h3>
                 
                 <div className="flex flex-col gap-4 mb-6">
                   {/* Dropdown Multi-Select para Anuentes */}
                   <div className="flex-1">
                      <span className="block text-xs text-slate-400 mb-2">Órgãos Anuentes Necessários</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setAnuentsDropdownOpen(!anuentsDropdownOpen)}
                          className="w-full bg-slate-950 border border-slate-700 text-left px-3 py-2.5 rounded-lg text-sm text-slate-300 flex items-center justify-between hover:border-slate-600 transition-colors"
                        >
                          <span className={selectedAnuentes.length === 0 ? 'text-slate-500' : 'text-slate-300'}>
                            {selectedAnuentes.length === 0
                              ? 'Selecione os anuentes...'
                              : `${selectedAnuentes.length} órgão(s) selecionado(s)`}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${anuentsDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {anuentsDropdownOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                            <div className="p-2 border-b border-slate-700">
                              <button
                                type="button"
                                onClick={() => setSelectedAnuentes([])}
                                className="text-xs text-slate-400 hover:text-slate-300"
                              >
                                Limpar seleção
                              </button>
                            </div>
                            <div className="p-1">
                              {LISTA_ANUENTES.map(anuente => (
                                <label
                                  key={anuente}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedAnuentes.includes(anuente)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedAnuentes([...selectedAnuentes, anuente]);
                                      } else {
                                        setSelectedAnuentes(selectedAnuentes.filter(a => a !== anuente));
                                      }
                                    }}
                                    className="rounded bg-slate-900 border-slate-600 text-primary-600 focus:ring-primary-600 focus:ring-offset-slate-900"
                                  />
                                  <span className="text-sm text-slate-300">{anuente}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tags dos anuentes selecionados */}
                      {selectedAnuentes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {selectedAnuentes.map(anuente => (
                            <span
                              key={anuente}
                              className="inline-flex items-center gap-1 bg-primary-600/20 text-primary-400 text-xs px-2 py-1 rounded-full border border-primary-600/30"
                            >
                              {anuente}
                              <button
                                type="button"
                                onClick={() => setSelectedAnuentes(selectedAnuentes.filter(a => a !== anuente))}
                                className="hover:text-primary-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                   </div>

                   {/* LPCO */}
                   <div className="flex-1">
                      <span className="block text-xs text-slate-400 mb-2">LPCO já solicitado?</span>
                      <div className="flex items-center gap-4">
                         <button
                           type="button"
                           onClick={() => setLpcoRequested(true)}
                           className={`flex-1 py-2 px-3 rounded text-sm font-medium border transition-colors ${lpcoRequested ? 'bg-primary-600/20 border-primary-600 text-primary-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                         >
                           Sim
                         </button>
                         <button
                           type="button"
                           onClick={() => setLpcoRequested(false)}
                           className={`flex-1 py-2 px-3 rounded text-sm font-medium border transition-colors ${!lpcoRequested ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                         >
                           Não
                         </button>
                      </div>
                   </div>
                 </div>

                 <button
                   data-simulation-btn
                   onClick={handleSimulationClick}
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

          {/* Resultados da Simulação - Compacto */}
          {results && (
            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" /> Resultado da Simulação
                </h4>
                <button
                  onClick={() => setShowReport(true)}
                  className="text-xs text-primary-400 hover:text-primary-300 underline underline-offset-2"
                >
                  Ver detalhes
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-950 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Riscos</div>
                  <div className="text-lg font-bold text-orange-400">{results.risks.length}</div>
                </div>
                <div className="bg-slate-950 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Impacto</div>
                  <div className="text-lg font-bold text-red-400">{results.totalImpact}</div>
                </div>
                <div className="bg-slate-950 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Economia</div>
                  <div className="text-lg font-bold text-green-400">{results.avoided}</div>
                </div>
              </div>
            </div>
          )}

          {/* Botão Gerar Documento */}
          {results && (
            <div className="mt-6">
              <button
                onClick={generateDocument}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
              >
                <FileCheck className="w-5 h-5" /> Gerar Documento Pronto
              </button>
            </div>
          )}
          </div>
          )}

          {/* === STEP 4: DOCUMENT (Layout Limpo) === */}
          {workflowStep === 'document' && (
            <div className="max-w-2xl mx-auto">
              {/* Métricas de Produtividade - Compacto */}
              <div className="bg-gradient-to-r from-green-900/30 to-accent-900/30 border border-green-800/30 rounded-xl p-4 mb-8">
                <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">{selectedInvoice ? SAMPLE_INVOICES[selectedInvoice as keyof typeof SAMPLE_INVOICES].processingTime : 8} min</div>
                    <div className="text-xs text-slate-400">Com copiloto</div>
                  </div>
                  <div className="text-slate-600 text-sm">vs</div>
                  <div>
                    <div className="text-xl font-bold text-slate-500 line-through">25 min</div>
                    <div className="text-xs text-slate-500">Manual</div>
                  </div>
                  <div className="bg-green-500/10 px-3 py-1.5 rounded-lg">
                    <div className="text-xl font-bold text-green-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" /> {timeStats.saved} min
                    </div>
                    <div className="text-xs text-green-400/70">economizados</div>
                  </div>
                </div>
              </div>

              {/* Card Principal - Documento Pronto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-green-800/50 rounded-xl p-6"
              >
                {/* Checklist de Validação */}
                <div className="bg-slate-950 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Checklist de Validação
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">NCMs validados</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">Valores conferidos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-slate-300">País de origem OK</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedAnuentes.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className="text-slate-300">Anuências OK</span>
                    </div>
                  </div>
                </div>

                {/* Resumo da Operação */}
                <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                  <div className="bg-slate-950 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">Tipo</div>
                    <div className="text-white font-medium text-xs">{operationData.type}</div>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">URF</div>
                    <div className="text-white font-medium text-xs">{operationData.urf}</div>
                  </div>
                  <div className="bg-slate-950 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">País</div>
                    <div className="text-white font-medium text-xs">{operationData.country}</div>
                  </div>
                </div>

                {/* Itens - Compacto */}
                <div className="bg-slate-950 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Itens ({items.length})</h4>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-white">{item.desc || 'Item ' + (idx + 1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs">NCM: {item.ncm || 'N/A'}</span>
                          {item.ncm && item.ncmConfianca && (
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${
                                item.ncmConfianca === 'ALTA' ? 'bg-green-500' :
                                item.ncmConfianca === 'MEDIA' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              title={`Confiança ${item.ncmConfianca}`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-2">
                  <button
                    onClick={handleCopyAll}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="w-4 h-4" /> Copiar Tudo
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyFields}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Copy className="w-4 h-4" /> Copiar Campos
                    </button>
                    <button
                      onClick={handleExportDUIMP}
                      className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Exportar PDF
                    </button>
                  </div>
                </div>

                {/* Botão Preview Portal Único */}
                {results && (
                  <button
                    onClick={() => setShowFichaModal(true)}
                    className="w-full mt-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-slate-800"
                  >
                    <FileText className="w-4 h-4" /> Ver preview Portal Único
                  </button>
                )}

                {/* Botão Exportar XML Siscomex */}
                {currentOperationId && (
                  <button
                    onClick={handleExportSiscomexXml}
                    className="w-full mt-3 bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Exportar XML Siscomex
                  </button>
                )}
              </motion.div>

              {/* Mensagem de Sucesso */}
              <div className="mt-6 bg-green-500/10 border border-green-800/30 rounded-xl p-6 text-center">
                <div className="text-4xl mb-2">✨</div>
                <p className="text-green-400 font-bold text-lg">
                  Documento pronto!
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Você economizou <span className="text-green-400 font-medium">{timeStats.saved} minutos</span> nesta operação.
                </p>
              </div>
            </div>
          )}

          {/* Modal da Ficha Portal Único */}
          <AnimatePresence>
            {showFichaModal && results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowFichaModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Preview Portal Único</h3>
                    <button
                      onClick={() => setShowFichaModal(false)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FichaProdutoSimulada
                      operation={operationData}
                      items={items}
                      inadimplencia={results.inadimplencia}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'simulation'>('landing');
  const [shouldOpenAuth, setShouldOpenAuth] = useState(false);

  // Função para navegar para a simulação (rola para o topo)
  const navigateToSimulation = () => {
    setShouldOpenAuth(false);
    setCurrentScreen('simulation');
    window.scrollTo(0, 0);
  };

  // Função para navegar para a simulação E abrir auth modal
  const navigateToAuth = () => {
    setShouldOpenAuth(true);
    setCurrentScreen('simulation');
    window.scrollTo(0, 0);
  };

  // Função para voltar para a home (rola para o topo)
  const navigateHome = () => {
    setShouldOpenAuth(false);
    setCurrentScreen('landing');
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentScreen === 'landing' ? (
        <LandingPage onNavigateToSimulation={navigateToSimulation} onOpenAuth={navigateToAuth} />
      ) : (
        <PlatformSimulationPage onNavigateHome={navigateHome} openAuthOnMount={shouldOpenAuth} />
      )}
    </>
  );
}
