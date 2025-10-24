import React, { useEffect, useState } from 'react';
import { Col, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, roules, userType } from 'utils/defaultValues';
import { initialStateFilter, Users } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import BooleanTag from 'components/BooleanTag';
import { useAppContext } from 'hooks/contextLib';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import ExportCSV from './Export';
import { useQuery } from 'hooks/queryString';
import WhatsApp from 'components/WhatsApp';
import { getTitle, getType } from '../utils';

const List: React.FC = () => {
  const query = useQuery();
  const { userAuthenticated } = useAppContext();
  const { state, dispatch } = useFormState(initialStateFilter);
  const [items, setItems] = useState<Users[]>([]);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(userType.USER);
  const [totalRecords, setTotalRecords] = useState(0);
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
    setPath(getType());
    actionFilter(1, query.get('email') || undefined);
  }, []);

  const actionFilter = async (
    pageNumber: number = 1,
    email: string = state.email
  ) => {
    setLoading(true);
    dispatch({ pageNumber, email });
    try {
      const resp = await api.get(apiRoutes.users, {
        ...state,
        pageNumber,
        email,
        type: getType()
      });
      const { count, rows } = resp.data;

      const dataItemsFormatted = rows.map((item: Users) => ({
        ...item,
        image: (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image style={{ height: '40px' }} src={item.image} />
          </div>
        ),

        phone: <WhatsApp phone={item.phone} />,
        active: <BooleanTag value={item.active} />,
        deleteName: `${item.name} da empresa ${item.company?.name}`,
        companyName: item.company?.name,
        createdAt: formatDateHour(item.createdAt),
        updatedAt: formatDateHour(item.updatedAt)
      }));
      dispatch({ pageNumber });
      setItems(dataItemsFormatted);
      setLoading(false);
      setTotalRecords(count);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <PanelFilter
        title={`${getTitle(path, true)} cadastrados`}
        actionButton={() => actionFilter()}
        loading={loading}
      >
        <Col lg={8} md={12} sm={24} xs={24}>
          <Input
            label={'Nome'}
            placeholder="Ex.: Davi"
            value={state.name}
            onChange={(e) => dispatch({ name: e.target.value })}
          />
        </Col>
        <Col lg={8} md={12} sm={24} xs={24}>
          <Input
            label={'Email'}
            placeholder="Ex.: davi@gmail"
            value={state.email}
            onChange={(e) => dispatch({ email: e.target.value })}
          />
        </Col>
        <ShowByRoule roule={roules.administrator}>
          <Col lg={8} md={12} sm={24} xs={24}>
            <Select
              label={'Empresa'}
              url={`${apiRoutes.companies}/all`}
              value={state.companyId}
              onChange={(companyId) => dispatch({ companyId })}
            />
          </Col>
        </ShowByRoule>
      </PanelFilter>
      <GridList
        scroll={{ x: 600 }}
        headerChildren={<ExportCSV {...state} />}
        columns={[
          { title: 'Imagem', dataIndex: 'image' },
          { title: 'Código', dataIndex: 'id' },
          {
            title: 'Empresa',
            dataIndex: 'companyName'
          },
          { title: 'Nome', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          // {
          //   title: checkRouleProfileAccess(groups, roules.administrator)
          //     ? 'Empresa'
          //     : 'Telefone',
          //   dataIndex: checkRouleProfileAccess(groups, roules.administrator)
          //     ? 'companyName'
          //     : 'phone'
          // },
          {
            title: 'Telefone',
            dataIndex: 'phone'
          },
          { title: 'Ativo', dataIndex: 'active' },
          { title: 'Criado em', dataIndex: 'createdAt' },
          { title: 'Alterado em', dataIndex: 'updatedAt' }
        ]}
        dataSource={items}
        onPagination={(pageNumber) => actionFilter(pageNumber)}
        onDelete={() => actionFilter(state.pageNumber)}
        propTexObjOndelete={'deleteName'}
        pageSize={state.pageSize}
        totalRecords={totalRecords}
        // hidePagination={true}
        loading={loading}
        routes={{
          routeCreate: `/${path.toLowerCase()}s/create`,
          routeUpdate: `/${path.toLowerCase()}s/edit`,
          routeDelete: `/${appRoutes.users}`
        }}
      />
    </div>
  );
};

export default List;
