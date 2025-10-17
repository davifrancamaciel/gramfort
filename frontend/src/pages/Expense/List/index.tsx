import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Col, Card as CardAnt } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  booleanFilter,
  systemColors
} from 'utils/defaultValues';
import { initialStateFilter, Expense, ExpenseTotal } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import Action from 'components/Action';
import { getTitle, getType } from '../utils';
import Card from './Card';
import { Header } from './Card/styles';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTotal, setDataTotal] = useState<ExpenseTotal[]>();
  const [path, setPath] = useState(apiRoutes.expenses);

  useEffect(() => {
    const date = new Date();
    const paymentDateStart = startOfMonth(date).toISOString();
    const paymentDateEnd = endOfMonth(date).toISOString();
    actionFilter(1, paymentDateStart, paymentDateEnd);
    setPath(getType());
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    paymentDateStart = state.paymentDateStart,
    paymentDateEnd = state.paymentDateEnd
  ) => {
    try {
      dispatch({ pageNumber, paymentDateStart, paymentDateEnd });
      const type = getType();
      let expenseTypeId: string = '';
      if (type == appRoutes.shopping) {
        expenseTypeId = '1';
      }
      setLoading(true);
      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        expenseTypeId,
        paymentDateStart,
        paymentDateEnd
      });
      setLoading(false);

      const { count, rows, data } = resp.data;
      const itemsFormatted = rows.map((e: Expense) => {
        const expense = {
          ...e,
          nameInfoDel: `${getTitle(path)} ${e.title} do tipo ${
            e.expenseType?.name
          }`,
          expenseTypeName: e.expenseType?.name,
          value: formatPrice(Number(e.value) || 0),
          paymentDate: formatDate(e.paymentDate),
          createdAt: formatDateHour(e.createdAt),
          updatedAt: formatDateHour(e.updatedAt),
          paidOut: (
            <Action
              item={e}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.expenses}
              propName="paidOut"
            />
          )
        };
        return expense;
      });
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
      setDataTotal(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelFilter
        title={`${getTitle(path, true)} cadastradas`}
        actionButton={() => actionFilter()}
        loading={loading}
      >
        {/* <Col lg={3} md={8} sm={12} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col> */}
        <Col lg={6} md={12} sm={12} xs={24}>
          <Select
            label={'Pagas'}
            options={booleanFilter}
            value={state?.paidOut}
            onChange={(paidOut) => dispatch({ paidOut })}
          />
        </Col>
        {path == appRoutes.expenses && (
          <Col lg={6} md={12} sm={12} xs={24}>
            <Input
              label={'Tipo'}
              value={state.expenseTypeName}
              onChange={(e) => dispatch({ expenseTypeName: e.target.value })}
            />
          </Col>
        )}

        <Col lg={6} md={12} sm={12} xs={24}>
          <Input
            label={'Titulo'}
            value={state.title}
            onChange={(e) => dispatch({ title: e.target.value })}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Input
            label={'Descrição'}
            value={state.description}
            onChange={(e) => dispatch({ description: e.target.value })}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Input
            label={'Consultor'}
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
          />
        </Col>
        <Col lg={6} md={12} sm={24} xs={24}>
          <Input
            label={'Veiculo'}
            value={state.vehicleModel}
            onChange={(e) => dispatch({ vehicleModel: e.target.value })}
          />
        </Col>

        <Col lg={6} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data de vencimento"
            value={[
              state.paymentDateStart ? moment(state.paymentDateStart) : null,
              state.paymentDateEnd ? moment(state.paymentDateEnd) : null
            ]}
            onChange={(value: any, dateString: any) => {
              dispatch({
                paymentDateStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                paymentDateEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>

        <Col lg={6} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data de cadastro"
            onChange={(value: any, dateString: any) => {
              dispatch({
                createdAtStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                createdAtEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
      </PanelFilter>

      <Header>
        <Card
          loading={loading}
          value={dataTotal?.find((x) => x.paidOut == true)?.totalValueMonth}
          color={systemColors.GREEN}
          text={'Pagas'}
        />
        <Card
          loading={loading}
          value={dataTotal?.find((x) => x.paidOut == false)?.totalValueMonth}
          color={systemColors.RED}
          text={'A pagar'}
        />
        <Card
          loading={loading}
          value={dataTotal
            ?.map((x) => Number(x.totalValueMonth))
            .reduce((acc, total) => {
              return acc + total;
            }, 0)}
          color={systemColors.BLUE}
          text={'Total'}
        />
      </Header>

      <GridList
        size="small"
        scroll={{ x: 840 }}
        columns={[
          // { title: 'Código', dataIndex: 'id' },
          { title: 'Tipo', dataIndex: 'expenseTypeName' },
          {
            title: 'Dia',
            dataIndex: 'paymentDate'
          },
          { title: 'Titulo', dataIndex: 'title' },
          { title: 'Valor', dataIndex: 'value' },
          { title: 'Paga', dataIndex: 'paidOut' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'nameInfoDel'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${path.toLowerCase()}/create`,
          routeUpdate: `/${path.toLowerCase()}/edit`,
          routeDelete: `/${appRoutes.expenses}`
        }}
      />
    </div>
  );
};

export default List;
