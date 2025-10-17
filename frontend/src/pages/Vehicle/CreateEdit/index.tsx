import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, UploadFile } from 'antd';
import {
  DatePicker,
  Input,
  Select,
  Switch,
  Textarea,
  TimePicker
} from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import ShowByRoule from 'components/ShowByRoule';
import { apiRoutes, appRoutes, roules, userType } from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { initialStateForm, years } from '../interfaces';
import api from 'services/api-aws-amplify';
import {
  formatValueWhithDecimalCaseOnChange,
  priceToNumber
} from 'utils/formatPrice';
import UploadImages from 'components/UploadImages';
import { extractHour, setHour } from 'utils/formatDate';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.vehicles}/${id}`);
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
      if (!state.value || !state.model || !state.year) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.vehicles, {
        ...state,
        value: priceToNumber(state.value),
        fileList
      });

      setLoading(false);

      result.success && history.push(`/${appRoutes.vehicles}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} veiculo`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={8} md={8} sm={12} xs={24}>
          <Select
            label={'Empresa'}
            url={`${apiRoutes.companies}/all`}
            value={state.companyId}
            onChange={(companyId) => dispatch({ companyId })}
          />
        </Col>
      </ShowByRoule>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Categoria'}
          value={state.category}
          onChange={(e) => dispatch({ category: e.target.value })}
        />
      </Col>
      <Col lg={8} md={8} sm={12} xs={24}>
        <Input
          label={'Modelo'}
          required={true}
          value={state.model}
          onChange={(e) => dispatch({ model: e.target.value })}
        />
      </Col>
      <Col lg={4} md={8} sm={6} xs={24}>
        <Select
          label={'Ano'}
          options={years}
          required={true}
          value={state.year}
          onChange={(year) => dispatch({ year })}
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
          label={'Kms compra'}
          type={'tel'}
          placeholder="15"
          value={state.kmInitial}
          onChange={(e) =>
            dispatch({
              kmInitial: priceToNumber(e.target.value)
            })
          }
        />
      </Col>
      <Col lg={4} md={8} sm={6} xs={24}>
        <Input
          label={'Kms atual'}
          type={'tel'}
          placeholder="15"
          value={state.kmCurrent}
          onChange={(e) =>
            dispatch({
              kmCurrent: priceToNumber(e.target.value)
            })
          }
        />
      </Col>

      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Descrição'}
          value={state.description}
          onChange={(e) => dispatch({ description: e.target.value })}
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
