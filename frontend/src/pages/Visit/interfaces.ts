import { Company } from '../Company/interfaces';

export interface User {
  name: string;
}
export interface Visit {
  id?: string;
  client?: User;
  clientId?: number;
  user?: User;
  userId?: number;
  company?: Company;
  km?: number;

  value?: number;
  paidOut: boolean;
  carriedOut: boolean;
  proposal: boolean;
  sale: boolean;
  paymentDate?: string;
  date?: string;
  dateHour?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  state?: string;
  city?: string;
  address?: string;
}

export const initialStateForm: Visit = {
  id: undefined,
  createdAt: '',
  updatedAt: '',
  date: new Date().toISOString(),
  paidOut: false,
  carriedOut: false,
  proposal: false,
  sale: false
};

export interface Filter {
  id?: string;
  clientName?: string;
  title?: string;
  description?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  paymentDateStart?: string;
  paymentDateEnd?: string;
  dateStart?: string;
  dateEnd?: string;
  paidOut?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  clientName: '',
  title: '',
  description: '',
  pageNumber: 1,
  pageSize: 20
};
