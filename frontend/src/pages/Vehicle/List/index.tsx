import React, { useEffect, useState } from 'react';
import { Col, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, RangePicker, Select } from 'components/_inputs';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { initialStateFilter, Vehicle, years } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import { formatPrice } from 'utils/formatPrice';

const List: React.FC = () => {
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Vehicle[]>([]);

  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter();
  }, []);

  const actionFilter = async (pageNumber: number = 1) => {
    try {
      dispatch({ pageNumber });

      setLoading(true);
      const resp = await api.get(apiRoutes.vehicles, {
        ...state,
        pageNumber
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Vehicle) => {
        const itemFormatted = {
          ...item,
          nameInfoDel: `Veiculo ${item.model} empresa ${item.company?.name}`,
          companyName: item.company?.name,
          value: formatPrice(Number(item.value) || 0),
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),
          image: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image style={{ height: '60px' }} src={item.image} />
            </div>
          )
        };
        return itemFormatted;
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
        title={`Veiculos cadastrados`}
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
            label={'Ano'}
            options={years}
            value={state?.year}
            onChange={(year) => dispatch({ year })}
          />
        </Col>

        <Col lg={8} md={8} sm={12} xs={24}>
          <Input
            label={'Modelo'}
            value={state.model}
            onChange={(e) => dispatch({ model: e.target.value })}
          />
        </Col>

        <Col lg={8} md={12} sm={12} xs={24}>
          <Input
            label={'Categoria'}
            value={state.category}
            onChange={(e) => dispatch({ category: e.target.value })}
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
      </PanelFilter>

      <GridList
        size="small"
        scroll={{ x: 840 }}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'id' },
          { title: 'Modelo', dataIndex: 'model' },
          { title: 'Ano', dataIndex: 'year' },
          { title: 'Categoria', dataIndex: 'category' },
          { title: 'Empresa', dataIndex: 'companyName' },
          { title: 'Valor', dataIndex: 'value' },
          { title: 'Criada em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
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
          routeCreate: `/${appRoutes.vehicles}/create`,
          routeUpdate: `/${appRoutes.vehicles}/edit`,
          routeDelete: `/${appRoutes.vehicles}`
        }}
      />
    </div>
  );
};

export default List;
