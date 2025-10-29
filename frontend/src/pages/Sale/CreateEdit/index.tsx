import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, Divider, notification } from 'antd';
import { DatePicker, Input, Select, Textarea } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes, roules, userType } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm, SaleProduct } from '../interfaces';
import api from 'services/api-aws-amplify';
import Products from './Products';
import { formatPrice } from 'utils/formatPrice';
import { useAppContext } from 'hooks/contextLib';
import ShowByRoule from 'components/ShowByRoule';
import { arrayCapture, arrayLevel, arrayNature } from 'pages/User/utils';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { users, setUsers } = useAppContext();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [total, setTotal] = useState<string>();
  const [totalInput, setTotalInput] = useState<string>();

  useEffect(() => {
    onLoadUsersSales();
  }, []);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  useEffect(() => {
    const totalSale = state.products
      .filter((p: SaleProduct) => p.value)
      .reduce((acc: number, p: SaleProduct) => acc + Number(p.valueAmount), 0);
    setTotal(formatPrice(totalSale));
  }, [state.products]);

  useEffect(() => {
    const totalSale = state.inputs
      .filter((p: SaleProduct) => p.value)
      .reduce((acc: number, p: SaleProduct) => acc + Number(p.valueAmount), 0);
    setTotalInput(formatPrice(totalSale));
  }, [state.inputs]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      setLoadingEdit(true);
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      const productsList = resp.data?.productsSales as SaleProduct[];
      const products = productsList.filter(
        (p: SaleProduct) => !p.product.isInput
      );
      const inputs = productsList.filter((p: SaleProduct) => p.product.isInput);
      dispatch({ ...resp.data, products, inputs });
      setLoading(false);
      setLoadingEdit(false);
    } catch (error) {
      setLoading(false);
      setLoadingEdit(false);
      console.error(error);
    }
  };

  const action = async () => {
    try {
      const productsSales = state.products?.filter(
        (p: SaleProduct) => p.product?.name && p.value
      );

      const inputsSales = state.inputs?.filter(
        (p: SaleProduct) => p.product?.name && p.value
      );

      const objOnSave = {
        ...state,
        products: JSON.stringify(
          productsSales.map((p: SaleProduct) => p.product?.name)
        ),
        productsSales,
        inputs: JSON.stringify(
          inputsSales.map((p: SaleProduct) => p.product?.name)
        ),
        inputsSales
      };

      if (!productsSales || !productsSales.length || !state.clientId) {
        notification.warning({
          message: 'Não existe produtos validos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.sales, objOnSave);

      setLoading(false);

      if (result.success && type === 'create')
        dispatch({
          note: '',
          products: [],
          inputs: [],
          invoiceNumber: '',
          germinationLevel: '',
          satisfaction: '',
          contact: '',
          capture: '',
          nature: '',
          saleDate: '',
          distance: null,
          clientId: ''
        });
      if (result.success && type === 'update')
        history.push(`/${appRoutes.sales}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const setProducts = (products: SaleProduct[]) => {
    dispatch({ products });
  };

  const setInputs = (inputs: SaleProduct[]) => {
    dispatch({ inputs });
  };

  const onLoadUsersSales = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/all`);

      setUsers(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} venda`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={loadingEdit}
    >
      <Divider>Total {total}</Divider>
      <Products
        products={state.products}
        setProducts={setProducts}
        isInput={false}
      />
      <Divider>Total {total}</Divider>
      <Divider>Total de insumos {totalInput}</Divider>
      <Products
        products={state.inputs}
        setProducts={setInputs}
        isInput={true}
      />
      <Divider>Total de insumos {totalInput}</Divider>

      <Col lg={6} md={8} sm={12} xs={24}>
        <DatePicker
          label={'Data da venda'}
          value={state.saleDate}
          onChange={(saleDate) => dispatch({ saleDate })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Select
          label={'Captação'}
          options={arrayCapture}
          value={state?.capture}
          onChange={(capture) => dispatch({ capture })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Input
          label={'Distância'}
          type={'number'}
          placeholder=""
          value={state.distance}
          onChange={(e) => dispatch({ distance: e.target.value })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Select
          label={'Natureza'}
          options={arrayNature}
          value={state?.nature}
          onChange={(nature) => dispatch({ nature })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Input
          label={'Contato'}
          placeholder=""
          value={state.contact}
          onChange={(e) => dispatch({ contact: e.target.value })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Input
          label={'N nota'}
          placeholder=""
          value={state.invoiceNumber}
          onChange={(e) => dispatch({ invoiceNumber: e.target.value })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Select
          label={'Germinação'}
          options={arrayLevel}
          value={state?.germinationLevel}
          onChange={(germinationLevel) => dispatch({ germinationLevel })}
        />
      </Col>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Select
          label={'Satisfação'}
          options={arrayLevel}
          value={state?.satisfaction}
          onChange={(satisfaction) => dispatch({ satisfaction })}
        />
      </Col>
      <ShowByRoule roule={roules.saleUserIdChange}>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Select
            label={'Vendedor'}
            options={users?.filter((u: any) => u.type === userType.USER)}
            value={state?.userId}
            onChange={(userId) => dispatch({ userId })}
          />
        </Col>
      </ShowByRoule>
      <ShowByRoule roule={roules.clients}>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Select
            label={'Cliente'}
            required={true}
            options={users?.filter((u: any) => u.type === userType.CLIENT)}
            value={state?.clientId}
            onChange={(clientId) => dispatch({ clientId })}
          />
        </Col>
      </ShowByRoule>
      <ShowByRoule roule={roules.administrator}>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Select
            label={'Empresa'}
            url={`${apiRoutes.companies}/all`}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
