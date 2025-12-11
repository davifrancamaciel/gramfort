import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

import moment from 'moment';
import { Col, TableProps } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  booleanFilter,
  expensesTypesEnum,
  roules
} from 'utils/defaultValues';
import {
  initialStateFilter,
  Expense,
  CardsResult,
  initialStateCards,
  DataType
} from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import Action from 'components/Action';
import { getTitle, getType } from '../utils';
import ShowByRoule from 'components/ShowByRoule';
import { useAppContext } from 'hooks/contextLib';
import Cards from './Cards';
import FastFilter from 'components/FastFilter';
import Actions from './Actions';

const List: React.FC = () => {
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTotal, setDataTotal] = useState<CardsResult>(initialStateCards);
  const [path, setPath] = useState(apiRoutes.expenses);

  useEffect(() => {
    const date = new Date();
    const paymentDateStart = startOfMonth(date).toISOString();
    const paymentDateEnd = endOfMonth(date).toISOString();
    actionFilter(1, paymentDateStart, paymentDateEnd);
    setPath(getType());
  }, []);

  useEffect(() => {
    if (state.date) {
      const paymentDateStart = startOfMonth(state.date).toISOString();
      const paymentDateEnd = endOfMonth(state.date).toISOString();
      dispatch({ paymentDateStart, paymentDateEnd });
      actionFilter(1, paymentDateStart, paymentDateEnd);
    }
  }, [state.date, state?.companyId]);

  const actionFilter = async (
    pageNumber: number = 1,
    paymentDateStart = state.paymentDateStart,
    paymentDateEnd = state.paymentDateEnd,
    field = '',
    order: string = 'asc'
  ) => {
    try {
      const type = getType();
      let expenseTypeId: string = '';
      if (type == appRoutes.shopping) {
        expenseTypeId = expensesTypesEnum.COMPRAS.toString();
      }
      dispatch({ pageNumber, paymentDateStart, paymentDateEnd, expenseTypeId });
      setLoading(true);
      const resp = await api.get(apiRoutes.expenses, {
        ...state,
        pageNumber,
        expenseTypeId,
        paymentDateStart,
        paymentDateEnd,
        field,
        order
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
          companyName: e.company?.name,
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
      setTotalRecords(count);
      pageNumber === 1 && setDataTotal(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleTableChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    const sortOrder = Array.isArray(sorter) ? undefined : sorter.order;
    const sortField = Array.isArray(sorter) ? undefined : sorter.field;
    const order = sortOrder === 'ascend' ? 'asc' : 'desc';
    actionFilter(
      1,
      state.paymentDateStart,
      state.paymentDateEnd,
      sortField?.toString(),
      order
    );
  };

  return (
    <div>
      <FastFilter state={state} setState={dispatch} />
      <div style={{ marginBottom: '15px' }}>
        <Cards dataTotal={dataTotal} loading={loading} />
      </div>

      <PanelFilter
        title={`${getTitle(path, true)} cadastradas`}
        actionButton={() => actionFilter()}
        loading={loading}
      >
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

        <Col lg={6} md={12} sm={12} xs={24}>
          <Input
            label={path == appRoutes.expenses ? 'Consultor' : 'Fornecedor'}
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
          />
        </Col>
        {path == appRoutes.expenses && (
          <Col lg={6} md={12} sm={12} xs={24}>
            <Input
              label={'Veiculo'}
              value={state.vehicleModel}
              onChange={(e) => dispatch({ vehicleModel: e.target.value })}
            />
          </Col>
        )}

        <ShowByRoule roule={roules.administrator}>
          <Col lg={6} md={12} sm={12} xs={24}>
            <Select
              label={'Empresa'}
              options={companies}
              value={state.companyId}
              onChange={(companyId) => dispatch({ companyId })}
            />
          </Col>
        </ShowByRoule>
      </PanelFilter>

      <GridList
        headerChildren={<Actions state={state} title={getTitle(path, true)} />}
        size="small"
        scroll={{ x: 640 }}
        columns={[
          // { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'companyName' },
          { title: 'Tipo', dataIndex: 'expenseTypeName', sorter: true },
          {
            title: 'Dia',
            dataIndex: 'paymentDate',
            sorter: true
          },
          { title: 'Titulo', dataIndex: 'title', sorter: true },
          { title: 'Valor', dataIndex: 'value', sorter: true },
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
        onChange={handleTableChange}
      />
    </div>
  );
};

export default List;
