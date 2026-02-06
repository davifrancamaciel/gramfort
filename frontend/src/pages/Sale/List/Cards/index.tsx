import React, { useEffect, useState } from 'react';
import { DollarOutlined } from '@ant-design/icons';

import { formatPrice } from 'utils/formatPrice';
import { Sale } from '../../interfaces';
import Card from 'components/Card';
import { appRoutes, systemColors } from 'utils/defaultValues';
import { Header, Container } from 'components/Card/styles';
import { getBalanceValue, getCostValue, getType } from '../../utils';
import { useAppContext } from 'hooks/contextLib';

export interface PropTypes {
  sales: Sale[];
  loading: boolean;
}
interface Totals {
  total: number;
  cost: number;
  discount: number;
  balance: number;
}

const initialState: Totals = {
  total: 0,
  cost: 0,
  discount: 0,
  balance: 0
};

const Cards: React.FC<PropTypes> = ({ sales, loading }) => {
  const [total, setTotal] = useState<Totals>(initialState);
  const path = getType();

  const { companySelected } = useAppContext();

  useEffect(() => {
    const _total = sales.reduce(
      (acc: number, p: Sale) => acc + Number(p.value),
      0
    );
    const cost = sales.reduce(
      (acc: number, s: Sale) => acc + Number(s.valueInput),
      0
    );
    const discount = sales.reduce(
      (acc: number, s: Sale) => acc + getCostValue(s, false),
      0
    );
    const balance = sales.reduce(
      (acc: number, s: Sale) =>
        acc + getBalanceValue(s, path === appRoutes.sales),
      0
    );

    setTotal({ ...total, total: _total, balance, cost, discount });
  }, [sales]);

  return (
    <Container>
      <Header>
        <Card
          loading={loading}
          value={formatPrice(total.total, companySelected?.currency)}
          color={systemColors.GREEN}
          text={`TOTAL`}
          icon={<DollarOutlined />}
        />

        {path === appRoutes.sales && (
          <Card
            loading={loading}
            value={`-${formatPrice(total.cost, companySelected?.currency)}`}
            color={systemColors.LIGHT_PINK}
            text={`CUSTOS`}
            icon={<DollarOutlined />}
          />
        )}
        <Card
          loading={loading}
          value={`-${formatPrice(total.discount, companySelected?.currency)}`}
          color={systemColors.BLUE}
          text={`DESCONTOS`}
          icon={<DollarOutlined />}
        />

        <Card
          loading={loading}
          value={formatPrice(total.balance, companySelected?.currency)}
          color={systemColors.GREEN}
          text={`SALDO`}
          icon={<DollarOutlined />}
        />
      </Header>
    </Container>
  );
};

export default Cards;
