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
          { label: 'APLICADOR', key: 'userName' },
          { label: 'DATA', key: 'date' },
          { label: 'CLIENTE', key: 'clientName' },
          { label: 'QUANTIDADE', key: 'amount' },
          { label: 'TIPO', key: 'type' },
          { label: 'CONTRATO', key: 'proposal' },
          { label: 'VENDA', key: 'saleId' },
          { label: 'CADASTRO', key: 'createdAt' },
          { label: 'ALTERAÇÃO', key: 'updatedAt' },
          { label: 'OBS', key: 'note' }
        ]}
      >
        <Button id="ghost-button" style={{ display: 'none' }}></Button>
      </ExportCSV>
      <a onClick={() => actionFilter('csv')}>Exportar para CSV</a>
    </>
  );
};

export default Export;
