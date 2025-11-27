export interface CardPropTypes {
  text: string;
  loading: boolean;
  value: string;
  color?: string;
  icon?: any;
}

export interface TotalSale {
  total: number;
  visit: number;
  discount: number;
  cost: number;
  balance: number;
  km?: number;
}

export const initialState: TotalSale = {
  total: 0,
  visit: 0,
  discount: 0,
  cost: 0,
  balance: 0
};
