import React, { useEffect, useState } from 'react';

import { useAppContext } from 'hooks/contextLib';
import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { apiRoutes } from 'utils/defaultValues';
import { Filter, Expense } from '../../../interfaces';

import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import { Footer, Summary } from './styles';

interface PropTypes {
  state: Filter;
}

interface ISummaryTotals {
  value: string;
}

const Print: React.FC<PropTypes> = ({ state }) => {
  const { setLoading } = useAppContext();
  const [items, setItems] = useState<Expense[]>([]);

  const [print, setPrint] = useState(false);
  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    const summary = items.reduce(
      (acc, r) => {
        acc.value += Number(r.value);

        return acc;
      },
      { value: 0 }
    );
    console.log(summary);
    setTotalSummary({
      value: formatPrice(summary.value)
    });
  }, [items]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Expense[] = []
  ) => {
    try {
      setPrint(false);
      setLoading(true);
      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        pageSize: 100
      });

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Expense) => ({
        ...item,
        paidOut: item.paidOut ? 'SIM' : 'NÃO',
        valueFormatted: formatPrice(Number(item.value) || 0),
        paymentDate: formatDate(item.paymentDate || ''),
        createdAt: formatDateHour(item.createdAt || '')
      }));

      itemsArray = [...itemsArray, ...itemsFormatted];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(nextPage, itemsArray);
      } else {
        setItems(itemsArray);
        setLoading(false);
        setPrint(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <a onClick={() => actionFilter()}>Imprimir</a>
      <PrintContainer show={false} print={print}>
        <TableReport
          image={items[0]?.company?.image || ''}
          title="Relatório de despesas"
          headerList={[
            'CÓDIGO',
            'EMPRESA',
            'TIPO',
            'TITULO',
            'PAGO',
            'VALOR',
            'VENCIMENTO'
          ]}
        >
          {items.map((item: Expense, i: number) => (
            <tr key={i}>
              <td>{item.id}</td>
              <td>{item.company?.name}</td>
              <td>{item.expenseType?.name}</td>
              <td>{item.title}</td>
              <td>{item.paidOut}</td>
              <td>{item.valueFormatted}</td>
              <td>{item.paymentDate}</td>
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            <span>Quantidade total {items.length}</span>
          </div>
          <Summary>
            <span>Valor total {totalSummary.value}</span>
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
