import { Company } from './../Company/interfaces';
export interface Product {
  company?: Company;  
  id?: string;
  name?: string;
  price?: string;
  size?: string;
  inventoryCount?: number;
  color?: string;
  image?: string;
  ean?: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string; 
}

export const initialStateForm: Product = {
  id: undefined,
  name: '',
  price: '',
  size: '',
  active: true,
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  name: string;
  priceMin?: string;
  priceMax?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  pageNumber: 1,
  pageSize: 10
};
