import React from 'react';

import Cards from './Cards';

import ShowByRoule from 'components/ShowByRoule';
import { roules } from 'utils/defaultValues';
import LineGraph from './LineGraph';
import Expenses from './Expenses';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Cards />
      <ShowByRoule roule={roules.expenses}>
        <Expenses />
      </ShowByRoule>
      <ShowByRoule roule={roules.sales}>
        <LineGraph label="Produtos mais vendidos" type="products" />
      </ShowByRoule>      
    </div>
  );
};
export default Dashboard;
