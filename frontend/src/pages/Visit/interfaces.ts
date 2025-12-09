import { Company } from '../Company/interfaces';

export interface User {
  name: string;
}
export interface Visit {
  id?: string;
  clientName?: string;
  userName?: string;
  companyName?: string;
  client?: User;
  clientId?: number;
  user?: User;
  userId?: number;
  company?: Company;
  km?: number;

  valueFormatted?: string;
  value?: number;
  paidOut: boolean;
  proposal: boolean;
  sale: boolean;
  paymentDate?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  state?: string;
  city?: string;
  address?: string;
  note?: string;
}

export const initialStateForm: Visit = {
  id: undefined,
  createdAt: '',
  updatedAt: '',
  date: new Date().toISOString(),
  paidOut: false,
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
  pageSize: 100
};
