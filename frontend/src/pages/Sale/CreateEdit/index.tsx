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
import {
  apiRoutes,
  appRoutes,
  categorIdsArrayCost,
  categorIdsArrayProduct,
  roules,
  userType
} from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm, SaleProduct } from '../interfaces';
import api from 'services/api-aws-amplify';
import Products from './Products';
import {
  formatPrice,
  formatValueWhithDecimalCaseOnChange,
  priceToNumber
} from 'utils/formatPrice';
import { useAppContext } from 'hooks/contextLib';
import ShowByRoule from 'components/ShowByRoule';
import { arrayCapture, arrayLevel, arrayNature } from 'pages/User/utils';
import { arrayDemand } from '../../User/utils';
import UploadImages from 'components/UploadImages';
import { getTitle, getType, setImages } from '../utils';
import { IOptions } from 'utils/commonInterfaces';
import { Visit } from 'pages/Visit/interfaces';
import { formatDate } from 'utils/formatDate';
import { Users } from 'pages/User/interfaces';
import Cards from './Cards';
import { initialState, TotalSale } from './Cards/interfaces';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import { language } from 'utils/languages';
import ContractButton from '../Contract/Button';
import { Company } from 'pages/Company/interfaces';
import { currency, displayValue } from 'utils';

const CreateEdit: React.FC = (props: any) => {
  const { companies, userAuthenticated } = useAppContext();
  const history = useHistory();
  const [path, setPath] = useState('');
  const { users, setUsers } = useAppContext();
  const [usersOptions, setUsersOptions] = useState<IOptions[]>();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [totals, setTotals] = useState<TotalSale>(initialState);

  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitsOptions, setVisitsOptions] = useState<IOptions[]>();
  const [groups, setGroups] = useState<string[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState(currency.BRL);

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    const groups = signInUserSession.accessToken.payload['cognito:groups'];
    setGroups(groups);
    if (!checkRouleProfileAccess(groups, roules.administrator)) {
      const companyId = signInUserSession.idToken.payload['custom:company_id'];
      dispatch({ companyId });
    }
    const typePath = getType();
    setPath(typePath);
    onLoadUsersSales(groups);
  }, []);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  useEffect(() => {
    if (path === appRoutes.contracts && !state.approved) {
      const balance = totals.balance ? totals.balance : 0;

      const balanceValue = formatPrice(balance / 2, currentCurrency);

      const paymentMethodText =
        language.contracts[currentCurrency].paymentMethod;

      const paymentMethod = paymentMethodText
        .replace('{balanceValue}', balanceValue)
        .replace('{balanceValue}', balanceValue);
      const distance = state.distance ? state.distance : totals?.km;
      dispatch({ paymentMethod, distance });
    }
  }, [totals.balance, currentCurrency]);

  useEffect(() => {
    // dispatch({ visitId: null });
    getVisitsByClient(state.clientId);
  }, [state.clientId]);

  useEffect(() => {
    const filtered = users?.filter(
      (u: Users) => u.companyId === state.companyId
    );
    setUsersOptions(filtered);

    const company = companies?.find((x: Company) => x.id === state.companyId);
    const currentCurrency = company ? company.currency! : currency.BRL;
    setCurrentCurrency(currentCurrency);
  }, [state.companyId]);

  const getVisitsByClient = async (clientId: number) => {
    if (clientId) {
      setLoadingVisit(true);
      const resp = await api.get(`${apiRoutes.visits}/all`, { clientId });
      setVisits(resp.data);
      const respFormated = resp.data.map((item: Visit) => ({
        value: item.id,
        label: `Dia ${formatDate(item.date)} ${formatPrice(
          item.value || 0,
          currentCurrency
        )} ${displayValue(item.address)} ${displayValue(
          item.city
        )} ${displayValue(item.state)}`
      }));

      setVisitsOptions(respFormated);
      setLoadingVisit(false);
    }
  };

  const get = async (id: string) => {
    try {
      setLoading(true);
      setLoadingEdit(true);
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      const productsList = resp.data?.productsSales as SaleProduct[];
      const productsSales = productsList.filter((p: SaleProduct) =>
        categorIdsArrayProduct.includes(p.product.categoryId || 0)
      );
      const costsSales = productsList.filter((p: SaleProduct) =>
        categorIdsArrayCost.includes(p.product.categoryId || 0)
      );
      dispatch({
        ...resp.data,
        productsSales,
        costsSales,
        discountValue: formatValueWhithDecimalCaseOnChange(
          resp.data?.discountValue
        )
      });
      if (resp.data) setFileList(setImages(resp.data));

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
      const productsSales = state.productsSales?.filter(
        (p: SaleProduct) => p.product?.name && p.value
      );

      const objOnSave = {
        ...state,
        products: JSON.stringify(
          productsSales.map((p: SaleProduct) => p.product?.name)
        ),
        productsSales,
        discountValue: state.discountDescription
          ? priceToNumber(state.discountValue)
          : null,
        path,
        fileList
      };

      if (!productsSales || !productsSales.length || !state.clientId) {
        notification.warning({
          message: 'Verifique campos obrigatórios e produtos validos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.sales, objOnSave);

      setLoading(false);

      if (result.success) history.push(`/${path}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const setProducts = (productsSales: SaleProduct[]) => {
    dispatch({ productsSales });
  };

  const setCosts = (costsSales: SaleProduct[]) => {
    dispatch({ costsSales });
  };

  const onLoadUsersSales = async (groups: any) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/all`);
      setUsers(resp.data);
      setLoading(false);
      if (!checkRouleProfileAccess(groups, roules.administrator)) {
        setUsersOptions(resp.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${
        type === 'update'
          ? 'Editar'
          : path === appRoutes.sales
          ? 'Nova'
          : 'Novo'
      } ${getTitle(path).toLocaleLowerCase()}`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={loadingEdit}
      extra={
        type === 'update' &&
        state.hash && (
          <span style={{ marginLeft: '10px' }}>
            <ContractButton id={state.id!} />
          </span>
        )
      }
    >
      <Cards
        sale={state}
        visits={visits}
        totals={totals}
        setTotals={setTotals}
        currency={currentCurrency}
      />

      <ShowByRoule roule={roules.administrator}>
        <Col lg={3} md={6} sm={12} xs={24}>
          <Select
            label={'Empresa'}
            options={companies}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <ShowByRoule roule={roules.saleUserIdChange}>
        <Col
          lg={!checkRouleProfileAccess(groups, roules.administrator) ? 6 : 4}
          md={!checkRouleProfileAccess(groups, roules.administrator) ? 12 : 9}
          sm={12}
          xs={24}
        >
          <Select
            label={'Consultor'}
            options={usersOptions?.filter((u: any) => u.type === userType.USER)}
            value={state?.userId}
            onChange={(userId) => dispatch({ userId })}
          />
        </Col>
      </ShowByRoule>
      <ShowByRoule roule={roules.clients}>
        <Col
          lg={!checkRouleProfileAccess(groups, roules.administrator) ? 6 : 5}
          md={!checkRouleProfileAccess(groups, roules.administrator) ? 12 : 9}
          sm={12}
          xs={24}
        >
          <Select
            label={'Cliente'}
            required={true}
            options={usersOptions?.filter(
              (u: any) => u.type === userType.CLIENT
            )}
            value={state?.clientId}
            onChange={(clientId) => dispatch({ clientId })}
          />
        </Col>
      </ShowByRoule>

      <Col lg={12} md={24} sm={24} xs={24}>
        <Select
          loading={loadingVisit}
          label={'Visita'}
          options={visitsOptions}
          value={state?.visitId}
          onChange={(visitId) => dispatch({ visitId })}
        />
      </Col>

      <Divider>
        Produtos d{path === appRoutes.sales ? 'a' : 'o'}{' '}
        {getTitle(path).toLocaleLowerCase()}
      </Divider>
      <Products
        products={state.productsSales}
        setProducts={setProducts}
        isCost={false}
        companyId={state.companyId}
        currency={currentCurrency}  
      />

      {path == appRoutes.sales && (
        <>
          <Divider>Relação de custos</Divider>
          <Products
            products={state.costsSales}
            setProducts={setCosts}
            isCost={true}
            companyId={state.companyId}
            currency={currentCurrency}
          />

          <Col lg={6} md={8} sm={12} xs={24}>
            <Select
              label={'Demanda'}
              options={arrayDemand}
              value={state?.demand}
              onChange={(demand) => dispatch({ demand })}
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
          <Col lg={6} md={8} sm={12} xs={24}>
            <DatePicker
              label={'Data aplicação'}
              value={state.saleDate}
              onChange={(saleDate) => dispatch({ saleDate })}
            />
          </Col>
        </>
      )}
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

      {path == appRoutes.sales && (
        <>
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
        </>
      )}

      {path == appRoutes.contracts && (
        <>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Select
              label={'Acesso'}
              options={arrayLevel}
              value={state?.access}
              onChange={(access) => dispatch({ access })}
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Select
              label={'Nível de complexidade'}
              options={arrayLevel}
              value={state?.complexityLevel}
              onChange={(complexityLevel) => dispatch({ complexityLevel })}
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <DatePicker
              label={'Data prevista para execução'}
              value={state.expectedDateForApplication}
              onChange={(expectedDateForApplication) =>
                dispatch({ expectedDateForApplication })
              }
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Input
              label={'Dias para execução'}
              type={'tel'}
              placeholder="15"
              value={state.daysExecution}
              onChange={(e) =>
                dispatch({
                  daysExecution: Number(e.target.value)
                })
              }
            />
          </Col>

          <Col lg={6} md={8} sm={12} xs={24}>
            <Input
              label={'PH do solo'}
              placeholder=""
              value={state.phSoil}
              onChange={(e) => dispatch({ phSoil: e.target.value })}
            />
          </Col>

          <Col lg={6} md={8} sm={12} xs={24}>
            <Input
              label={'Orientação do sol'}
              placeholder=""
              value={state.sunOrientation}
              onChange={(e) => dispatch({ sunOrientation: e.target.value })}
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Input
              label={'Descrição desconto'}
              placeholder=""
              value={state.discountDescription}
              onChange={(e) =>
                dispatch({ discountDescription: e.target.value })
              }
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Input
              label={'Valor de desconto'}
              type={'tel'}
              disabled={!state.discountDescription}
              placeholder="15,00"
              value={state.discountValue}
              onChange={(e) =>
                dispatch({
                  discountValue: formatValueWhithDecimalCaseOnChange(
                    e.target.value
                  )
                })
              }
            />
          </Col>
          <Col lg={24} md={24} sm={24} xs={24}>
            <Input
              label={'Forma de pagamento'}
              placeholder=""
              value={state.paymentMethod}
              onChange={(e) => dispatch({ paymentMethod: e.target.value })}
            />
          </Col>
          <Col lg={6} md={8} sm={12} xs={24}>
            <Switch
              label={'Proposta aprovada'}
              title="Sim / Não"
              checked={state.approved}
              checkedChildren="Não"
              unCheckedChildren="Sim"
              onChange={() => dispatch({ approved: !state.approved })}
            />
          </Col>
        </>
      )}
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações internas'}
          placeholder=""
          value={state.internalNote}
          onChange={(e) => dispatch({ internalNote: e.target.value })}
        />
      </Col>
      {path == appRoutes.contracts && (
        <Col lg={24} md={24} sm={24} xs={24}>
          <UploadImages
            setFileList={setFileList}
            fileList={fileList}
            maxCount={6}
          />
        </Col>
      )}
    </PanelCrud>
  );
};

export default CreateEdit;
