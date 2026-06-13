import { ExpenseResult } from 'pages/Expense/interfaces';

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
    totalValueMonth: number;
    totalValueInputMonth: number;
    m2: number;
    tanksApplied: number;
    totalValueVisitsMonth: number;
    countVisis: number;
    satisfactionCount: number;
    satisfactionValue: number;
  };
  salesAcc: {
    count: number;
    totalValueMonth: number;
    totalValueInputMonth: number;
    m2: number;
    totalValueVisitsMonth: number;
    countVisis: number;
  };
  user: {
    count: number;
    totalValueMonth: number;
  };
  expenses: Array<ExpenseResult>;
  expensesByType: Array<ExpenseResult>;
  expensesByTypeAcc: Array<ExpenseResult>;
}
export interface CardValues {
  count: number;
  totalValueMonth: number;
}

export const initialStateCards: CardsResult = {
  sales: {
    count: 0,
    totalValueMonth: 0,
    totalValueInputMonth: 0,
    m2: 0,
    tanksApplied: 0,
    totalValueVisitsMonth: 0,
    countVisis: 0,
    satisfactionValue: 0,
    satisfactionCount: 0
  },
  salesAcc: {
    count: 0,
    totalValueMonth: 0,
    totalValueInputMonth: 0,
    m2: 0,
    totalValueVisitsMonth: 0,
    countVisis: 0
  },
  user: {
    count: 0,
    totalValueMonth: 0
  },
  expenses: [],
  expensesByType: [],
  expensesByTypeAcc: []
};
