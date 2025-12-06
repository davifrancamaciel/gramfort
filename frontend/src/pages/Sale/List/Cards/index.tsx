import React, { useEffect, useState } from 'react';
import { DollarOutlined } from '@ant-design/icons';

import { formatPrice } from 'utils/formatPrice';
import { Sale } from '../../interfaces';
import Card from 'components/Card';
import { appRoutes, systemColors } from 'utils/defaultValues';
import { Header, Container } from 'components/Card/styles';
import { getBalanceValue, getCostValue, getType } from '../../utils';

export interface PropTypes {
  sales: Sale[];
  loading: boolean;
}
interface Totals {
  total: number;
  cost: number;
  balance: number;
}

const initialState: Totals = {
  total: 0,
  cost: 0,
  balance: 0
};

const Cards: React.FC<PropTypes> = ({ sales, loading }) => {
  const [total, setTotal] = useState<Totals>(initialState);
  const path = getType();
  useEffect(() => {
   ;
    const _total = sales.reduce(
      (acc: number, p: Sale) => acc + Number(p.value),
      0
    );
    const cost = sales.reduce(
      (acc: number, s: Sale) => acc + getCostValue(s, path === appRoutes.sales),
      0
    );
    const balance = sales.reduce(
      (acc: number, s: Sale) =>
        acc + getBalanceValue(s, path === appRoutes.sales),
      0
    );

    setTotal({ ...total, total: _total, balance, cost });
  }, [sales]);

  return (
    <Container>
      <Header>
        <Card
          loading={loading}
          value={formatPrice(total.total)}
          color={systemColors.GREEN}
          text={`TOTAL`}
          icon={<DollarOutlined />}
        />

        <Card
          loading={loading}
          value={`-${formatPrice(total.cost)}`}
          color={systemColors.BLUE}
          text={`CUSTOS/DESC`}
          icon={<DollarOutlined />}
        />

        <Card
          loading={loading}
          value={formatPrice(total.balance)}
          color={systemColors.GREEN}
          text={`SALDO`}
          icon={<DollarOutlined />}
        />
      </Header>
    </Container>
  );
};

export default Cards;
