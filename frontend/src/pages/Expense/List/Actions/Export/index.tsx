import React, { useState } from 'react';

import ExportCSV from 'components/ExportCSV';

import { formatDate, formatDateHour } from 'utils/formatDate';
import api from 'services/api-aws-amplify';
import { Filter, Expense } from '../../../interfaces';

import { Button } from 'antd';
import { apiRoutes } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';
import { useAppContext } from 'hooks/contextLib';

interface PropTypes {
  state: Filter;
}
const Export: React.FC<PropTypes> = ({ state }) => {
  const { setLoading } = useAppContext();
  const [formattedData, setFormattedData] = useState<Array<any>>([]);

  const actionFilter = async (
    pageNumber: number = 1,
    itemsArray: Expense[] = []
  ) => {
    try {
      setLoading(true);

      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        pageSize: 500
      });

      const { count, rows } = resp.data;

      itemsArray = [...itemsArray, ...rows];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(nextPage, itemsArray);
      } else {
        const newData = itemsArray.map((item: Expense) => ({
          ...item,
          companyName: item.company?.name,
          typeName: item.expenseType?.name,
          paidOut: item.paidOut ? 'SIM' : 'NÃO',
          valueFormatted: formatPrice(Number(item.value) || 0),
          paymentDate: formatDate(item.paymentDate || ''),
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt)
        }));
        setFormattedData(newData);
        setLoading(false);
        const btn = document.getElementById('ghost-button');
        if (btn) {
          btn.click();
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <ExportCSV
        id="export-csv"
        data={formattedData}
        documentTitle={`report-expenses-${new Date().getTime()}.csv`}
        headers={[
          { label: 'CÓDIGO', key: 'id' },
          { label: 'EMPRESA', key: 'companyName' },
          { label: 'TIPO', key: 'typeName' },
          { label: 'TITULO', key: 'title' },
          { label: 'PAGO', key: 'paidOut' },
          { label: 'VALOR', key: 'value' },
          { label: 'VENCIMENTO', key: 'paymentDate' },
          { label: 'Data de cadastro', key: 'createdAt' },
          { label: 'Data de alteração', key: 'updatedAt' },
          { label: 'Descrição', key: 'description' }
        ]}
      >
        <Button id="ghost-button" style={{ display: 'none' }}></Button>
      </ExportCSV>
      <a onClick={() => actionFilter()}>Exportar para CSV</a>
    </>
  );
};

export default Export;
