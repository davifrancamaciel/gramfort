export interface CardPropTypes {
  text: string;
  loading: boolean;
  url: string;
  value: string;
  color?: string;
  icon?: any;
}
export interface CardsReuslt {
  
  sales: {
    count: number;
    totalValueCommissionMonth: number;
    totalValueMonth: number;
    users: number;
  };
  user: {
    count: number;
    totalValueCommissionMonth: number;
    totalValueMonth: number;
    users: number;
  };
  expenses: {
    count: number;
    totalValueMonth: number;
  };
}

export const initialStateCards: CardsReuslt = {  
  sales: {
    count: 0,
    totalValueCommissionMonth: 0,
    totalValueMonth: 0,
    users: 0
  },
  user: {
    count: 0,
    totalValueCommissionMonth: 0,
    totalValueMonth: 0,
    users: 0
  },
  expenses: {
    count: 0,
    totalValueMonth: 0
  }
};
