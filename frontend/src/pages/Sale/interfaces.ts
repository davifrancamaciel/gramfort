import { Users } from '../User/interfaces';
import { Company } from './../Company/interfaces';
import { Visit } from './../Visit/interfaces';

export interface Product {
  id?: number;
  categoryId?: number;
  name: string;
  size: string;
  price: number;
  isInput: boolean;
  description?: string;
}
export interface SaleProduct {
  id?: string;
  productId: number;
  value: number;
  valueStr?: string;
  valueAmount: number;
  amount: number;
  amountStr?: string;
  product: Product;
  description?: string;
}
export interface Sale {
  company?: Company;
  id?: string;
  user?: Users;
  client?: Users;
  visit?: Visit;
  products: Product[];
  productsSales: SaleProduct[];
  inputs: Product[];
  value?: number;
  valueInput?: number;
  commission?: number;
  note?: string;
  userId?: string;
  clientId?: string;
  userName?: string;
  clientName?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  invoiceNumber?: string;
  germinationLevel?: string;
  contact?: string;
  capture?: string;
  nature?: string;
  saleDate?: string;
  distance?: number;
  demand?: string;
  invoice: boolean;
}

export const initialStateForm: Sale = {
  id: undefined,
  products: [],
  inputs: [],
  productsSales: [],
  invoice: false
};

export interface Filter {
  id?: string;
  product?: string;
  note?: string;
  valueMin?: string;
  valueMax?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  pageNumber: number;
  pageSize: number;
  showCommission: boolean;
}

export const initialStateFilter: Filter = {
  id: '',
  product: '',
  pageNumber: 1,
  pageSize: 100,
  showCommission: false
};
