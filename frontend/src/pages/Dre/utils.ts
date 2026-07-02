import { systemColors } from 'utils/defaultValues';
import {
  DreGrigResult,
  DreTotals,
  LineStyle,
  typeDataDreEnum,
  typeItemEnum
} from './interfaces';
import { formatPrice } from 'utils/formatPrice';
import { getPercent, groupBy } from 'utils';

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
    case typeDataDreEnum.MARKETING:
      return { backGround: systemColors.LIGHT_PINK, color: '#000' };
    case typeDataDreEnum.BLANK:
      return { backGround: '#fff', color: '#fff' };
    case typeDataDreEnum.PERCENT:
      return { backGround: '#e2e0e0', color: '#000' };
    case typeDataDreEnum.FUNIL:
    case typeDataDreEnum.INDICADORES:
    case typeDataDreEnum.INDICADORES_OP:
    case typeDataDreEnum.DESPESAS_OP:
    case typeDataDreEnum.PGTO_ADICIONAIS:
      return { backGround: systemColors.DARK_BLUE, color: '#fff' };
    default:
      return { backGround: '#f2f1f1', color: '#000' };
  }
};

export const sum = (items: DreTotals[]) => {
  const value = items
    .filter((p: DreTotals) => p.total)
    .reduce((acc: number, p: DreTotals) => acc + Number(p.total), 0);
  return value ? Number(value.toFixed(2)) : 0;
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

export const mapData = (
  data: Array<any>,
  type: string
): Array<DreGrigResult> => {
  let arrayItems: Array<DreGrigResult> = [];

  const items: Array<DreTotals> = groupBy(data, 'name');
  items.map((array: any) => arrayItems.push(createObjGrid(array, type)));
  return arrayItems;
};

const createObjGrid = (
  arrayGroup: Array<DreTotals>,
  type: string
): DreGrigResult => {
  const item: DreGrigResult = {
    type: type,
    name: arrayGroup[0].name,
    style: getStyle(arrayGroup[0].name),
    acc: `${sum(arrayGroup)}`,
    month1: formatValue(arrayGroup, 1),
    month2: formatValue(arrayGroup, 2),
    month3: formatValue(arrayGroup, 3),
    month4: formatValue(arrayGroup, 4),
    month5: formatValue(arrayGroup, 5),
    month6: formatValue(arrayGroup, 6),
    month7: formatValue(arrayGroup, 7),
    month8: formatValue(arrayGroup, 8),
    month9: formatValue(arrayGroup, 9),
    month10: formatValue(arrayGroup, 10),
    month11: formatValue(arrayGroup, 11),
    month12: formatValue(arrayGroup, 12)
  };
  return item;
};

export const getPercentLine = (
  array1: DreGrigResult[],
  array2: DreGrigResult[],
  name: string = typeDataDreEnum.PERCENT
): Array<DreGrigResult> => {
  if (!array1.length || !array2.length) return [];

  const [first] = array1;
  const [second] = array2;
  let acc: Array<DreTotals> = [];
  const getPercentFormatted = (value1?: string, value2?: string) => {
    const value = getPercent(Number(value1), Number(value2));
    if (value) {
      acc.push({ total: Math.abs(Number(value)) } as DreTotals);
      return `${Math.abs(Number(value))}`;
    }
    return '';
  };

  let item = {
    name: name,
    month1: getPercentFormatted(first.month1, second.month1),
    month2: getPercentFormatted(first.month2, second.month2),
    month3: getPercentFormatted(first.month3, second.month3),
    month4: getPercentFormatted(first.month4, second.month4),
    month5: getPercentFormatted(first.month5, second.month5),
    month6: getPercentFormatted(first.month6, second.month6),
    month7: getPercentFormatted(first.month7, second.month7),
    month8: getPercentFormatted(first.month8, second.month8),
    month9: getPercentFormatted(first.month9, second.month9),
    month10: getPercentFormatted(first.month10, second.month10),
    month11: getPercentFormatted(first.month11, second.month11),
    month12: getPercentFormatted(first.month12, second.month12),
    type: typeItemEnum.PERCENT,
    style: getStyle(typeDataDreEnum.PERCENT)
  } as DreGrigResult;

  const value = sum(acc) / acc.length;
  item.acc = `${parseFloat(value.toString()).toFixed(2)}`;

  const percent: Array<DreGrigResult> = [item];
  return percent;
};

export const parseNegative = (
  array: Array<DreTotals>,
  name: string
): Array<DreTotals> => {
  const data: Array<DreTotals> = array.map((item: DreTotals) => ({
    ...item,
    total: Number(item.total) * -1,
    name
  }));
  return data;
};
