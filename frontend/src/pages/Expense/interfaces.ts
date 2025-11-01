import { Company } from '../Company/interfaces';
export interface ExpenseType {
  name: string;
}
export interface Expense {
  id?: string;
  expenseType?: ExpenseType;
  company?: Company;
  expenseTypeId?: number;
  userId?: number;
  vehicleId?: number;
  supplierId?: number;
  dividedIn: number;
  value?: number;
  amount?: number;
  title?: string;
  paymentMethod?: string;
  description?: string;
  paidOut: boolean;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}
export interface ExpenseTotal {
  count: number;
  totalValueMonth: number;
  paidOut: boolean;
}

export const initialStateForm: Expense = {
  id: undefined,
  dividedIn: 1,
  createdAt: '',
  updatedAt: '',
  paymentDate: new Date().toISOString(),
  paidOut: false
};

export interface Filter {
  id?: string;
  expenseTypeName?: string;
  userName?: string;
  vehicleModel?: string;
  title?: string;
  description?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  paymentDateStart?: string;
  paymentDateEnd?: string;
  paidOut?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  expenseTypeName: '',
  title: '',
  description: '',
  pageNumber: 1,
  pageSize: 100
};
