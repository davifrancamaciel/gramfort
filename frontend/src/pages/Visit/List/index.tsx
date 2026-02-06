import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Col, TableProps } from 'antd';
import moment from 'moment';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  booleanFilter,
  roules
} from 'utils/defaultValues';
import { initialStateFilter, Visit } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import Action from 'components/Action';
import Print from './Print';
import ShowByRoule from 'components/ShowByRoule';
import { useAppContext } from 'hooks/contextLib';
import FastFilter from 'components/FastFilter';
import Actions from './Actions';
import { DataType } from '@/pages/Sale/interfaces';

const List: React.FC = () => {
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Visit[]>([]);

  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const date = new Date();
    const dateStart = startOfMonth(date).toISOString();
    const dateEnd = endOfMonth(date).toISOString();
    actionFilter(1, dateStart, dateEnd);
  }, []);

  useEffect(() => {
    if (state.date) {
      const dateStart = startOfMonth(state.date).toISOString();
      const dateEnd = endOfMonth(state.date).toISOString();
      dispatch({ dateStart, dateEnd });
      actionFilter(1, dateStart, dateEnd);
    }
  }, [state.date, state?.companyId]);

  const actionFilter = async (
    pageNumber: number = 1,
    dateStart = state.dateStart,
    dateEnd = state.dateEnd,
    field = '',
    order: string = 'asc'
  ) => {
    try {
      dispatch({ ...state, pageNumber, dateStart, dateEnd });

      setLoading(true);
      const resp = await api.get(apiRoutes.visits, {
        ...state,
        pageNumber,
        dateStart,
        dateEnd,
        field,
        order
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Visit) => {
        const itemFormatted = {
          ...item,
          nameInfoDel: `Visita cliente ${item.client?.name} cosultor ${item.user?.name}`,
          clientName: item.client?.name,
          companyName: item.company?.name,
          userName: item.user?.name,
          value: formatPrice(Number(item.value) || 0, item.company?.currency),
          paymentDate: formatDate(item.paymentDate),
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),
          date: formatDate(item.date),
          paidOut: (
            <Action
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.visits}
              propName="paidOut"
            />
          ),
          proposal: (
            <Action
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.visits}
              propName="proposal"
            />
          ),
          sale: (
            <Action
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.visits}
              propName="sale"
            />
          )
        };
        return { ...itemFormatted, print: <Print item={item} /> };
      });
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
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
      state.dateStart,
      state.dateEnd,
      sortField?.toString(),
      order
    );
  };

  return (
    <div>
      <FastFilter state={state} setState={dispatch} />
      <PanelFilter
        title={`Visitas cadastradas`}
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={3} md={8} sm={12} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={5} md={8} sm={12} xs={24}>
          <Select
            label={'Pagas'}
            options={booleanFilter}
            value={state?.paidOut}
            onChange={(paidOut) => dispatch({ paidOut })}
          />
        </Col>

        <Col lg={8} md={8} sm={12} xs={24}>
          <Input
            label={'Cliente'}
            value={state.clientName}
            onChange={(e) => dispatch({ clientName: e.target.value })}
          />
        </Col>

        <Col lg={8} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data de pagamento"
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

        <Col lg={8} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data"
            value={[
              state.dateStart ? moment(state.dateStart) : null,
              state.dateEnd ? moment(state.dateEnd) : null
            ]}
            onChange={(value: any, dateString: any) => {
              dispatch({
                dateStart: dateString[0]?.split('/').reverse().join('-')
              });
              dispatch({
                dateEnd: dateString[1]?.split('/').reverse().join('-')
              });
            }}
          />
        </Col>
        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            label={'Consultor'}
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
          />
        </Col>
        <ShowByRoule roule={roules.administrator}>
          <Col lg={8} md={12} sm={12} xs={24}>
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
        size="small"
        scroll={{ x: 840 }}
        headerChildren={<Actions state={state} title={'Visitas'} />}
        columns={[
          // { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'companyName' },
          {
            title: 'Data PGTO',
            dataIndex: 'paymentDate',
            sorter: true
          },
          {
            title: 'Data',
            dataIndex: 'date',
            sorter: true
          },
          { title: 'Valor', dataIndex: 'value', sorter: true },
          { title: 'Cliente', dataIndex: 'clientName' },
          { title: 'Consultor', dataIndex: 'userName' },
          { title: 'KM', dataIndex: 'km', sorter: true },
          { title: 'Cidade', dataIndex: 'city', sorter: true },
          { title: 'Paga', dataIndex: 'paidOut' },
          { title: 'Contrato', dataIndex: 'proposal' },
          { title: 'Venda', dataIndex: 'sale' },
          // { title: 'Criada em', dataIndex: 'createdAt' },
          // { title: 'Alterada em', dataIndex: 'updatedAt' },
          { title: '', dataIndex: 'print' }
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
          routeCreate: `/${appRoutes.visits}/create`,
          routeUpdate: `/${appRoutes.visits}/edit`,
          routeDelete: `/${appRoutes.visits}`
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default List;
