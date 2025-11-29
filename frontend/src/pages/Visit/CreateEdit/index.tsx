import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, UploadFile } from 'antd';
import {
  DatePicker,
  Input,
  Select,
  Switch,
  Textarea
} from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import ShowByRoule from 'components/ShowByRoule';
import { apiRoutes, appRoutes, roules, userType } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import {
  formatValueWhithDecimalCaseOnChange,
  priceToNumber
} from 'utils/formatPrice';
import UploadImages from 'components/UploadImages';
import { useAppContext } from 'hooks/contextLib';

const CreateEdit: React.FC = (props: any) => {
  const { companies } = useAppContext();
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    onLoadUser();
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.visits}/${id}`);
      dispatch({
        ...resp.data,
        value: formatValueWhithDecimalCaseOnChange(resp.data?.value)
      });
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.value || !state.clientId || !state.date) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.visits, {
        ...state,
        value: priceToNumber(state.value),
        fileList
      });

      setLoading(false);

      result.success && history.push(`/${appRoutes.visits}`);
    } catch (error) {
      setLoading(false);
    }
  };

  const onLoadUser = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.users}/all`);

      setUsers(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} visita`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={8} md={8} sm={24} xs={24}>
          <Select
            label={'Empresa'}
            options={companies}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>

      <Col lg={8} md={8} sm={24} xs={24}>
        <Select
          required={true}
          label={'Cliente'}
          options={users.filter((u: any) => u.type === userType.CLIENT)}
          value={state.clientId}
          onChange={(clientId) => dispatch({ clientId })}
        />
      </Col>

      <Col lg={8} md={8} sm={24} xs={24}>
        <Select
          label={'Consultor'}
          options={users.filter((u: any) => u.type === userType.USER)}
          value={state.userId}
          onChange={(userId) => dispatch({ userId })}
        />
      </Col>

      <Col lg={4} md={8} sm={6} xs={24}>
        <Input
          label={'Valor'}
          type={'tel'}
          required={true}
          placeholder="15,00"
          value={state.value}
          onChange={(e) =>
            dispatch({
              value: formatValueWhithDecimalCaseOnChange(e.target.value)
            })
          }
        />
      </Col>
      <Col lg={4} md={8} sm={6} xs={24}>
        <Input
          label={'Kms rodados'}
          type={'tel'}
          placeholder="15"
          value={state.km}
          onChange={(e) =>
            dispatch({
              km: priceToNumber(e.target.value)
            })
          }
        />
      </Col>

      <Col lg={4} md={8} sm={12} xs={24}>
        <DatePicker
          label={'Data de pagamento'}
          value={state.paymentDate}
          onChange={(paymentDate) => dispatch({ paymentDate })}
        />
      </Col>
      <Col lg={4} md={8} sm={12} xs={24}>
        <DatePicker
          label={'Data da visita'}
          value={state.date}
          required={true}
          onChange={(date) => dispatch({ date })}
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
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Observações'}
          placeholder=""
          value={state.note}
          onChange={(e) => dispatch({ note: e.target.value })}
        />
      </Col>
      <Col lg={3} md={4} sm={6} xs={24}>
        <Switch
          label={'Paga'}
          title="Não / Sim"
          checked={state.paidOut}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ paidOut: !state.paidOut })}
        />
      </Col>

      <Col lg={3} md={4} sm={6} xs={24}>
        <Switch
          label={'Contrato'}
          title="Não / Sim"
          checked={state.proposal}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ proposal: !state.proposal })}
        />
      </Col>
      <Col lg={12} md={12} sm={6} xs={24}>
        <Switch
          label={'Venda'}
          title="Não / Sim"
          checked={state.sale}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ sale: !state.sale })}
        />
      </Col>

      <Col
        lg={6}
        md={12}
        sm={24}
        xs={24}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <UploadImages setFileList={setFileList} fileList={fileList} />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
