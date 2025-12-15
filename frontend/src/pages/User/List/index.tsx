import React, { useEffect, useState } from 'react';
import { Col, Image } from 'antd';
import PanelFilter from 'components/PanelFilter';
import GridList from 'components/GridList';
import { Input, Select } from 'components/_inputs';
import { apiRoutes, appRoutes, roules, userType } from 'utils/defaultValues';
import { initialStateFilter, Users } from '../interfaces';
import useFormState from 'hooks/useFormState';
import api from 'services/api-aws-amplify';
import { formatDateHour, formatDate } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import BooleanTag from 'components/BooleanTag';
import { useAppContext } from 'hooks/contextLib';
import ExportCSV from './Export';
import { useQuery } from 'hooks/queryString';
import WhatsApp from 'components/WhatsApp';
import { arrayMonth, arrayNature, getTitle, getType } from '../utils';

const List: React.FC = () => {
  const query = useQuery();
  const { companies } = useAppContext();
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
        updatedAt: formatDateHour(item.updatedAt),
        dateOfBirth: formatDate(item.dateOfBirth)
      }));
      dispatch({ pageNumber });
      setItems(dataItemsFormatted);
      setLoading(false);
      setTotalRecords(count);
    } catch (error) {
      setLoading(false);
    }
  };

  const getColls = () => {
    let colls: Array<any> = [];
    if (path !== userType.CLIENT)
      colls.push({ title: 'Imagem', dataIndex: 'image' });

    colls.push({ title: 'Código', dataIndex: 'id' });
    colls.push({
      title: 'Empresa',
      dataIndex: 'companyName'
    });
    colls.push({ title: 'Nome', dataIndex: 'name' });
    if (path === userType.CLIENT)
      colls.push({ title: 'CPF/CNPJ', dataIndex: 'cpfCnpj' });
    colls.push({ title: 'Email', dataIndex: 'email' });
    colls.push({ title: 'Telefone', dataIndex: 'phone' });
    if (path === userType.CLIENT) {
      colls.push({ title: 'Estado', dataIndex: 'state' });
      colls.push({ title: 'Cidade', dataIndex: 'city' });
      colls.push({ title: 'Captação', dataIndex: 'capture' });
      colls.push({ title: 'Data nascimento', dataIndex: 'dateOfBirth' });
    }
    if (path !== userType.CLIENT) {
      colls.push({ title: 'Ativo', dataIndex: 'active' });
      colls.push({ title: 'Criado em', dataIndex: 'createdAt' });
      colls.push({ title: 'Alterado em', dataIndex: 'updatedAt' });
    }
    return colls;
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
              options={companies}
              value={state.companyId}
              onChange={(companyId) => dispatch({ companyId })}
            />
          </Col>
        </ShowByRoule>
        {path === userType.CLIENT && (
          <>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Select
                label={'Natureza'}
                options={arrayNature}
                value={state?.nature}
                onChange={(nature) => dispatch({ nature })}
              />
            </Col>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Select
                label={'Aniversário'}
                options={arrayMonth}
                value={state?.dateOfBirth}
                onChange={(dateOfBirth) => dispatch({ dateOfBirth })}
              />
            </Col>
          </>
        )}
      </PanelFilter>
      <GridList
        scroll={{ x: 600 }}
        headerChildren={<ExportCSV {...state} />}
        columns={getColls()}
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
