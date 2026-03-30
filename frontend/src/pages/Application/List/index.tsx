import React, { useEffect, useState } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Col, TableProps } from 'antd';
import moment from 'moment';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import { initialStateFilter, Application } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import { useAppContext } from 'hooks/contextLib';
import FastFilter from 'components/FastFilter';
import Actions from './Actions';
import { DataType } from '@/pages/Sale/interfaces';
import Action from 'components/Action';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import { Link } from 'react-router-dom';

const List: React.FC = () => {
  const { companies, userAuthenticated } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Application[]>([]);

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
      const resp = await api.get(apiRoutes.applications, {
        ...state,
        pageNumber,
        dateStart,
        dateEnd,
        field,
        order
      });
      setLoading(false);

      const { signInUserSession } = userAuthenticated;
      const groups = signInUserSession.accessToken.payload['cognito:groups'];
      const isDisabled = !checkRouleProfileAccess(groups, roules.sales);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Application) => {
        const itemFormatted = {
          ...item,
          nameInfoDel: `Aplicação cliente ${item.client?.name} aplicador ${item.user?.name}`,
          sale: isDisabled ? (
            item.saleId
          ) : (
            <Link to={`${appRoutes.sales}/edit/${item.saleId}`}>
              {item.saleId}
            </Link>
          ),
          clientName: item.client?.name,
          companyName: item.company?.name,
          userName: item.user?.name,
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),
          date: formatDate(item.date),
          approved: (
            <Action
              disabled={isDisabled}
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.applications}
              propName="approved"
            />
          )
        };
        return { ...itemFormatted };
      });
      setItems(itemsFormatted);
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
        title={`Aplicações cadastradas`}
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={8} md={8} sm={12} xs={24}>
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
        <Col lg={8} md={8} sm={12} xs={24}>
          <Input
            label={'Cliente'}
            value={state.clientName}
            onChange={(e) => dispatch({ clientName: e.target.value })}
          />
        </Col>
        <ShowByRoule roule={roules.saleUserIdChange}>
          <Col lg={8} md={12} sm={12} xs={24}>
            <Input
              label={'Aplicador'}
              value={state.userName}
              onChange={(e) => dispatch({ userName: e.target.value })}
            />
          </Col>
        </ShowByRoule>
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
        headerChildren={<Actions state={state} title={'Aplicações'} />}
        columns={[
          { title: 'Empresa', dataIndex: 'companyName' },
          { title: 'Venda', dataIndex: 'sale' },
          { title: 'Aplicador', dataIndex: 'userName' },
          {
            title: 'Data',
            dataIndex: 'date',
            sorter: true
          },
          { title: 'Cliente', dataIndex: 'clientName' },
          { title: 'Quantidade', dataIndex: 'amount', sorter: true },
          { title: 'Tipo', dataIndex: 'type', sorter: true },
          { title: 'Aprovada', dataIndex: 'approved' }
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
          routeCreate: `/${appRoutes.applications}/create`,
          routeUpdate: `/${appRoutes.applications}/edit`,
          routeDelete: `/${appRoutes.applications}`
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default List;
