import { Company } from '../Company/interfaces';
import { Sale } from '../Sale/interfaces';
import { Product } from '../Product/interfaces';
import { typeApplication } from 'utils';

export interface User {
  name: string;
}
export interface Application {
  id?: string;

  companyId?: string;
  company?: Company;
  companyName?: string;

  userId?: number;
  user?: User;
  userName?: string;

  clientId?: number;
  client?: User;
  clientName?: string;

  saleId?: number;
  sale?: Sale;

  productId?: number;
  product?: Product;

  amount?: number;
  date?: string;
  note?: string;
  type?: string;

  createdAt?: string;
  updatedAt?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  approved?: boolean;
}

export const initialStateForm: Application = {
  id: undefined,
  createdAt: '',
  updatedAt: '',
  type: typeApplication.APPLICATION,
  date: new Date().toISOString()
};

export interface Filter {
  id?: string;
  clientName?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  dateStart?: string;
  dateEnd?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  clientName: '',
  pageNumber: 1,
  pageSize: 100
};
