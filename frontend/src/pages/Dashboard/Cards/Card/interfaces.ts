export interface CardPropTypes {
  text: string;
  loading: boolean;
  url: string;
  value: string;
  color?: string;
  icon?: any;
  subText?: string;
}
export interface CardsResult {
  sales: {
    count: number;
    totalValueCommissionMonth: number;
    totalValueMonth: number;
    totalValueInputMonth: number;
    users: number;
    m2: number;
  };
  user: {
    count: number;
    totalValueCommissionMonth: number;
    totalValueMonth: number;
    users: number;
  };
  expenses: Array<ExpenseResult>;
  expensesByType: Array<ExpenseResult>;
}
export interface CardValues {
  count: number;
  totalValueMonth: number;
}

export interface ExpenseResult {
  count: number;
  totalValueMonth: number;
  paidOut: number;
  name: string;
  id: number;
}
export const initialStateCards: CardsResult = {
  sales: {
    count: 0,
    totalValueCommissionMonth: 0,
    totalValueMonth: 0,
    totalValueInputMonth: 0,
    users: 0,
    m2: 0
  },
  user: {
    count: 0,
    totalValueCommissionMonth: 0,
    totalValueMonth: 0,
    users: 0
  },
  expenses: [],
  expensesByType: []
};
