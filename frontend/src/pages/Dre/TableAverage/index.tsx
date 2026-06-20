import React, { useEffect, useState } from 'react';

import {
  DreGrigResult,
  typeDataDreEnum,
  typeDataDreTextEnum
} from '../interfaces';
import { PropTypes } from './interfaces';
import { Container } from './styles';
import { formatTableValue } from '../utils';

const TableAverage: React.FC<PropTypes> = (props) => {
  const [itemsAverage, setItemsAverage] = useState<any>();

  useEffect(() => {
    setItemsAverage(calculateAverageValues(props.items));
  }, [props.items]);

  const calculateAverageValues = (array: Array<DreGrigResult>) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    const divider = props.year === year ? month + 1 : 12;
    const averageValues = array
      .filter(
        (item: DreGrigResult) =>
          item.name !== typeDataDreEnum.BLANK &&
          item.name !== typeDataDreEnum.PERCENT &&
          item.name !== typeDataDreEnum.SALDO &&
          item.name !== typeDataDreEnum.EBITDA &&
          item.name !== typeDataDreEnum.MARGEM_BRUTA
      )
      .map((item: DreGrigResult) => {
        const value = (Math.abs(Number(item.acc)) / divider).toFixed(2);
        return [item.name, formatTableValue(item.type, value.toString())];
      });

    const obj = Object.fromEntries(averageValues);
    return obj;
  };

  return (
    <Container>
      <table>
        <tbody>
          <tr>
            <td style={{ color: '#FFF', background: '#000' }}>MEDIA ANUAL</td>
          </tr>
          <tr>
            <td className="description">
              {typeDataDreTextEnum.FATURAMENTO_BRUTO}
            </td>
            <td>{itemsAverage?.FATURAMENTO_BRUTO}</td>
            <td className="description">{typeDataDreTextEnum.M2}</td>
            <td>{itemsAverage?.M2}</td>
            <td className="description">{typeDataDreTextEnum.INVESTIMENTOS}</td>
            <td>{itemsAverage?.INVESTIMENTOS}</td>
          </tr>
          <tr>
            <td className="description">{typeDataDreTextEnum.DESPESAS}</td>
            <td>{itemsAverage?.DESPESAS}</td>
            <td className="description">{typeDataDreTextEnum.TANQUES}</td>
            <td>{itemsAverage?.TANQUES}</td>
            <td className="description">{typeDataDreTextEnum.RETIRADAS}</td>
            <td>{itemsAverage?.RETIRADAS}</td>
          </tr>
          <tr>
            <td className="description">{typeDataDreTextEnum.IMPOSTOS}</td>
            <td>{itemsAverage?.IMPOSTOS}</td>
            <td className="description">{typeDataDreTextEnum.INSUMOS}</td>
            <td>{itemsAverage?.INSUMOS}</td>
            <td className="description">{typeDataDreTextEnum.PGTO_INSUMO}</td>
            <td>{itemsAverage?.PGTO_INSUMO}</td>
          </tr>
          <tr>
            <td className="description">{typeDataDreTextEnum.LIQUIDO}</td>
            <td>{itemsAverage?.LIQUIDO}</td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
};

export default TableAverage;
