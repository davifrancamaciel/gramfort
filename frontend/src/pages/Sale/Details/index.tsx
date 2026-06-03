import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Divider, Col, Image, Row } from 'antd';

import useFormState from 'hooks/useFormState';
import PanelCrud from 'components/PanelCrud';
import ViewData from 'components/ViewData';

import { initialStateForm, Sale } from 'pages/Sale/interfaces';
import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, systemColors } from 'utils/defaultValues';
import { formatDate, formatDateHour } from 'utils/formatDate';
import BooleanTag from 'components/BooleanTag';
import { formatPrice } from 'utils/formatPrice';
import {
  createTextVisit,
  getBalance,
  getCostValue,
  getDiscountValue
} from '../utils';

const Details: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
  }, [props.match.params.id]);

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      setLoading(false);
      const { data } = resp;
      const item: Sale = {
        ...data,
        companyName: data.company?.name,
        userName: data.user?.name,
        clientName: data.client?.name,
        visit: data.visit
          ? createTextVisit(data.visit, data.company?.currency)
          : '',
        valueFormatted: formatPrice(
          Number(data.value) || 0,
          data.company?.currency
        ),
        valuePerMeterFormatted: formatPrice(
          Number(data.valuePerMeter) || 0,
          data.company?.currency
        ),
        valueCostFormatted: formatPrice(
          getCostValue(data, true),
          data.company?.currency
        ),
        valueTotalDiscount: formatPrice(
          getDiscountValue(data),
          data.company?.currency
        ),
        balanceFormatted: getBalance(data, true),
        saleDate: formatDate(data.saleDate),
        satisfactionSurveyDate: formatDate(data.satisfactionSurveyDate),
        expectedDateForApplication: formatDate(data.expectedDateForApplication),
        createdAt: formatDateHour(data.createdAt),
        updatedAt: formatDateHour(data.updatedAt)
        // link: (
        //   <a href={data.link} target={'_blank'}>
        //     Clique aqui
        //   </a>
        // ),
        // quantityIsMinimum: <BooleanTag value={data.quantityIsMinimum} />,
        // containsMilkAllergens: (
        //   <BooleanTag value={data.containsMilkAllergens} />
        // ),
        // containsEggAllergens: <BooleanTag value={data.containsEggAllergens} />,
        // nonAlcoholic: <BooleanTag value={data.nonAlcoholic} />,
        // activeTag: (
        //   <BooleanTag value={data.active} yes={'Ativo'} no={'Inativo'} />
        // )
      };
      dispatch(item);
      console.log(item);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = () => {
    history.push(`/${appRoutes.sales}/edit/${props.match.params.id}`);
  };

  return (
    <PanelCrud
      type="view"
      loadingBtnAction={false}
      loadingPanel={loading}
      onClickActionButton={action}
      title={`Detalhes da venda (${props.match.params.id})`}
    >
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Código" value={props.match.params.id} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Empresa" value={state?.companyName} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Consultor" value={state?.userName} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Cliente" value={state?.clientName} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Visita" value={state?.visit} />
      </Col>

      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Total" value={state?.valueFormatted} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Custos" value={state?.valueCostFormatted} />
      </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Saldo" value={state?.balanceFormatted} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Valor por M2" value={state?.valuePerMeterFormatted} />
      </Col>

      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Nível de Germinação" value={state?.germinationLevel} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Contato" value={state?.contact} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Captação" value={state?.capture} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Natureza" value={state?.nature} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Data da Venda" value={state?.saleDate} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Distância" value={state?.distance} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Demanda" value={state?.demand} />
      </Col>

      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Acesso" value={state?.access} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData
          label="Nível de Complexidade"
          value={state?.complexityLevel}
        />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Dias de Execução" value={state?.daysExecution} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData
          label="Data Esperada para Aplicação"
          value={state?.expectedDateForApplication}
        />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData
          label={state?.discountDescription}
          value={state?.valueTotalDiscount}
        />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="PH do Solo" value={state?.phSoil} />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData label="Orientação solar" value={state?.sunOrientation} />
      </Col>

      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData
          label="Responsável pela Satisfação"
          value={state?.userSatisfactionName}
        />
      </Col>
      <Col lg={8} md={12} sm={24} xs={24}>
        <ViewData
          label="Data pesquisa de Satisfação"
          value={state?.satisfactionSurveyDate}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Forma de Pagamento" value={state?.paymentMethod} />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Observações" value={state?.note} />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <ViewData label="Observações Internas" value={state?.internalNote} />
      </Col>
      <Divider />
      <Col lg={6} md={6} sm={12} xs={24}>
        <ViewData label="Cadastro" value={state.createdAt} />
      </Col>
      <Col lg={6} md={6} sm={12} xs={24}>
        <ViewData label="Ultima alteração" value={state.updatedAt} />
      </Col>
    </PanelCrud>
  );
};

export default Details;
