import React, { useEffect, useState } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import useFormState from 'hooks/useFormState';
import { useQuery } from 'hooks/queryString';
import PrintContainer from 'components/Report/PrintContainer';

import { initialStateForm, Sale, SaleProduct } from 'pages/Sale/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';

import Table from './Table';
import { Button, Card } from 'antd';
import GoBack from 'components/GoBack';
import WhatsApp from 'components/WhatsApp';

const Contract: React.FC = (props: any) => {
  const query = useQuery();
  const { state, dispatch } = useFormState(initialStateForm);
  const [loading, setLoading] = useState(false);
  const [sale, setSale] = useState<Sale>();

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
  }, [props.match.params.id]);

  useEffect(() => {
    setSale(state);
  }, [state]);

  const get = async (id: string) => {
    try {
      const hash = query.get('hash') || undefined;
      setLoading(true);

      const path = hash ? '/contract/' : '/';
      const method = hash ? 'getPublic' : 'get';
      const resp = await api[method](`${apiRoutes.sales}${path}${id}`, {
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

  const action = async () => {
    setLoading(true);
    const objOnSave = {
      id: props.match.params.id,
      hash: query.get('hash')
    };
    await api.putPublic(`${apiRoutes.sales}/contract`, objOnSave);

    setLoading(false);
  };

  const btnWhatapp = () => {
    return (
      <WhatsApp
        phone={sale?.client?.phone}
        text={`Enviar contrato para ${sale?.client?.name}`}
        message={`Olá, ${sale?.client?.name} segue o link da proposta para aprovação ${window.location.origin}/${appRoutes.contracts}/approve/${sale?.id}?hash=${sale?.hash}`}
      />
    );
  };

  const btnApprove = () => {
    return (
      <Button
        key={'approve'}
        style={{ backgroundColor: systemColors.GREEN, color: '#fff' }}
        icon={<CheckOutlined />}
        onClick={action}
        block
      >
        Aprovar
      </Button>
    );
  };

  const actions = () => {
    let array: React.ReactNode[] = [
      <PrintContainer show={true} key={'print'} title="Imprimir">
        <Table sale={state} />
      </PrintContainer>
    ];
    if (sale?.client?.phone && !query.get('hash')) array.push(btnWhatapp());
    if (query.get('hash') && !sale?.approved) array.push(btnApprove());

    return array;
  };

  return (
    <Card
      title={`Contrato ${props.match.params.id}`}
      extra={<GoBack />}
      loading={loading}
      actions={actions()}
    >
      <div
        style={{
          width: '100%',
          overflow: 'auto'
        }}
      >
        <Table sale={state} />
      </div>
    </Card>
  );
};

export default Contract;
