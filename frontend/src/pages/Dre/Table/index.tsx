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
import TableAverage from '../TableAverage';
import { formatTableValue } from '../utils';

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

  return (
    <Container>
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
              <td>{formatTableValue(item.type, item.acc)}</td>
              <td colSpan={item.type !== typeItemEnum.TEXT ? 1 : 12}>
                {formatTableValue(item.type, item.month1)}
              </td>

              {item.type !== typeItemEnum.TEXT && (
                <>
                  <td>{formatTableValue(item.type, item.month2)}</td>
                  <td>{formatTableValue(item.type, item.month3)}</td>
                  <td>{formatTableValue(item.type, item.month4)}</td>
                  <td>{formatTableValue(item.type, item.month5)}</td>
                  <td>{formatTableValue(item.type, item.month6)}</td>
                  <td>{formatTableValue(item.type, item.month7)}</td>
                  <td>{formatTableValue(item.type, item.month8)}</td>
                  <td>{formatTableValue(item.type, item.month9)}</td>
                  <td>{formatTableValue(item.type, item.month10)}</td>
                  <td>{formatTableValue(item.type, item.month11)}</td>
                  <td>{formatTableValue(item.type, item.month12)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <TableAverage items={props.items} year={props.year} />
    </Container>
  );
};

export default Table;
