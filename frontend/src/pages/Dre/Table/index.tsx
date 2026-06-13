import React from 'react';

import { Container } from './styles';
import {
  DreGrigResult,
  DreTableProps,
  typeDataDreTextEnum,
  typeItemEnum
} from '../interfaces';
import { arrayMonth } from 'pages/User/utils';
import { IOptions } from 'utils/commonInterfaces';
import { formatPrice } from 'utils/formatPrice';

const Table: React.FC<DreTableProps> = (props) => {
  const getColls = (title: string) => {
    let arrayCols = [];
    arrayCols.push({ title: title, dataIndex: `name` });
    arrayCols.push({ title: 'ACUMULADO', dataIndex: `acc` });

    arrayMonth.map((item: IOptions) =>
      arrayCols.push({ title: item.label, dataIndex: `month${item.value}` })
    );

    return arrayCols;
  };

  const getNameTypeData = (name: string) => {
    const type = typeDataDreTextEnum[name];
    return type ? type : name;
  };

  const formatValue = (type: string, value: string | undefined) => {
  
    if (!value) return '';
    if (type === typeItemEnum.PRICE && value) return formatPrice(Number(value));
    return value;
  };

  return (
    <Container>
      <h2>EXERCICIO {props.year}</h2>
      <table>
        <thead>
          <tr>
            {getColls(props.type).map((item: any) => (
              <th key={item.dataIndex}>{item.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.items.map((item: DreGrigResult, index: number) => (
            <tr
              className={item.name}
              key={index}
              style={{
                backgroundColor: item.style.backGround,
                color: item.style.color
              }}
            >
              <td>{getNameTypeData(item.name)}</td>
              <td>{formatValue(item.type, item.acc)}</td>
              <td colSpan={item.type !== typeItemEnum.TEXT ? 1 : 12}>
                {formatValue(item.type, item.month1)}
              </td>

              {item.type !== typeItemEnum.TEXT && (
                <>
                  <td>{formatValue(item.type, item.month2)}</td>
                  <td>{formatValue(item.type, item.month3)}</td>
                  <td>{formatValue(item.type, item.month4)}</td>
                  <td>{formatValue(item.type, item.month5)}</td>
                  <td>{formatValue(item.type, item.month6)}</td>
                  <td>{formatValue(item.type, item.month7)}</td>
                  <td>{formatValue(item.type, item.month8)}</td>
                  <td>{formatValue(item.type, item.month9)}</td>
                  <td>{formatValue(item.type, item.month10)}</td>
                  <td>{formatValue(item.type, item.month11)}</td>
                  <td>{formatValue(item.type, item.month12)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default Table;
