export interface DreTotals {
  name: string;
  total: number;
  month: number;
  year: number;
  expenseTypeId: number;
}

export interface DreTotalsResult {
  expenses: Array<DreTotals>;
  sales: Array<DreTotals>;
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
  PERCENT: 'PERCENT'
};

export const typeDataDreTextEnum: any = {
  FATURAMENTO_BRUTO: 'Fat Bruto (+)',
  M2: 'M2 aplicados',
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
  PERCENT: '% Faturamento'
};

export interface DreTableProps {
  items: DreGrigResult[];
  year: number;
  type: 'SIMPLIFICADO' | 'DETALHADO';
}
