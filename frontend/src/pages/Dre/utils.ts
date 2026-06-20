import { systemColors } from 'utils/defaultValues';
import {
  DreTotals,
  LineStyle,
  typeDataDreEnum,
  typeItemEnum
} from './interfaces';
import { formatPrice } from 'utils/formatPrice';

export const getStyle = (name: string): LineStyle => {
  switch (name) {
    case typeDataDreEnum.FATURAMENTO_BRUTO:
    case typeDataDreEnum.SALDO:
      return { backGround: systemColors.BLUE, color: '#fff' };
    case typeDataDreEnum.MARGEM_BRUTA:
    case typeDataDreEnum.EBITDA:
    case typeDataDreEnum.LIQUIDO:
      return { backGround: systemColors.GREEN, color: '#fff' };
    case typeDataDreEnum.INSUMOS:
    case typeDataDreEnum.DESPESAS:
    case typeDataDreEnum.IMPOSTOS:
    case typeDataDreEnum.INVESTIMENTOS:
    case typeDataDreEnum.RETIRADAS:
    case typeDataDreEnum.PGTO_INSUMO:
      return { backGround: systemColors.LIGHT_PINK, color: '#000' };
    case typeDataDreEnum.BLANK:
      return { backGround: '#fff', color: '#fff' };
    case typeDataDreEnum.PERCENT:
      return { backGround: '#e2e0e0', color: '#000' };
    default:
      return { backGround: '#f2f1f1', color: '#000' };
  }
};

export const sum = (items: DreTotals[]) => {
  const value = items
    .filter((p: DreTotals) => p.total)
    .reduce((acc: number, p: DreTotals) => acc + Number(p.total), 0);
  return value ? value : 0;
};

const filterValue = (items: Array<DreTotals>, month: number) => {
  const item = items.filter((x: DreTotals) => x.month === month);
  return item ? sum(item) : 0;
};

export const formatValue = (arrayGroup: Array<DreTotals>, month: number) => {
  const value = filterValue(arrayGroup, month);
  if (!value) return '';
  return `${value}`;
};

export const formatTableValue = (type: string, value: string | undefined) => {
  if (!value) return '';
  switch (type) {
    case typeItemEnum.PRICE:
      return formatPrice(Number(value));
    case typeItemEnum.PERCENT:
      return `${value}%`;
    default:
      return value;
  }
};
