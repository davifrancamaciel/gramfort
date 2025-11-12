import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, Tag, Tooltip, Row, UploadFile } from 'antd';
import {
  Input,
  Switch,
  InputPassword,
  Select,
  DatePicker
} from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import AccessType from './AccessType';
import ShowByRoule from 'components/ShowByRoule';
import UploadImages from 'components/UploadImages';

import {
  apiRoutes,
  enumStatusUserAws,
  roules,
  systemColors,
  userType
} from 'utils/defaultValues';
import BooleanTag from 'components/BooleanTag';
import { getTitle, getType, arrayCapture, arrayNature } from '../utils';

import { formatDifferenceInYears, getPeriod } from 'utils/formatDate';
import { useAppContext } from 'hooks/contextLib';

const CreateEdit: React.FC = (props: any) => {
  const { companies } = useAppContext();
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('');
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
    setPath(getType());
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/${id}`);
      const { UserAws } = resp.data;

      const itemEdit = { ...resp.data };
      if (UserAws) {
        itemEdit.status = UserAws.Enabled;
        itemEdit.accessType = UserAws.Groups;
        itemEdit.resetPassword = false;
        itemEdit.userStatusText = userStatusTag(UserAws.UserStatus);
        itemEdit.statusText = (
          <BooleanTag value={UserAws.Enabled} yes={'Ativo'} no={'Inativo'} />
        );
      }
      if (resp.data && resp.data.image) {
        const imageArr = resp.data.image.split('/');
        setFileList([
          {
            uid: '-1',
            name: imageArr[imageArr.length - 1],
            status: 'done',
            url: resp.data.image
          }
        ]);
      }
      console.log(itemEdit);
      dispatch(itemEdit);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.email) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }

      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.users, {
        ...state,
        type: path,
        fileList
      });

      setLoading(false);

      result.success && history.push(`/${path.toLowerCase()}s`);
    } catch (error) {
      setLoading(false);
    }
  };

  const userStatusTag = (userStatusText: string) => {
    let color, text, title;
    switch (userStatusText) {
      case enumStatusUserAws.FORCE_CHANGE_PASSWORD:
        color = systemColors.RED;
        text = 'LOGIN NÃO CONFIRMADO';
        title = 'Quando o usuário nunca efetuou login na aplicação';
        break;
      case enumStatusUserAws.CONFIRMED:
        color = systemColors.GREEN;
        text = 'LOGIN CONFIRMADO';
        title = 'Quando o usuário efetuou login ao menos uma vez na aplicação';
        break;
      default:
        break;
    }
    return color ? (
      <Tooltip title={title}>
        <Tag color={color}>{text}</Tag>
      </Tooltip>
    ) : undefined;
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} ${getTitle(
        path
      ).toLocaleLowerCase()}`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={loading}
      loadingPanel={false}
    >
      <Col lg={6} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <Col xs={24} style={{ display: 'flex', justifyContent: 'center' }}>
            <UploadImages setFileList={setFileList} fileList={fileList} />
          </Col>
          {type === 'update' && (
            <>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {state.statusText}
              </Col>
              <Col
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {state.userStatusText}
              </Col>
            </>
          )}
        </Row>
      </Col>
      <Col lg={18} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <ShowByRoule roule={roules.administrator}>
            <Col lg={8} md={8} sm={12} xs={24}>
              <Select
                label={'Empresa'}
                options={companies}
                value={state.companyId}
                onChange={(companyId) => dispatch({ companyId })}
              />
            </Col>
          </ShowByRoule>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Nome completo'}
              placeholder="Insira o nome completo do usuário"
              value={state.name}
              onChange={(e) => dispatch({ name: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Email'}
              required={true}
              disabled={type === 'update' && path === userType.USER}
              type={'email'}
              placeholder="Digite o email do usuário"
              value={state.email}
              onChange={(e) => dispatch({ email: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'CPF CNPJ'}
              type={'tel'}
              value={state.cpfCnpj}
              onChange={(e) => dispatch({ cpfCnpj: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Telefone'}
              type={'tel'}
              value={state.phone}
              onChange={(e) => dispatch({ phone: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Estado'}
              value={state.state}
              onChange={(e) => dispatch({ state: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Cidade'}
              value={state.city}
              onChange={(e) => dispatch({ city: e.target.value })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Endereço'}
              value={state.address}
              onChange={(e) => dispatch({ address: e.target.value })}
            />
          </Col>

          {path !== userType.USER && (
            <>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Input
                  label={'Representante'}
                  value={state.salesRepresentative}
                  onChange={(e) =>
                    dispatch({ salesRepresentative: e.target.value })
                  }
                />
              </Col>
            </>
          )}

          {path === userType.CLIENT && (
            <>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Select
                  label={'Captação'}
                  options={arrayCapture}
                  value={state?.capture}
                  onChange={(capture) => dispatch({ capture })}
                />
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Select
                  label={'Natureza'}
                  options={arrayNature}
                  value={state?.nature}
                  onChange={(nature) => dispatch({ nature })}
                />
              </Col>
            </>
          )}
          {/* <ShowByRoule roule={roules.sales}>
            {path === userType.USER && (
              <Col lg={8} md={8} sm={12} xs={24}>
                <Input
                  label={'Comissão'}
                  tooltip={
                    '% que será utilizada para calculo de commissões'
                  }
                  type={'tel'}
                  placeholder="Ex.: 2,5"
                  max={100}
                  min={0}
                  value={state.commissionMonth}
                  onChange={(e) =>
                    dispatch({ commissionMonth: e.target.value })
                  }
                />
              </Col>
            )}            
          </ShowByRoule> */}
          {path !== userType.SUPPLIER && (
            <Col lg={8} md={8} sm={12} xs={24}>
              <DatePicker
                label={'Data de nascimento'}
                value={state.dateOfBirth}
                onChange={(dateOfBirth) => dispatch({ dateOfBirth })}
              />
            </Col>
          )}
          {path === userType.USER && (
            <>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Input
                  label={'Idade'}
                  value={formatDifferenceInYears(state.dateOfBirth)}
                  disabled={true}
                />
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <DatePicker
                  label={'Data de contratação'}
                  value={state.hiringDate}
                  onChange={(hiringDate) => dispatch({ hiringDate })}
                />
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <Input
                  label={'Tempo de casa'}
                  value={getPeriod(state.hiringDate)}
                  disabled={true}
                />
              </Col>
              <Col lg={8} md={8} sm={12} xs={24}>
                <InputPassword
                  disabled={!(type === 'create' || state.resetPassword)}
                  label={'Senha'}
                  placeholder="Insira uma senha temporária para o usuário"
                  tooltip={
                    'Caso não seja informada uma senha ao criar um usuario o sistema irá gerar uma automaticamente e enviará para o email cadastrado'
                  }
                  value={state.password}
                  onChange={(e) => dispatch({ password: e.target.value })}
                />
              </Col>
              {type === 'update' && (
                <Col lg={5} md={8} sm={12} xs={24}>
                  <Switch
                    label={'Resetar senha'}
                    title="Sim / Não"
                    checked={state.resetPassword}
                    checkedChildren="Sim"
                    unCheckedChildren="Não"
                    onChange={() =>
                      dispatch({ resetPassword: !state.resetPassword })
                    }
                  />
                </Col>
              )}
              <Col lg={3} md={8} sm={12} xs={24}>
                <Switch
                  label={'Status'}
                  title="Inativo / Ativo"
                  checked={state.status}
                  checkedChildren="Ativo"
                  unCheckedChildren="Inativo"
                  onChange={() => dispatch({ status: !state.status })}
                />
              </Col>
            </>
          )}
        </Row>
      </Col>

      {path === userType.USER && (
        <AccessType
          groupsSelecteds={state.accessType}
          setGroupsSelecteds={(accessType: string[]) =>
            dispatch({ accessType })
          }
        />
      )}
    </PanelCrud>
  );
};

export default CreateEdit;
