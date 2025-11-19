import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Col, Divider, notification, Row, UploadFile } from 'antd';
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
import { getTitle, getType } from '../utils';
import { IOptions } from 'utils/commonInterfaces';
import { Visit } from 'pages/Visit/interfaces';
import { formatDateHour } from 'utils/formatDate';
import { Users } from '@/pages/User/interfaces';

const CreateEdit: React.FC = (props: any) => {
  const { companies } = useAppContext();
  const history = useHistory();
  const [path, setPath] = useState('');
  const { users, setUsers } = useAppContext();
  const [usersOptions, setUsersOptions] = useState<IOptions[]>();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [loadingVisit, setLoadingVisit] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalInput, setTotalInput] = useState<number>(0);
  const [visitValue, setVisitValue] = useState<number>(0);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [visits, setVisits] = useState<Visit[]>();
  const [visitsOptions, setVisitsOptions] = useState<IOptions[]>();

  useEffect(() => {
    const typePath = getType();
    setPath(typePath);
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
    const value =
      visits?.find((v: Visit) => v.id === state.visitId)?.value ?? 0;
    setVisitValue(value);

    const discountValue = priceToNumber(state.discountValue) ?? 0;
    const result = total - totalInput - discountValue - value;
    setTotalBalance(result);

    const balanceValue = formatPrice(result / 2);
    const paymentMethod = `${balanceValue} Sinal de 50% para reservar a data ${balanceValue} 50% restante no final da aplicação`;
    dispatch({ paymentMethod });
  }, [total, totalInput, state.discountValue, state.visitId]);

  useEffect(() => {
    getVisitsByClient(state.clientId);
  }, [state.clientId]);

  useEffect(() => {
    const filtered = users?.filter(
      (u: Users) => u.companyId === state.companyId
    );
    setUsersOptions(filtered);
  }, [state.companyId]);

  const getVisitsByClient = async (clientId: number) => {
    if (clientId) {
      setLoadingVisit(true);
      const resp = await api.get(`${apiRoutes.visits}/all`, { clientId });
      setVisits(resp.data);
      const respFormated = resp.data.map((item: Visit) => ({
        value: item.id,
        label: `Dia ${formatDateHour(item.date)} ${formatPrice(
          item.value || 0
        )} ${item.address} ${item.city} ${item.state}`
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
      const products = productsList.filter(
        (p: SaleProduct) => !p.product.isInput
      );
      const inputs = productsList.filter((p: SaleProduct) => p.product.isInput);
      dispatch({
        ...resp.data,
        products,
        inputs,
        discountValue: formatValueWhithDecimalCaseOnChange(
          resp.data?.discountValue
        )
      });
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
        inputsSales,
        discountValue: state.discountDescription
          ? priceToNumber(state.discountValue)
          : null,
        path
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

      if (result.success && type === 'create') {
        dispatch(defaultValuesForm);
        setVisits([]);
      }
      if (result.success) history.push(`/${path}`);
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
    >
      <Divider>
        Produtos d{path === appRoutes.sales ? 'a' : 'o'}{' '}
        {getTitle(path).toLocaleLowerCase()}
      </Divider>
      <Products
        products={state.products}
        setProducts={setProducts}
        isInput={false}
      />

      <Col lg={24} md={24} sm={12} xs={24}>
        <Row
          gutter={[16, 24]}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Col lg={6} md={8} sm={12} xs={24}>
            <Divider>Total {formatPrice(total!)}</Divider>
          </Col>
          {!!visitValue && (
            <Col lg={6} md={8} sm={12} xs={24}>
              <Divider>Desconto visita {formatPrice(visitValue!)}</Divider>
            </Col>
          )}
          {state.discountDescription && (
            <Col lg={6} md={8} sm={12} xs={24}>
              <Divider>
                {state.discountDescription}{' '}
                {formatPrice(priceToNumber(state.discountValue) || 0)}
              </Divider>
            </Col>
          )}
          {!!totalInput && (
            <Col lg={6} md={8} sm={12} xs={24}>
              <Divider>Total de custos {formatPrice(totalInput!)}</Divider>
            </Col>
          )}
          <Col lg={6} md={8} sm={12} xs={24}>
            <Divider>Saldo {formatPrice(totalBalance!)}</Divider>
          </Col>
        </Row>
      </Col>
      {path == appRoutes.sales && (
        <>
          <Divider>Relação de custos</Divider>
          <Products
            products={state.inputs}
            setProducts={setInputs}
            isInput={true}
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
      <ShowByRoule roule={roules.saleUserIdChange}>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Select
            label={'Vendedor'}
            options={usersOptions?.filter((u: any) => u.type === userType.USER)}
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
            options={usersOptions?.filter(
              (u: any) => u.type === userType.CLIENT
            )}
            value={state?.clientId}
            onChange={(clientId) => dispatch({ clientId })}
          />
        </Col>
      </ShowByRoule>
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
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
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

          <Col lg={12} md={12} sm={12} xs={24}>
            <Select
              loading={loadingVisit}
              label={'Visita'}
              options={visitsOptions}
              value={state?.visitId}
              onChange={(visitId) => dispatch({ visitId })}
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
          <Col lg={24} md={24} sm={24} xs={24}>
            <Textarea
              label={'Observações internas'}
              placeholder=""
              value={state.internalNote}
              onChange={(e) => dispatch({ internalNote: e.target.value })}
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

          <Col lg={24} md={24} sm={24} xs={24}>
            <UploadImages
              setFileList={setFileList}
              fileList={fileList}
              maxCount={6}
            />
          </Col>
        </>
      )}
    </PanelCrud>
  );
};

export default CreateEdit;
function defaultValuesForm(defaultValuesForm: any) {
  throw new Error('Function not implemented.');
}
