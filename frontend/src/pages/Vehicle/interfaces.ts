import { IOptions } from 'utils/commonInterfaces';
import { Company } from '../Company/interfaces';

export interface Vehicle {
  id?: string;
  company?: Company;
  category?: string;
  model?: string;
  year?: number;
  kmInitial?: number;
  kmCurrent?: number;
  value?: number;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}

export const initialStateForm: Vehicle = {
  id: undefined,
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  model?: string;
  description?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  model: '',  
  description: '',
  pageNumber: 1,
  pageSize: 100
};

const arrYears = (): number[] => {
  const year = new Date().getFullYear();
  let array: number[] = [];
  for (let i = year; i > year - 30; i--) {
    array.push(i);
  }
  return array;
};
export const years: IOptions[] = arrYears().map((x: number) => ({
  value: `${x}`,
  label: `${x}`
}));