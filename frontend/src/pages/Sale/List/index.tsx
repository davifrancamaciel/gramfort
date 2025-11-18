import React, { useEffect, useState } from 'react';
import { FileDoneOutlined } from '@ant-design/icons';
import { Col } from 'antd';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Switch, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, roules } from 'utils/defaultValues';
import { initialStateFilter, Sale, SaleProduct } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';
import PrintAll from './PrintAll';

import moment from 'moment';
import ShowByRoule from 'components/ShowByRoule';
import BooleanTag from 'components/BooleanTag';
import { useAppContext } from 'hooks/contextLib';
import { Link } from 'react-router-dom';
import WhatsApp from 'components/WhatsApp';

const List: React.FC = () => {
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const date = new Date();
    const createdAtStart = startOfMonth(date).toISOString();
    const createdAtEnd = endOfMonth(date).toISOString();
    actionFilter(1, createdAtStart, createdAtEnd);
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    createdAtStart = state.createdAtStart,
    createdAtEnd = state.createdAtEnd
  ) => {
    try {
      dispatch({ ...state, pageNumber, createdAtStart, createdAtEnd });

      setLoading(true);
      const resp = await api.get(apiRoutes.sales, {
        ...state,
        pageNumber,
        createdAtStart,
        createdAtEnd
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((p: Sale) => {
        const sale = {
          ...p,
          userName: p.user!.name,
          clientName: p.client?.phone ? (
            <WhatsApp
              phone={p.client?.phone}
              text={p.client?.name}
              message={`Olá, ${p.client?.name} segue o link da proposta para aprovação ${window.location.origin}/${appRoutes.contracts}/approve/${p.id}?hash=${p.hash}`}
            />
          ) : (
            p.client?.name
          ),
          companyName: p.company?.name,
          valueFormatted: formatPrice(Number(p.value!)),
          valueInputFormatted: formatPrice(Number(p.valueInput!)),
          balanceFormatted: formatPrice(
            Number(p.value!) - Number(p.valueInput!)
          ),
          productsFormatted: formatProductName(p.productsSales),
          createdAt: formatDateHour(p.createdAt),
          updatedAt: formatDateHour(p.updatedAt),
          saleDate: formatDate(p.saleDate),
          invoiceAction: <BooleanTag value={p.invoice} />
        };
        return {
          ...sale,
          contract: (
            <Link to={`${appRoutes.contracts}/details/${sale.id}`}>
              <FileDoneOutlined />
            </Link>
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
      .filter((p: SaleProduct) => !p.product.isInput)
      .map((p: SaleProduct) => p.product.name)
      .join(', ');
    return products.length > limit
      ? `${products.slice(0, limit)}...`
      : products;
  };

  return (
    <div>
      <PanelFilter
        title="Vendas cadastradas"
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
            label={'Vendedor'}
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
        headerChildren={<PrintAll state={state} />}
        scroll={{ x: 840 }}
        columns={[
          { title: 'Código', dataIndex: 'id' },
          { title: 'Data', dataIndex: 'saleDate' },
          { title: 'Empresa', dataIndex: 'companyName' },
          // { title: 'Produtos', dataIndex: 'productsFormatted' },
          { title: 'Valor', dataIndex: 'valueFormatted' },
          { title: 'Custo', dataIndex: 'valueInputFormatted' },
          { title: 'Saldo', dataIndex: 'balanceFormatted' },
          { title: 'Cliente', dataIndex: 'clientName' },
          { title: 'Contato', dataIndex: 'contact' },
          { title: 'Vendedor', dataIndex: 'userName' },
          { title: 'Captação', dataIndex: 'capture' },
          { title: 'NF', dataIndex: 'invoiceAction' },
          // { title: 'Criada em', dataIndex: 'createdAt' },
          // { title: 'Alterada em', dataIndex: 'updatedAt' },
          { title: 'Contrato', dataIndex: 'contract' }
        ]}
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
          routeCreate: `/${appRoutes.sales}/create`,
          routeUpdate: `/${appRoutes.sales}/edit`,
          // routeView: `/${appRoutes.sales}/details`,
          routeDelete: `/${appRoutes.sales}`
        }}
      />
    </div>
  );
};

export default List;
