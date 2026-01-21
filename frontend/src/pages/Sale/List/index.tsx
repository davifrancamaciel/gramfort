import React, { useEffect, useState } from 'react';

import { Col, TableProps } from 'antd';
import { startOfMonth, endOfMonth } from 'date-fns';

import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import {
  apiRoutes,
  appRoutes,
  categorIdsArrayProduct,
  roules
} from 'utils/defaultValues';
import { DataType, initialStateFilter, Sale, SaleProduct } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';

import moment from 'moment';
import ShowByRoule from 'components/ShowByRoule';
import BooleanTag from 'components/BooleanTag';
import { useAppContext } from 'hooks/contextLib';
import { Link } from 'react-router-dom';
import WhatsApp from 'components/WhatsApp';
import {
  createMessageShare,
  getBalance,
  getCostValue,
  getTableColl,
  getTitle,
  getType
} from '../utils';
import Cards from './Cards';
import FastFilter from 'components/FastFilter';
import Actions from './Actions';
import Action from 'components/Action';

const List: React.FC = () => {
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    const typePath = getType();
    setPath(typePath);
    const date = new Date();
    const createdAtStart = startOfMonth(date).toISOString();
    const createdAtEnd = endOfMonth(date).toISOString();
    actionFilter(1, createdAtStart, createdAtEnd, typePath);
  }, []);

  useEffect(() => {
    if (state.date) {
      const createdAtStart = startOfMonth(state.date).toISOString();
      const createdAtEnd = endOfMonth(state.date).toISOString();
      dispatch({ createdAtStart, createdAtEnd });
      actionFilter(1, createdAtStart, createdAtEnd);
    }
  }, [state.date, state?.companyId]);

  const actionFilter = async (
    pageNumber: number = 1,
    createdAtStart = state.createdAtStart,
    createdAtEnd = state.createdAtEnd,
    path: string = state.path,
    field = '',
    order: string = 'asc'
  ) => {
    try {
      dispatch({ ...state, pageNumber, createdAtStart, createdAtEnd, path });

      setLoading(true);
      const resp = await api.get(apiRoutes.sales, {
        ...state,
        pageNumber,
        createdAtStart,
        createdAtEnd,
        path,
        field,
        order
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Sale) => {
        const sale = {
          ...p,
          userName: p.user!.name,
          clientName:
            p.client?.phone && p.hash ? (
              <WhatsApp
                phone={p.client?.phone}
                text={p.client?.name}
                message={createMessageShare(p)}
              />
            ) : (
              p.client?.name
            ),
          companyName: p.company?.name,
          valueFormatted: formatPrice(Number(p.value!)),
          valuePerMeterFormatted: formatPrice(Number(p.valuePerMeter) || 0),
          valueCostFormatted: formatPrice(
            getCostValue(p, path === appRoutes.sales)
          ),
          balanceFormatted: getBalance(p, path === appRoutes.sales),
          productsFormatted: formatProductName(p.productsSales),
          createdAt: formatDateHour(p.createdAt),
          updatedAt: formatDateHour(p.updatedAt),
          saleDate: formatDate(p.saleDate),
          invoiceAction: (
            <Action
              item={{ ...p, action: true }}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.sales}
              propName="invoice"
            />
          ),
          approved: <BooleanTag value={p.approved!} />
        };
        return {
          ...sale,
          contract: sale.hash ? (
            <Link to={`${appRoutes.contracts}/details/${sale.id}`}>
              <BooleanTag
                value={true}
                yes={path === appRoutes.contracts ? 'VER' : 'SIM/VER'}
              />
            </Link>
          ) : (
            <BooleanTag value={false} />
          )
        };
      });
      setItems(itemsFormatted);
      console.log(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const formatProductName = (productsArray: SaleProduct[]) => {
    const limit = 50;
    let products = productsArray
      .filter((p: SaleProduct) =>
        categorIdsArrayProduct.includes(p.product.categoryId || 0)
      )
      .map((p: SaleProduct) => p.product.name)
      .join(', ');
    return products.length > limit
      ? `${products.slice(0, limit)}...`
      : products;
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
      state.createdAtStart,
      state.createdAtEnd,
      state.path,
      getTableColl(sortField?.toString()),
      order
    );
  };
  const getColls = (path: string) => {
    let arrayCols = [];

    arrayCols.push({ title: 'Código', dataIndex: 'id', sorter: true });
    arrayCols.push({ title: 'Data', dataIndex: 'saleDate', sorter: true });
    arrayCols.push({ title: 'Empresa', dataIndex: 'companyName' });
    //  arrayCols.push({ title: 'Produtos', dataIndex: 'productsFormatted' });
    arrayCols.push({
      title: 'Valor',
      dataIndex: 'valueFormatted',
      sorter: true
    });
    arrayCols.push({
      title: 'Custos+descontos',
      dataIndex: 'valueCostFormatted',
      sorter: true
    });
    arrayCols.push({ title: 'Saldo', dataIndex: 'balanceFormatted' });
    arrayCols.push({
      title: 'Valor med M2',
      dataIndex: 'valuePerMeterFormatted',
      sorter: true
    });
    arrayCols.push({ title: 'Cliente', dataIndex: 'clientName' });
    arrayCols.push({ title: 'Contato', dataIndex: 'contact' });
    arrayCols.push({ title: 'Consultor', dataIndex: 'userName' });
    arrayCols.push({ title: 'Captação', dataIndex: 'capture' });
    if (path === appRoutes.sales)
      arrayCols.push({ title: 'NF', dataIndex: 'invoiceAction' });
    if (path === appRoutes.contracts)
      arrayCols.push({ title: 'Venda', dataIndex: 'approved' });
    //  arrayCols.push({ title: 'Criada em', dataIndex: 'createdAt' });
    //  arrayCols.push({ title: 'Alterada em', dataIndex: 'updatedAt' });
    arrayCols.push({ title: 'Contrato', dataIndex: 'contract' });

    return arrayCols;
  };

  return (
    <div>
      <FastFilter state={state} setState={dispatch} />
      <div style={{ marginBottom: '15px' }}>
        <Cards sales={items} loading={loading} />
      </div>
      <PanelFilter
        title={getTitle(path, true)}
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={4} md={12} sm={24} xs={24}>
          <Input
            label={'Código'}
            type={'number'}
            placeholder="Ex.: 100"
            value={state.id}
            onChange={(e) => dispatch({ id: e.target.value })}
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <Input
            label={'Produto'}
            placeholder="Ex.: Bola"
            value={state.product}
            onChange={(e) => dispatch({ product: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={24} xs={24}>
          <Input
            label={'Consultor'}
            placeholder="Ex.: Thamara"
            value={state.userName}
            onChange={(e) => dispatch({ userName: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={24} xs={24}>
          <Input
            label={'Cliente'}
            placeholder="Ex.: Thamara"
            value={state.clientName}
            onChange={(e) => dispatch({ clientName: e.target.value })}
          />
        </Col>
        <Col lg={5} md={12} sm={24} xs={24}>
          <Input
            label={'Obs.'}
            placeholder="Ex.: "
            value={state.note}
            onChange={(e) => dispatch({ note: e.target.value })}
          />
        </Col>
        <Col lg={9} md={12} sm={24} xs={24}>
          <RangePicker
            label="Data aplicação"
            value={[
              state.createdAtStart ? moment(state.createdAtStart) : null,
              state.createdAtEnd ? moment(state.createdAtEnd) : null
            ]}
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
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Valor de'}
            placeholder="Ex.: 1"
            type={'number'}
            value={state.valueMin}
            onChange={(e) => dispatch({ valueMin: e.target.value })}
          />
        </Col>
        <Col lg={5} md={6} sm={12} xs={24}>
          <Input
            label={'Valor até'}
            placeholder="Ex.: 1000"
            type={'number'}
            value={state.valueMax}
            onChange={(e) => dispatch({ valueMax: e.target.value })}
          />
        </Col>

        <ShowByRoule roule={roules.administrator}>
          <Col lg={5} md={6} sm={12} xs={24}>
            <Select
              label={'Empresa'}
              options={companies}
              value={state.companyId}
              onChange={(companyId) => dispatch({ companyId })}
            />
          </Col>
        </ShowByRoule>
        {/* <Col lg={5} md={8} sm={12} xs={24}>
          <Switch
            label={'Exibir comissão'}
            title="Sim / Não"
            checked={state.showCommission}
            checkedChildren="Sim"
            unCheckedChildren="Não"
            onChange={() => dispatch({ showCommission: !state.showCommission })}
          />
        </Col> */}
      </PanelFilter>
      <GridList
        headerChildren={
          <Actions state={state} title={getTitle(path, true)} path={path} />
        }
        scroll={{ x: 840 }}
        columns={getColls(path)}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => {
          actionFilter(state.pageNumber);
        }}
        propTexObjOndelete={'productsFormatted'}
        totalRecords={totalRecords}
        pageSize={state.pageSize}
        loading={loading}
        routes={{
          routeCreate: `/${path}/create`,
          routeUpdate: `/${path}/edit`,
          // routeView: `/${path}/details`,
          routeDelete: `/${appRoutes.sales}`
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default List;
