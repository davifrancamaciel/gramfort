import { Company } from './../Company/interfaces';

export interface Users {
  company?: Company;  
  id?: string;
  companyId?: string;
  name: string;
  email: string;
  commissionMonth?: number;
  accessType?: string[];
  accessTypeText?: string;
  status: boolean;
  active: boolean;
  password?: string;
  image?: string;
  statusText?: any;
  userStatusText?: any;
  resetPassword?: boolean;
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  
  cpfCnpj?: string;
  state?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  hiringDate?: string;
  salesRepresentative?: string;
  capture?: string;
  
  type: 'USER' | 'CLIENT'| 'SUPPLIER';
}

export const initialStateForm: Users = {
  id: undefined,
  company: undefined,
  name: '',
  email: '',
  accessType: [],
  status: true,
  active: true,
  password: '',
  type: 'USER',
};

export interface Filter {
  name: string;
  companyName: string;
  type: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  name: '',
  type: '',
  companyName: '',
  pageNumber: 1,
  pageSize: 100
};

export interface UserCognito {
  Attributes: UserCognitoAttribute[];
  Enabled: boolean;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
  Username: string;
  Groups?: string[];
}
export interface UserCognitoAttribute {
  Name: string;
  Value: string;
}
