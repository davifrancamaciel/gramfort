import React, { useEffect, useState } from 'react';
import { Col } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, booleanFilter } from 'utils/defaultValues';
import { initialStateFilter, Visit } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import Action from 'components/Action';
import Print from './Print';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Visit[]>([]);

  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.visits, {
        ...state,
        pageNumber
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
          value: formatPrice(Number(item.value) || 0),
          paymentDate: formatDate(item.paymentDate),
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),
          date: formatDateHour(item.date),
          paidOut: (
            <Action
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.visits}
              propName="paidOut"
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

  return (
    <div>
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

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            label={'Consultor'}
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
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
        <Col lg={8} md={24} sm={24} xs={24}>
          <RangePicker
            label="Data"
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
      </PanelFilter>
      <GridList
        size="small"
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Empresa', dataIndex: 'companyName' },
          {
            title: 'Data',
            dataIndex: 'date'
          },
          { title: 'Cliente', dataIndex: 'clientName' },
          { title: 'Cosultor', dataIndex: 'userName' },
          { title: 'Valor', dataIndex: 'value' },
          { title: 'Criada em', dataIndex: 'createdAt' },
          { title: 'Alterada em', dataIndex: 'updatedAt' },
          {
            title: 'Data PGTO',
            dataIndex: 'paymentDate'
          },
          { title: 'Paga', dataIndex: 'paidOut' },
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
      />
    </div>
  );
};

export default List;
