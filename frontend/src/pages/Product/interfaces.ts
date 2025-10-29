import { Company } from './../Company/interfaces';
import { Users } from '../User/interfaces';

export interface Category {
  name?: string;
}
export interface Product {
  company?: Company;
  supplier?: Users;
  category?: Category;
  id?: string;
  categoryId?: number;
  supplierId?: number;
  name?: string;
  price?: string;
  inventoryCount?: number;
  image?: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  isInput?: string;
}

export const initialStateForm: Product = {
  id: undefined,
  name: '',
  price: '',
  active: true,
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  name: string;
  priceMin?: string;
  priceMax?: string;
  userName?: string;
  category?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  pageNumber: 1,
  pageSize: 10
};
