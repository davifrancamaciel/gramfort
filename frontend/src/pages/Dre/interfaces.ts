export interface DreTotals {
  name: string;
  total: number;
  month: number;
  expenseTypeId: number;
}

export interface DreTotalsResult {
  expenses: Array<DreTotals>;
  sales: Array<DreTotals>;
  visits: Array<DreTotals>;
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
}
