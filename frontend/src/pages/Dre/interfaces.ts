export interface DreTotals {
  name: string;
  description: string;
  total: number;
  month: number;
  year: number;
  expenseTypeId: number;
}
export interface DataDreResult {
  applications: Array<DreTotals>;
  expenses: Array<DreTotals>;
  m2: Array<DreTotals>;
  sales: Array<DreTotals>;
  contracts: Array<DreTotals>;
  visits: Array<DreTotals>;
}

export const initialStateDre: DataDreResult = {
  applications: [],
  expenses: [],
  m2: [],
  sales: [],
  contracts: [],
  visits: []
};

export const typeLayoutDreEnum = {
  SIMPLIFIED: 'SIMPLIFICADO',
  DEATAILED: 'DETALHADO'
};

export interface DreTotalsResult {
  expenses: Array<DreTotals>;
  sales: Array<DreTotals>;
  contracts: Array<DreTotals>;
  visits: Array<DreTotals>;
  applications: Array<DreTotals>;
  m2: Array<DreTotals>;
}

export interface DreGrigResult {
  name: string;
  acc: string;
  month1?: string;
  month2?: string;
  month3?: string;
  month4?: string;
  month5?: string;
  month6?: string;
  month7?: string;
  month8?: string;
  month9?: string;
  month10?: string;
  month11?: string;
  month12?: string;
  style: LineStyle;
  type: string;
}

export interface LineStyle {
  backGround: string;
  color: string;
}

export const typeItemEnum = {
  PRICE: 'PRICE',
  NUMBER: 'NUMBER',
  TEXT: 'TEXT',
  PERCENT: 'PERCENT'
};
export const typeDataDreEnum = {
  FATURAMENTO_BRUTO: 'FATURAMENTO_BRUTO',
  M2: 'M2',
  LITERS: 'LITERS',
  TANQUES: 'TANQUES',
  EBITDA: 'EBITDA',
  MARGEM_BRUTA: 'MARGEM_BRUTA',
  DESPESAS: 'DESPESAS',
  INSUMOS: 'INSUMOS',
  IMPOSTOS: 'IMPOSTOS',
  LIQUIDO: 'LIQUIDO',
  INVESTIMENTOS: 'INVESTIMENTOS',
  RETIRADAS: 'RETIRADAS',
  PGTO_INSUMO: 'PGTO_INSUMO',
  SALDO: 'SALDO',
  BLANK: 'BLANK',
  PERCENT: 'PERCENT',
  FUNIL: 'FUNIL',
  INDICADORES: 'INDICADORES',
  INDICADORES_OP: 'INDICADORES_OP',
  DESPESAS_OP: 'DESPESAS_OP',
  PGTO_ADICIONAIS: 'PGTO_ADICIONAIS',
  MARKETING: 'MARKETING',
  KM_VISITAS: 'KM_VISITAS',
  PRICE_MED_M2: 'PRICE_MED_M2',
};

export const typeDataDreTextEnum: any = {
  FATURAMENTO_BRUTO: 'Fat Bruto (+)',
  M2: 'M2 aplicados',
  LITERS: 'Litros insumos',
  TANQUES: 'Tanques',
  EBITDA: '= EBITDA',
  MARGEM_BRUTA: '= M Bruta',
  DESPESAS: 'Despesas (-)',
  INSUMOS: 'Insumos (-)',
  IMPOSTOS: 'Impostos (-)',
  LIQUIDO: '= L Líquido',
  INVESTIMENTOS: 'Investimentos (-)',
  RETIRADAS: 'Retiradas (-)',
  PGTO_INSUMO: 'Pgto Insu (-)',
  SALDO: '= Saldo Caixa',
  PERCENT: '% Faturamento',
  FUNIL: 'Funil Leads',
  INDICADORES: 'Indicadores',
  INDICADORES_OP: 'Indicadores OP',
  DESPESAS_OP: 'Despesas OP',
  PGTO_ADICIONAIS: 'Pgto adicionais',
  MARKETING: 'Total em publicidade',
  KM_VISITAS: 'KM visitas',
  PRICE_MED_M2: 'Médio M2',
};

export interface DreTableProps {
  items: DreGrigResult[];
  year: number;
  type: string;
}
