/**
 * Constantes compartilhadas do TrueNorth
 */

// Lista de países que mais exportam para o Brasil
export const PAISES_IMPORTADORES = [
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
] as const;

// Lista de órgãos anuentes
export const LISTA_ANUENTES = [
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
] as const;

// Lista de URFs de despacho
export const URFS_DESPACHO = [
  'Santos/SP',
  'Paranaguá/PR',
  'Rio Grande/RS',
  'Itajaí/SC',
  'Rio de Janeiro/RJ',
  'Vitória/ES',
  'Suape/PE',
  'Salvador/BA',
  'Manaus/AM',
  'São Paulo/SP (Aeroporto)',
  'Campinas/SP (Viracopos)',
  'Guarulhos/SP',
  'Curitiba/PR',
  'Porto Alegre/RS',
  'Brasília/DF'
] as const;

// Modalidades de importação
export const MODALIDADES = [
  'Conta e Ordem',
  'Encomenda',
  'Por Conta Própria'
] as const;

// Setores
export const SETORES = [
  'Alimentos',
  'Automotivo',
  'Brinquedos',
  'Construção',
  'Cosméticos',
  'Eletrônicos',
  'Farmacêutico',
  'Máquinas',
  'Médico',
  'Químicos',
  'Têxteis',
  'Outros'
] as const;

// Moedas
export const MOEDAS = [
  { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$' },
  { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
  { codigo: 'CNY', nome: 'Yuan Chinês', simbolo: '¥' },
  { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£' },
  { codigo: 'JPY', nome: 'Iene Japonês', simbolo: '¥' },
  { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$' }
] as const;

// Incoterms
export const INCOTERMS = [
  { codigo: 'EXW', nome: 'Ex Works' },
  { codigo: 'FCA', nome: 'Free Carrier' },
  { codigo: 'FAS', nome: 'Free Alongside Ship' },
  { codigo: 'FOB', nome: 'Free On Board' },
  { codigo: 'CFR', nome: 'Cost and Freight' },
  { codigo: 'CIF', nome: 'Cost, Insurance and Freight' },
  { codigo: 'CPT', nome: 'Carriage Paid To' },
  { codigo: 'CIP', nome: 'Carriage and Insurance Paid To' },
  { codigo: 'DAP', nome: 'Delivered at Place' },
  { codigo: 'DPU', nome: 'Delivered at Place Unloaded' },
  { codigo: 'DDP', nome: 'Delivered Duty Paid' }
] as const;

// Tipos de importador
export const TIPOS_IMPORTADOR = [
  'Pessoa Jurídica',
  'Pessoa Física',
  'Órgão Público'
] as const;

// Fundamentos legais
export const FUNDAMENTOS_LEGAIS = [
  'Consumo',
  'Industrialização',
  'Revenda',
  'Uso Próprio'
] as const;

// Regimes de tributação
export const REGIMES_TRIBUTACAO = [
  'Tributação Normal',
  'Suspensão',
  'Isenção',
  'Redução'
] as const;
