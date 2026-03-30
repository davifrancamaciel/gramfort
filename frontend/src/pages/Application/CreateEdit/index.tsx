import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Divider, notification, UploadFile } from 'antd';
import { DatePicker, Input, Select } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import ShowByRoule from 'components/ShowByRoule';
import {
  apiRoutes,
  productCategoriesEnum,
  roules,
  userType
} from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import { formatPrice, priceToNumber } from 'utils/formatPrice';
import { useAppContext } from 'hooks/contextLib';
import { IOptions } from 'utils/commonInterfaces';
import { Users } from 'pages/User/interfaces';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import { Editor } from 'primereact/editor';
import { arrayTypeApplication } from 'utils';
import UploadImages from 'components/UploadImages';
import { setImages } from 'pages/Sale/utils';
import { Sale, SaleProduct } from 'pages/Sale/interfaces';
import { formatDate } from 'utils/formatDate';
import { useQuery } from 'hooks/queryString';

const CreateEdit: React.FC = (props: any) => {
  const { companies, userAuthenticated } = useAppContext();
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesOptions, setSalesOptions] = useState<IOptions[]>();
  const [usersOptions, setUsersOptions] = useState<IOptions[]>();
  const [productsOptions, setProductsOptions] = useState<any[]>();
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const query = useQuery();

  useEffect(() => {
    !props.match.params.id && onLoadUser();
  }, []);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  useEffect(() => {
    const filtered = users?.filter(
      (u: Users) => u.companyId === state.companyId
    );
    setUsersOptions(filtered);
  }, [state.companyId]);

  useEffect(() => {
    getSalesByClientId(state.clientId);
  }, [state.clientId]);

  useEffect(() => {
    const sale = sales.find((x: Sale) => x.id === state.saleId);
    const options = sale?.productsSales
      .filter(
        (x: SaleProduct) =>
          x.product.categoryId === productCategoriesEnum.CUSTO &&
          x.product.name.toLocaleLowerCase().includes('tanq')
      )
      .map((x: SaleProduct) => ({
        value: x.productId,
        label: `${x.product.name} total ${Number(x.amount).toFixed(0)}`
      }));
    setProductsOptions(options);
    console.log(options);
  }, [state.saleId, sales]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      await onLoadUser();
      const resp = await api.get(`${apiRoutes.applications}/${id}`);
      dispatch({
        ...resp.data
      });

      if (resp.data) setFileList(setImages(resp.data));

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getSalesByClientId = async (clientId: number) => {
    try {
      if (clientId) {
        setLoadingSales(true);
        const params = {
          companyId: state.companyId,
          clientId,
          path: apiRoutes.sales,
          pageNumber: 1,
          pageSize: 100
        };
        const resp = await api.get(apiRoutes.sales, params);
        const { rows } = resp.data;

        const itemsFormatted = rows.map((item: Sale) => ({
          ...item,
          value: item.id,
          label: `Cód ${item.id} data ${formatDate(
            item.saleDate
          )} ${formatPrice(item.value || 0, item.company?.currency)}`
        }));
        setSales(itemsFormatted);
        setSalesOptions(itemsFormatted.map((x: any) => ({ ...x } as IOptions)));

        setLoadingSales(false);
      }
    } catch (error) {
      setLoadingSales(false);
    }
  };

  const action = async () => {
    try {
      if (!state.amount || !state.clientId || !state.date) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }

      const sale = sales.find((x: Sale) => x.id === state.saleId);
      const product = sale?.productsSales.find(
        (x: SaleProduct) => x.productId === Number(state.productId)
      );
      if (Number(state.amount) > Number(product?.amount!)) {
        notification.warning({
          message:
            'A quantidade informada não pode ser maior que a quantidade registrada na venda'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.applications, {
        ...state,
        fileList,
        productId: Number(state.productId)
      });

      setLoading(false);

      result.success && history.goBack();
    } catch (error) {
      setLoading(false);
    }
  };

  const onLoadUser = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/all`);

      setUsers(resp.data);
      const { signInUserSession } = userAuthenticated;
      const groups = signInUserSession.accessToken.payload['cognito:groups'];
      if (!checkRouleProfileAccess(groups, roules.administrator)) {
        const companyId =
          signInUserSession.idToken.payload['custom:company_id'];
        dispatch({ companyId });
      }

      if (query.get('companyId')) {
        dispatch({
          companyId: query.get('companyId'),
          clientId: Number(query.get('clientId')),
          saleId: Number(query.get('saleId'))
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} aplicação`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={8} md={8} sm={24} xs={24}>
          <Select
            label={'Empresa'}
            options={companies}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <ShowByRoule roule={roules.saleUserIdChange}>
        <Col lg={8} md={8} sm={24} xs={24}>
          <Select
            label={'Aplicador'}
            options={usersOptions?.filter((u: any) => u.type === userType.USER)}
            value={state.userId}
            onChange={(userId) => dispatch({ userId })}
          />
        </Col>
      </ShowByRoule>
      <Col lg={8} md={8} sm={24} xs={24}>
        <Select
          required={true}
          label={'Cliente'}
          options={usersOptions?.filter((u: any) => u.type === userType.CLIENT)}
          value={state.clientId}
          onChange={(clientId) => dispatch({ clientId })}
        />
      </Col>

      <Col lg={8} md={8} sm={24} xs={24}>
        <Select
          required={true}
          loading={loadingSales}
          label={'Venda'}
          options={salesOptions}
          value={state.saleId}
          onChange={(saleId) => dispatch({ saleId })}
        />
      </Col>
      <Col lg={8} md={8} sm={24} xs={24}>
        <Select
          required={true}
          loading={loadingSales}
          label={'Tanque'}
          options={productsOptions}
          value={state.productId}
          onChange={(productId) => dispatch({ productId })}
        />
      </Col>
      <Col lg={4} md={8} sm={12} xs={12}>
        <Input
          label={'Quantidade'}
          type={'tel'}
          placeholder="15"
          required={true}
          value={state.amount}
          onChange={(e) =>
            dispatch({
              amount: priceToNumber(e.target.value)
            })
          }
        />
      </Col>
      <Col lg={4} md={8} sm={12} xs={12}>
        <Select
          required={true}
          label={'Tipo'}
          options={arrayTypeApplication}
          value={state.type}
          onChange={(type) => dispatch({ type })}
        />
      </Col>
      <Col lg={4} md={8} sm={12} xs={12}>
        <DatePicker
          label={'Data'}
          value={state.date}
          required={true}
          onChange={(date) => dispatch({ date })}
        />
      </Col>
      <Col lg={24}>
        <Divider>Observações</Divider>
        <Editor
          value={state.note}
          onTextChange={(e: any) => dispatch({ note: e.htmlValue })}
          style={{ minHeight: '100px' }}
        />
      </Col>

      <Col lg={24} md={24} sm={24} xs={24}>
        <UploadImages
          setFileList={setFileList}
          fileList={fileList}
          maxCount={4}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
