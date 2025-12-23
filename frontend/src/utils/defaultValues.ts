import { IOptions } from './commonInterfaces';

export const systemColors = {
  GREEN: '#389e0d',
  YELLOW: '#ffa940',
  RED: '#e3262e',
  RED_DARK: '#ba1628',
  BLUE: '#0D6EFD',
  GREY: '#8c8c8c',
  ORANGE: '#FF4500',
  LIGHT_BLUE: '#2db7f5',
  DARK_BLUE: '#333B7C',
  LIGHT_PINK: '#FF9A9A',
  LIGHT_GREY: '#999999',
  GREY_MEDIUM: '#ccc'
};

export const appRoutes = {
  users: 'users',
  clients: 'clients',
  suppliers: 'suppliers',
  products: 'products',
  sales: 'sales',
  contracts: 'contracts',
  expenses: 'expenses',
  companies: 'companies',
  services: 'services',
  shopping: 'shopping',
  visits: 'visits',
  vehicles: 'vehicles',
  dre: 'dre',
};

export const apiRoutes = {
  dashboard: 'dashboard',
  dre: appRoutes.dre,
  groups: 'groups',
  users: appRoutes.users,
  products: appRoutes.products,
  sales: appRoutes.sales,
  companies: appRoutes.companies,
  services: appRoutes.services,
  expenses: appRoutes.expenses,
  visits: appRoutes.visits,
  vehicles: appRoutes.vehicles,
  expenseTypes: 'expense-types',
  categories: 'categories'
};

export const apiRoutesArray = [
  apiRoutes.dashboard,
  apiRoutes.dre,
  apiRoutes.users,
  apiRoutes.groups,
  apiRoutes.products,
  apiRoutes.sales,
  apiRoutes.companies,
  apiRoutes.expenseTypes,
  apiRoutes.expenses,
  apiRoutes.services,
  apiRoutes.visits,
  apiRoutes.vehicles,
  apiRoutes.categories
];

export const roules = {
  administrator: 'administrador',
  users: 'usuarios',
  products: 'produtos',
  sales: 'vendas',
  contracts: 'contratos',
  saleUserIdChange: 'vendedor_vendas',
  expenses: 'despesas',
  clients: 'clientes',
  suppliers: 'fornecedores',
  shopping: 'compras',
  visit: 'visitas',
  vehicles: 'veiculos'
};

export const enumStatusUserAws = {
  FORCE_CHANGE_PASSWORD: 'FORCE_CHANGE_PASSWORD',
  NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
  CONFIRMED: 'CONFIRMED'
};

export const booleanFilter: IOptions[] = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' }
];

export const userType = {
  USER: 'USER',
  CLIENT: 'CLIENT',
  SUPPLIER: 'SUPPLIER'
};

export const pageItemsFilter: IOptions[] = [
  { value: '10', label: '10' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '500', label: '500' },
  { value: '1000', label: '1.000' }
];

export const expensesTypesEnum = {
  COMPRAS: 1,
  OUTROS: 2,
  COMI: 3,
  DFIX: 4,
  PAGAMENTO: 5,
  IMPOSTOS: 6,
  SEGURO: 7,
  INVESTIMENTOS: 8,
  MKT: 9,
  MPUB: 10,
  COMB: 11,
  PEDAGIO: 12,
  ALIMENTACAO: 13,
  MANUTENCAO: 14,
  EXTRAS: 15,
  EQUIPAMENTOS: 16,
  INSUMOS: 17,
  IPVA: 18,
  REAP: 19
};

export const productCategoriesEnum = {
  SERVICO: 1,
  INSUMO: 2,
  CUSTO: 3,
  SERVICO_M2: 4
};

export const categorIdsArrayProduct = [
  productCategoriesEnum.SERVICO,
  productCategoriesEnum.SERVICO_M2
];

export const categorIdsArrayCost = [productCategoriesEnum.CUSTO];

