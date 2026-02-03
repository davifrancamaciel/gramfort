export interface Company {
  id?: string;
  name?: string;
  groups?: string;
  image?: string;
  email?: string;
  phone?: string;
  banner?: string;
  groupsFormatted: string[];
  createdAt?: string;
  updatedAt?: string;
  pixKey?: string;
  active: boolean;
  individualCommission: boolean;
  state?: string;
  city?: string;
  address?: string;
  manager?: string;

  currency?: string;
  fantasyName?: string;
  imageHeaderContract?: string;
  imageFooterContract?: string;
  imageSignature?: string;
  agencyBank?: string;
  site?: string;
  instagran?: string;
  cnpj?: string;
  zipCode?: string;
  directorName?: string;
  financeName?: string;
  financePhone?: string;
  sizeTank?: number;

  textclauseContract2?: string;
  textclauseContract3?: string;
  textclauseContract4?: string;
  textVisit?: string;
  companiesIds?: string;
}

export const initialStateForm: Company = {
  id: undefined,
  name: '',
  groups: '',
  groupsFormatted: [],
  createdAt: '',
  updatedAt: '',
  active: true,
  individualCommission: false
};

export interface Filter {
  id?: string;
  name?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  pageNumber: 1,
  pageSize: 10
};
