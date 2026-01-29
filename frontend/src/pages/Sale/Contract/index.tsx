import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import useFormState from 'hooks/useFormState';
import { useQuery } from 'hooks/queryString';
import PrintContainer from 'components/Report/PrintContainer';

import { initialStateForm, Sale, SaleProduct } from 'pages/Sale/interfaces';
import api from 'services/api-aws-amplify';
import {
  apiRoutes,
  appRoutes,
  categorIdsArrayProduct,
  systemColors
} from 'utils/defaultValues';

import Table from './Table';
import { Button, Card } from 'antd';
import GoBack from 'components/GoBack';
import WhatsApp from 'components/WhatsApp';
import { createMessageShare, getFileName } from '../utils';
import Copy from 'components/Copy';
import { createLinkShare } from '../utils';
import { formatPrice } from 'utils/formatPrice';
import { currency } from 'utils';

const Contract: React.FC = (props: any) => {
  const query = useQuery();
  const history = useHistory();
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
      const products = productsList.filter((p: SaleProduct) =>
        categorIdsArrayProduct.includes(p.product.categoryId || 0)
      );

      dispatch({ ...resp.data, products });

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
    const value =
      Number(sale?.value || 0) -
      Number(sale?.visit?.value || 0) -
      Number(sale?.discountValue || 0);

    const sendPhone = sale?.company?.financePhone
      ? sale?.company?.financePhone
      : sale?.company?.phone;
    const name = sale?.company?.financeName
      ? sale?.company?.financeName
      : sale?.company?.fantasyName;
    const contryCode = sale?.company?.currency === currency.PYG ? '595' : '55';

    const message = `
Olá ${name},%0A%0A
venho por meio deste contato, confirmar a contratação do *serviço de Hidrossemeadura da empresa ${
      sale?.company?.fantasyName
    }*.%0A%0A
✅ *Informações*:%0A%0A
- Contrato número: *${sale?.id}*%0A
- Cliente: *${sale?.client?.name}*%0A
- ⁠Consultor técnico: *${sale?.user?.name}*%0A
- ⁠Valor da proposta: *${formatPrice(value)}*%0A
- ⁠Forma de Pagamento: *${sale?.paymentMethod}*%0A%0A
Aguado instruções para avançarmos…`;

    window.location.href = `https://api.whatsapp.com/send?phone=${contryCode}${sendPhone}&text=${message}`;
  };

  const btnWhatapp = () => {
    return (
      <WhatsApp
        phone={sale?.client?.phone}
        text={`Enviar contrato para ${sale?.client?.name}`}
        message={createMessageShare(sale)}
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

  const btnEdit = () => {
    return (
      <Button
        key={'edit'}
        style={{ backgroundColor: systemColors.YELLOW, color: '#fff' }}
        icon={<EditOutlined />}
        onClick={() => history.push(`/${appRoutes.contracts}/edit/${sale?.id}`)}
        block
      >
        Editar
      </Button>
    );
  };

  const actions = () => {
    let array: React.ReactNode[] = [
      <PrintContainer
        show={true}
        key={'print'}
        title="Imprimir"
        filename={getFileName(sale)}
      >
        <Table sale={state} />
      </PrintContainer>
    ];
    if (!query.get('hash')) array.push(btnEdit());
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
        {!query.get('hash') && <Copy text={createLinkShare(sale)} />}
        <div style={{ marginBottom: '15px', marginTop: '15px' }}>
          <Table sale={state} />
        </div>
        {!query.get('hash') && <Copy text={createLinkShare(sale)} />}
      </div>
    </Card>
  );
};

export default Contract;
