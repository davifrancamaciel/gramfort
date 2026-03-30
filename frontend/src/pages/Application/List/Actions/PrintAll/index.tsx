import React, { useEffect, useState } from 'react';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { Application } from '../../../interfaces';

import { Footer, Summary } from './styles';
import { PropTypes } from '../interfaces';
interface ISummaryTotals {
  amount: number;
}

const Print: React.FC<PropTypes> = ({ actionFilter, items, print, title }) => {
  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    // const amount = items.reduce(
    //   (acc, r) => {
    //     acc.amount += r.amount;
    //     return acc;
    //   },
    //   { amount: 0 }
    // );
    // setTotalSummary({ amount });
  }, [items]);

  return (
    <>
      <a onClick={() => actionFilter('pdf')}>Imprimir</a>
      <PrintContainer
        show={false}
        print={print}
        filename={`Relatório de ${title}`}
      >
        <TableReport
          image={items[0]?.company?.image || ''}
          title={`Relatório de ${title}`}
          headerList={[
            'CÓDIGO',
            'EMPRESA',
            'APLICADOR',
            'DATA',
            'CLIENTE',
            'VENDA',
            'QUANTIDADE'
          ]}
        >
          {items.map((item: Application, i: number) => (
            <tr key={i}>
              <td>{item.id}</td>
              <td>{item.company?.name}</td>
              <td>{item.user?.name}</td>
              <td>{item.date}</td>
              <td>{item.client?.name}</td>
              <td>{item.saleId}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            <span>Quantidade total {items.length}</span>
          </div>
          <Summary>
            <span>Quantidade aplicada total {totalSummary.amount}</span>
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
