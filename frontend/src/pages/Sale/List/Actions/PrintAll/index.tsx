import React, { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';

import { Sale } from '../../../interfaces';

import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { Footer, Summary } from './styles';
import { PropTypes } from '../interfaces';
import Td from './Td';
interface ISummaryTotals {
  totalSales: string;
  totalSalesInput: string;
  totalCommission: string;
}

const Print: React.FC<PropTypes> = ({
  actionFilter,
  items,
  print,
  title,
  state
}) => {
  const [filteredPeriod, setFilteredPeriod] = useState('');

  const [totalSummary, setTotalSummary] = useState<ISummaryTotals>(
    {} as ISummaryTotals
  );

  useEffect(() => {
    if (state?.createdAtStart && state?.createdAtEnd) {
      const start = format(parseISO(state.createdAtStart), 'dd/MM/yyyy');
      const end = format(parseISO(state.createdAtEnd), 'dd/MM/yyyy');
      setFilteredPeriod(`período de ${start} à ${end}`);
    }
  }, [state]);

  useEffect(() => {
    const summary = items.reduce(
      (acc, r) => {
        acc.totalSales += Number(priceToNumber(r.value!.toString()));
        acc.totalSalesInput += Number(priceToNumber(r.valueInput!.toString()));
        acc.totalCommission +=
          Number(priceToNumber(r.value!.toString())) *
          (Number(r.commission) / 100);

        return acc;
      },
      { totalSales: 0, totalCommission: 0, totalSalesInput: 0 }
    );

    setTotalSummary({
      totalSales: formatPrice(summary.totalSales),
      totalSalesInput: formatPrice(summary.totalSalesInput),
      totalCommission: formatPrice(summary.totalCommission)
    });
  }, [items, state]);

  return (
    <>
      <a onClick={() => actionFilter('pdf')}>Imprimir</a>
      <PrintContainer show={false} print={print} filename={`Relatório de ${title} ${filteredPeriod}`}>
        <TableReport
          image={items[0]?.company?.image || ''}
          title={`Relatório de ${title} ${filteredPeriod}`}
        >
          {items.map((sale: Sale, i: number) => (
            <tr key={i} style={{ border: 'solid 1px #000' }}>
              <table>
                <tbody>
                  <tr>
                    <Td colSpan={1} title="Código" value={sale.id} />
                    <Td colSpan={1} title="Data" value={sale.saleDate} />
                    <Td colSpan={2} title="Consultor" value={sale.userName} />
                    <Td colSpan={2} title="Cliente" value={sale.clientName} />
                    <Td colSpan={2} title="Valor" value={sale.valueFormatted} />
                  </tr>
                  <tr>
                    <Td colSpan={8} title="Produtos" value={sale.products} />
                  </tr>
                  {sale.note && (
                    <tr>
                      <Td colSpan={8} title="Observações" value={sale.note} />
                    </tr>
                  )}
                </tbody>
              </table>
            </tr>
          ))}
        </TableReport>
        <Footer>
          <div>
            <span>Quantidade total de vendas/serviços {items.length}</span>
            <span>{filteredPeriod}</span>
          </div>
          <Summary>
            <span>
              Valor total de vendas no periodo {totalSummary.totalSales}
            </span>
            <span>
              Valor total de insumos no periodo {totalSummary.totalSalesInput}
            </span>
          </Summary>
        </Footer>
      </PrintContainer>
    </>
  );
};

export default Print;
