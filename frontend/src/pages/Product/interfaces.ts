import { Company } from './../Company/interfaces';
import { Users } from '../User/interfaces';
import { productCategoriesEnum } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';

export interface Category {
  name?: string;
}
export interface Product {
  company?: Company;
  supplier?: Users;
  category?: Category;
  id?: string;
  categoryId?: number;
  companyId?: string;
  supplierId?: number;
  name?: string;
  price?: string;
  inventoryCount?: number;
  image?: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  m2PerTank?: number;
  kgPerTank?: number;
  bag?: number;
}

export const initialStateForm: Product = {
  id: undefined,
  name: '',
  price: '',
  active: true,
  createdAt: '',
  updatedAt: '',
  m2PerTank: 250
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
  pageSize: 100
};

export const getCostValue = (p: Product) => {
  if (p.categoryId != productCategoriesEnum.INSUMO) return 0;

  return Number(p.price) * Number(p.inventoryCount);
};

export const getCost = (p: Product) => {
  if (p.categoryId != productCategoriesEnum.INSUMO) return '';

  return formatPrice(getCostValue(p));
};

export const calcInput = (state: Product) => {
  let totalTank = 0;
  if (state.inventoryCount && state.kgPerTank)
    totalTank = state.inventoryCount / state.kgPerTank;
  let totalM2 = 0;
  if (totalTank && state.m2PerTank) totalM2 = state.m2PerTank * totalTank;

  return { totalTank, totalM2 };
};
