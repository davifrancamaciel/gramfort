import { formatPrice } from 'utils/formatPrice';
import { appRoutes } from 'utils/defaultValues';
import { Sale } from './interfaces';

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

export const createLinkShare = (sale?: Sale) => {
  return `${window.location.origin}/${appRoutes.contracts}/approve/${sale?.id}?hash=${sale?.hash}`;
};

export const createMessageShare = (sale?: Sale) => {
  return `Olá, ${
    sale?.client?.name
  } segue o link da proposta para aprovação ${createLinkShare(sale)}`;
};

export const getBalance = (sale: Sale, isSubCost: boolean = false) => {
  const value = getBalanceValue(sale, isSubCost);
  return formatPrice(value);
};

export const getBalanceValue = (sale: Sale, isSubCost: boolean = false) => {
  const value =
    Number(sale.value || 0) -
    Number(sale.visit?.value || 0) -
    Number(sale.discountValue || 0) -
    Number(isSubCost ? sale.valueInput : 0 || 0);
  return value;
};

export const getCostValue = (sale: Sale, isSumCost: boolean = false) => {
  const value =
    Number(isSumCost ? sale.valueInput : 0) +
    Number(sale.discountValue || 0) +
    Number(sale.visit?.value || 0);
  return value;
};
