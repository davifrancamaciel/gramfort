import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';
import { Sale } from '../../interfaces';
import Table from '../../Contract/Table';
interface PropTypes {
  sale: Sale;
}

const Print: React.FC<PropTypes> = ({ sale }) => {
  return (
    <PrintContainer show={true}>
      <Table sale={sale} />
    </PrintContainer>
  );
};

export default Print;
