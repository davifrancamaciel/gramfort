import React, { useEffect, useState } from 'react';
import { DollarOutlined } from '@ant-design/icons';

import { formatPrice } from 'utils/formatPrice';
import { getCostValue, Product } from '../../interfaces';
import Card from 'components/Card';
import { systemColors } from 'utils/defaultValues';
import { Header, Container } from 'components/Card/styles';

export interface PropTypes {
  items: Product[];
  loading: boolean;
}
interface Totals {
  cost: number;
}

const initialState: Totals = {
  cost: 0
};

const Cards: React.FC<PropTypes> = ({ items, loading }) => {
  const [total, setTotal] = useState<Totals>(initialState);

  useEffect(() => {
    const cost = items.reduce(
      (acc: number, item: Product) => acc + getCostValue(item),
      0
    );

    setTotal({ ...total, cost });
  }, [items]);

  return (
    <Container>
      <Header>
        <Card
          loading={loading}
          value={formatPrice(total.cost)}
          color={systemColors.BLUE}
          text={`CUSTO DO ESTOQUE`}
          icon={<DollarOutlined />}
          width={200}
        />
      </Header>
    </Container>
  );
};

export default Cards;
