import { appRoutes } from 'utils/defaultValues';

export const getType = () => {
  if (window.location.pathname.includes(appRoutes.contracts))
    return appRoutes.contracts;
  return appRoutes.sales;
};

export const getTitle = (path: string, isPlural: boolean = false) => {
  switch (path) {
    case appRoutes.contracts:
      return `Contrato${isPlural ? 's' : ''}`;
    default:
      return `Venda${isPlural ? 's' : ''}`;
  }
};
