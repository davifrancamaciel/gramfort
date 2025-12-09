import React from 'react';
import { Button } from 'antd';

import ExportCSV from 'components/ExportCSV';
import { PropTypes } from '../interfaces';

const Export: React.FC<PropTypes> = ({ actionFilter, items, title }) => {
  return (
    <>
      <ExportCSV
        id="export-csv"
        data={items}
        documentTitle={`${title}-${new Date().getTime()}.csv`}
        headers={[
          { label: 'CÓDIGO', key: 'id' },
          { label: 'EMPRESA', key: 'companyName' },
          { label: 'DATA', key: 'saleDate' },
          { label: 'CLIENTE', key: 'clientName' },
          { label: 'COSULTOR', key: 'userName' },
          { label: 'VALOR', key: 'value' },
          { label: 'CUSTO', key: 'cost' },
          { label: 'SALDO', key: 'balance' },
          { label: 'CAPTAÇÃO', key: 'capture' },
          { label: 'DEMANDA', key: 'demand' },
          { label: 'CONTATO', key: 'contact' },
          { label: 'NF', key: 'invoice' },
          
          { label: 'KM', key: 'distance' },
          { label: 'ESTADO', key: 'state' },
          { label: 'CIDADE', key: 'city' },
          { label: 'ENDEREÇO', key: 'address' },
          { label: 'CADASTRO', key: 'createdAt' },
          { label: 'ALTERAÇÃO', key: 'updatedAt' },
          { label: 'OBS', key: 'note' },
          
          { label: 'DATA PREV EXECUÇÃO', key: 'expectedDateForApplication' },
          { label: 'APROVADO', key: 'approved' },
          { label: 'DESCONTO', key: 'discountDescription' },
          { label: 'VALOR DESCONTO', key: 'discountValue' },
          { label: 'FORMA DE PGTO', key: 'paymentMethod' },
          { label: 'OBS ITENTERNA', key: 'internalNote' }
        ]}
      >
        <Button id="ghost-button" style={{ display: 'none' }}></Button>
      </ExportCSV>
      <a onClick={() => actionFilter('csv')}>Exportar para CSV</a>
    </>
  );
};

export default Export;
