import React, { useEffect } from 'react';
import { DollarOutlined } from '@ant-design/icons';

import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { Sale, SaleProduct } from '../../interfaces';
import Card from 'components/Card';
import { appRoutes, systemColors } from 'utils/defaultValues';
import { Visit } from 'pages/Visit/interfaces';
import { TotalSale } from './interfaces';
import { Header, Container } from 'components/Card/styles';
import { getType } from '../../utils';

export interface PropTypes {
  sale: Sale;
  visits: Visit[];
  totals: TotalSale;
  currency: string;
  setTotals: (totals: TotalSale) => void;
}

const Cards: React.FC<PropTypes> = ({
  sale,
  visits,
  totals,
  setTotals,
  currency
}) => {
  const typePath = getType();
  useEffect(() => {
    const visitSelected = visits?.find((v: Visit) => v.id === sale.visitId);
    const discountValue = sale.discountValue ?? 0;

    const total = sum(sale.productsSales);
    const cost = typePath === appRoutes.contracts ? 0 : sum(sale.costsSales);
    const visit = visitSelected?.value ?? 0;
    const discount = priceToNumber(`${discountValue}`);
    const balance = total - cost - discount - visit;

    const obj = {
      total,
      cost,
      visit,
      discount,
      balance,
      km: visitSelected?.km
    };
    setTotals(obj);
  }, [
    sale.productsSales,
    sale.costsSales,
    sale.discountValue,
    sale.visitId,
    visits
  ]);

  const sum = (items: SaleProduct[]) => {
    const value = items
      .filter((p: SaleProduct) => p.valueAmount)
      .reduce((acc: number, p: SaleProduct) => acc + Number(p.valueAmount), 0);
    return value ? value : 0;
  };

  return (
    <Container>
      <Header>
        <Card
          loading={false}
          value={formatPrice(totals.total || 0, currency)}
          color={systemColors.GREEN}
          text={`Total`}
          icon={<DollarOutlined />}
        />

        {!!totals.visit && (
          <Card
            loading={false}
            value={`-${formatPrice(totals.visit || 0, currency)}`}
            color={systemColors.BLUE}
            text={`Desconto visita`}
            icon={<DollarOutlined />}
          />
        )}
        {sale.discountDescription && (
          <Card
            loading={false}
            value={`-${formatPrice(totals.discount || 0, currency)}`}
            color={systemColors.BLUE}
            text={sale.discountDescription}
            icon={<DollarOutlined />}
          />
        )}
        {!!totals.cost && appRoutes.contracts && (
          <Card
            loading={false}
            value={`-${formatPrice(totals.cost || 0, currency)}`}
            color={systemColors.BLUE}
            text={`Total de custos`}
            icon={<DollarOutlined />}
          />
        )}

        <Card
          loading={false}
          value={formatPrice(totals.balance || 0, currency)}
          color={systemColors.GREEN}
          text={`Saldo`}
          icon={<DollarOutlined />}
        />
      </Header>
    </Container>
  );
};

export default Cards;
