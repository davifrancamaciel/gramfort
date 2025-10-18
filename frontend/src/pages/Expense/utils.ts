import { IOptions } from 'utils/commonInterfaces';
import { appRoutes } from 'utils/defaultValues';

export const getType = () => {
  if (window.location.pathname.includes(appRoutes.shopping))
    return appRoutes.shopping;
  return appRoutes.expenses;
};

export const getTitle = (path: string, isPlural: boolean = false) => {
  switch (path) {
    case appRoutes.shopping:
      return `Compra${isPlural ? 's' : ''}`;
    default:
      return `Despesa${isPlural ? 's' : ''}`;
  }
};

const array: Array<string> = ['BOLETO', 'CREDITO', 'DEBITO', 'DINHEIRO', 'PIX'];

export const paymentMethods: IOptions[] = array.map((x: string) => ({
  value: `${x}`,
  label: `${x}`
}));
