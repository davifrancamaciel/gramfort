import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, Divider, notification, UploadFile } from 'antd';
import {
  DatePicker,
  Input,
  Select,
  Switch,
  Textarea
} from 'components/_inputs';
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
import { arrayDemand } from '../../User/utils';
import UploadImages from 'components/UploadImages';

const CreateEdit: React.FC = (props: any) => {
  const { companies } = useAppContext();
  const history = useHistory();
  const { users, setUsers } = useAppContext();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalInput, setTotalInput] = useState<number>(0);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

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
    setTotal(totalSale);
  }, [state.products]);

  useEffect(() => {
    const totalInput = state.inputs
      .filter((p: SaleProduct) => p.value)
      .reduce((acc: number, p: SaleProduct) => acc + Number(p.valueAmount), 0);
    setTotalInput(totalInput);
  }, [state.inputs]);

  useEffect(() => {
    setTotalBalance(total - totalInput);
  }, [total, totalInput]);

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
      <Divider>Produtos da venda</Divider>
      <Products
        products={state.products}
        setProducts={setProducts}
        isInput={false}
      />
      <Divider>Total {formatPrice(total!)}</Divider>
      <Divider>Relação de custos</Divider>
      <Products
        products={state.inputs}
        setProducts={setInputs}
        isInput={true}
      />
      <Divider>
        Total de custos {formatPrice(totalInput!)} Saldo{' '}
        {formatPrice(totalBalance!)}
      </Divider>

      <Col lg={6} md={8} sm={12} xs={24}>
        <DatePicker
          label={'Data aplicação'}
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
        <Select
          label={'Demanda'}
          options={arrayDemand}
          value={state?.demand}
          onChange={(demand) => dispatch({ demand })}
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
            options={companies}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <Col lg={6} md={8} sm={12} xs={24}>
        <Switch
          label={'NF'}
          title="Sim / Não"
          checked={state.invoice}
          checkedChildren="Não"
          unCheckedChildren="Sim"
          onChange={() => dispatch({ invoice: !state.invoice })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <UploadImages setFileList={setFileList} fileList={fileList} maxCount={6} />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
