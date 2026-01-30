import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, Row, UploadFile, Tabs, Divider } from 'antd';
import { Input, Select, Switch } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import { apiRoutes, appRoutes } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import AccessType from 'pages/User/CreateEdit/AccessType';
import UploadImages from 'components/UploadImages';
import { arrayCurrency } from 'utils';

import { Editor } from 'primereact/editor';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [imageHeaderContractList, setImageHeaderContractList] = useState<
    Array<UploadFile>
  >([]);
  const [imageFooterContractList, setImageFooterContractList] = useState<
    Array<UploadFile>
  >([]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.companies}/${id}`);
      dispatch({ ...resp.data });
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

      if (resp.data && resp.data.imageHeaderContract) {
        const imageArr = resp.data.imageHeaderContract.split('/');
        setImageHeaderContractList([
          {
            uid: '-1',
            name: imageArr[imageArr.length - 1],
            status: 'done',
            url: resp.data.imageHeaderContract
          }
        ]);
      }

      if (resp.data && resp.data.imageFooterContract) {
        const imageArr = resp.data.imageFooterContract.split('/');
        setImageFooterContractList([
          {
            uid: '-1',
            name: imageArr[imageArr.length - 1],
            status: 'done',
            url: resp.data.imageFooterContract
          }
        ]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.name) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.companies, {
        ...state,
        fileList,
        imageHeaderContractList,
        imageFooterContractList
      });

      setLoading(false);

      result.success && history.push(`/${appRoutes.companies}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} empresa`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={24}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Dados" key="1">
            <Row gutter={[24, 24]}>
              <Col lg={6} md={24} sm={24} xs={24}>
                <Row gutter={[16, 24]}>
                  <Col
                    lg={24}
                    md={6}
                    sm={12}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <UploadImages
                      setFileList={setFileList}
                      fileList={fileList}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={18} md={24} sm={24} xs={24}>
                <Row gutter={[16, 24]}>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Input
                      label={'Nome'}
                      required={true}
                      value={state.name}
                      onChange={(e) => dispatch({ name: e.target.value })}
                    />
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Input
                      label={'Nome fantasia'}
                      maxLength={100}
                      value={state.fantasyName}
                      onChange={(e) =>
                        dispatch({ fantasyName: e.target.value })
                      }
                    />
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Input
                      label={'Site'}
                      maxLength={100}
                      value={state.site}
                      onChange={(e) => dispatch({ site: e.target.value })}
                    />
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Input
                      label={'Instagram'}
                      maxLength={100}
                      value={state.instagran}
                      onChange={(e) => dispatch({ instagran: e.target.value })}
                    />
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Input
                      label={'Email'}
                      required={true}
                      type={'email'}
                      value={state.email}
                      onChange={(e) => dispatch({ email: e.target.value })}
                    />
                  </Col>
                  <Col lg={8} md={8} sm={12} xs={24}>
                    <Input
                      label={'CNPJ'}
                      maxLength={50}
                      value={state.cnpj}
                      onChange={(e) => dispatch({ cnpj: e.target.value })}
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Telefone'}
                  required={true}
                  type={'tel'}
                  value={state.phone}
                  onChange={(e) => dispatch({ phone: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Chave PIX'}
                  maxLength={100}
                  value={state.pixKey}
                  onChange={(e) => dispatch({ pixKey: e.target.value })}
                />
              </Col>
              <Col lg={12} md={12} sm={12} xs={24}>
                <Input
                  label={'Informações bancárias'}
                  maxLength={100}
                  value={state.agencyBank}
                  onChange={(e) => dispatch({ agencyBank: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'CEP'}
                  value={state.zipCode}
                  onChange={(e) => dispatch({ zipCode: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Estado'}
                  value={state.state}
                  onChange={(e) => dispatch({ state: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Cidade'}
                  value={state.city}
                  onChange={(e) => dispatch({ city: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Endereço'}
                  value={state.address}
                  onChange={(e) => dispatch({ address: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Gerente'}
                  value={state.manager}
                  onChange={(e) => dispatch({ manager: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Contato finaceiro'}
                  value={state.financeName}
                  placeholder={'Maria'}
                  onChange={(e) => dispatch({ financeName: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Telefone finaceiro'}
                  type={'tel'}
                  placeholder={'24992516721'}
                  value={state.financePhone}
                  onChange={(e) => dispatch({ financePhone: e.target.value })}
                />
              </Col>
              <Col lg={6} md={6} sm={12} xs={24}>
                <Input
                  label={'Tamanho do tanque'}
                  type={'number'}
                  value={state.sizeTank}
                  onChange={(e) => dispatch({ sizeTank: e.target.value })}
                />
              </Col>
              <Col lg={6} md={8} sm={12} xs={24}>
                <Select
                  label={'Moeda'}
                  options={arrayCurrency}
                  value={state?.currency}
                  onChange={(currency) => dispatch({ currency })}
                />
              </Col>
              <Col lg={6} md={8} sm={12} xs={24}>
                <Switch
                  label={'Ativa'}
                  title="Não / Sim"
                  checked={state.active}
                  checkedChildren="Sim"
                  unCheckedChildren="Não"
                  onChange={() => dispatch({ active: !state.active })}
                />
              </Col>

              {/* <Col lg={4} md={8} sm={24} xs={24}>
        <Switch
          label={'Comissão individual'}
          title="Não / Sim"
          checked={state.individualCommission}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() =>
            dispatch({ individualCommission: !state.individualCommission })
          }
        />
      </Col> */}
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Contrato" key="2">
            <Col lg={24}>
              <Divider>
                Variáveis que podem ser usadas para montar o texto
              </Divider>

              <div>{`{PRAZO}`}</div>
            </Col>
            <Col lg={24}>
              <Divider>Cláusula dois</Divider>
              <Editor
                value={state.textclauseContract2}
                onTextChange={(e: any) =>
                  dispatch({ textclauseContract2: e.htmlValue })
                }
                style={{ minHeight: '100px' }}
              />
            </Col>
            <Col lg={24}>
              <Divider>Cláusula tres</Divider>
              <Editor
                value={state.textclauseContract3}
                onTextChange={(e: any) =>
                  dispatch({ textclauseContract3: e.htmlValue })
                }
                style={{ minHeight: '100px' }}
              />
            </Col>
            <Col lg={24}>
              <Divider>Cláusula quatro</Divider>
              <Editor
                value={state.textclauseContract4}
                onTextChange={(e: any) =>
                  dispatch({ textclauseContract4: e.htmlValue })
                }
                style={{ minHeight: '100px' }}
              />
            </Col>

            <Col lg={24}>
              <Row gutter={[24, 24]}>
                <Col lg={12}>
                  <Divider>Logo cabeçalho</Divider>
                  <Col
                    lg={24}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <UploadImages
                      setFileList={setImageHeaderContractList}
                      fileList={imageHeaderContractList}
                    />
                  </Col>
                </Col>
                <Col lg={12}>
                  <Divider>Imagem exibida em ultima páigina</Divider>
                  <Col
                    lg={24}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <UploadImages
                      setFileList={setImageFooterContractList}
                      fileList={imageFooterContractList}
                    />
                  </Col>
                </Col>
              </Row>
            </Col>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Visita" key="3">
            <Col lg={24}>
              <Col lg={24}>
                <Divider>
                  Variáveis que podem ser usadas para montar o texto
                </Divider>

                <div>
                  {`{CONSULTOR}
                  {NOMEFANTASIA}
                  {CNPJ}
                  {ENDERECOEMPRESA}
                  {CIDADEEMPRESA}
                  {ESTADOEMPRESA}
                  {NOMECLIENTE}
                  {VALOR}
                  {ENDERECOCLIENTE}
                  {CIDADECLIENTE}
                  {ESTADOCLIENTE}
                  {DATA}
                  {DATADECADASTRO}`}
                </div>
              </Col>

              <Divider>Recibo de visitas técnicas</Divider>
              <Editor
                value={state.textVisit}
                onTextChange={(e: any) => dispatch({ textVisit: e.htmlValue })}
                style={{ minHeight: '200px' }}
              />
            </Col>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Permissões de acesso" key="4">
            <AccessType
              groupsSelecteds={state.groupsFormatted}
              setGroupsSelecteds={(groupsFormatted: string[]) =>
                dispatch({ groupsFormatted })
              }
            />
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
