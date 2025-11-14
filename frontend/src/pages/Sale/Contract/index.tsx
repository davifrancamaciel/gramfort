import React, { useEffect, useState } from 'react';
import { notification, Card } from 'antd';

import useFormState from 'hooks/useFormState';
import { useQuery } from 'hooks/queryString';

import { initialStateForm, Sale, SaleProduct } from 'pages/Sale/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';

import Table from './Table';

const Contract: React.FC = (props: any) => {
  const query = useQuery();
  const { state, dispatch } = useFormState(initialStateForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
  }, [props.match.params.id]);

  const get = async (id: string) => {
    try {
      const hash = query.get('hash') || undefined;
      if (!hash) {
        notification.warning({ message: 'Codigo não informado' });
        return;
      }
      setLoading(true);

      const resp = await api.getPublic(`${apiRoutes.sales}/contract/${id}`, {
        hash
      });
      const productsList = resp.data?.productsSales as SaleProduct[];
      const products = productsList.filter(
        (p: SaleProduct) => !p.product.isInput
      );
      const inputs = productsList.filter((p: SaleProduct) => p.product.isInput);
      dispatch({ ...resp.data, products, inputs });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const action = () => {};
  return (
    <Card
      title={`Contrato ${state.id}`}
      extra={<a href="#">More</a>}
      loading={loading}
    >
      <Table sale={state} />
    </Card>
  );
  return;
};

export default Contract;
