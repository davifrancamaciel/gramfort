import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification } from 'antd';
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
import { getTitle, getType, paymentMethods } from '../utils';
import { IOptions } from 'utils/commonInterfaces';
import { useAppContext } from 'hooks/contextLib';

const CreateEdit: React.FC = (props: any) => {
  const history = useHistory();
  const { companies } = useAppContext();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<IOptions[]>([]);
  const [vehicles, setVehicles] = useState<IOptions[]>([]);
  const arrayTypeExpensesRequiredUser = [5, 11, 13];
  const arrayTypeExpensesRequiredVehicle = [12];

  useEffect(() => {
    const typePath = getType();
    setPath(typePath);
    if (typePath == appRoutes.shopping) dispatch({ expenseTypeId: 1 });
    onLoad(typePath);
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.expenses}/${id}`);
      dispatch({
        ...resp.data,
        value: formatValueWhithDecimalCaseOnChange(resp.data?.value),
        amount: formatValueWhithDecimalCaseOnChange(resp.data?.amount)
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const onLoad = async (typePath: string) => {
    try {
      setLoading(true);
      const respUser = await api.get(`${apiRoutes.users}/all`, {
        type: typePath == appRoutes.expenses ? userType.USER : userType.SUPPLIER
      });
      setUsers(respUser.data);

      if (typePath == appRoutes.expenses) {
        const respEpensesTypes = await api.get(apiRoutes.expenseTypes);
        setExpenseTypes(respEpensesTypes.data);

        const respVehicles = await api.get(`${apiRoutes.vehicles}/all`);
        setVehicles(respVehicles.data);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.value || !state.expenseTypeId) {
        notification.warning({
          message: 'Existem campos obrigatórios não preenchidos'
        });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.expenses, {
        ...state,
        value: priceToNumber(state.value),
        amount: priceToNumber(state.amount),
        userId: arrayTypeExpensesRequiredUser.includes(state.expenseTypeId)
          ? state.userId
          : null,
        vehicleId: arrayTypeExpensesRequiredVehicle.includes(
          state.expenseTypeId
        )
          ? state.vehicleId
          : null,
        supplierId: path == appRoutes.shopping ? state.supplierId : null
      });

      setLoading(false);

      result.success && history.push(`/${path}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Nova'} ${getTitle(
        path
      ).toLocaleLowerCase()}`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={24} md={24} sm={24} xs={24}>
        <Input
          label={'Título'}
          value={state.title}
          onChange={(e) => dispatch({ title: e.target.value })}
        />
      </Col>
      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Descrição'}
          value={state.description}
          onChange={(e) => dispatch({ description: e.target.value })}
        />
      </Col>
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

      <Col lg={8} md={8} sm={12} xs={24}>
        <DatePicker
          label={'Data de pagamento'}
          value={state.paymentDate}
          onChange={(paymentDate) => dispatch({ paymentDate })}
        />
      </Col>
      {path == appRoutes.shopping && (
        <>
          <Col lg={8} md={8} sm={24} xs={24}>
            <Select
              label={'Fornecedor'}
              options={users}
              value={state.supplierId}
              onChange={(supplierId) => dispatch({ supplierId })}
            />
          </Col>
          <Col lg={8} md={8} sm={24} xs={24}>
            <Select
              label={'Forma de PGTO'}
              options={paymentMethods}
              value={state.paymentMethod}
              onChange={(paymentMethod) => dispatch({ paymentMethod })}
            />
          </Col>
          <Col lg={8} md={8} sm={12} xs={24}>
            <Input
              label={'Quantidade'}
              type={'tel'}
              placeholder="15,00"
              value={state.amount}
              onChange={(e) =>
                dispatch({
                  amount: formatValueWhithDecimalCaseOnChange(e.target.value)
                })
              }
            />
          </Col>
        </>
      )}
      {path == appRoutes.expenses && (
        <>
          <Col lg={8} md={8} sm={24} xs={24}>
            <Select
              label={'Tipo'}
              options={expenseTypes}
              value={state.expenseTypeId}
              onChange={(expenseTypeId) => dispatch({ expenseTypeId })}
            />
          </Col>
          {arrayTypeExpensesRequiredUser.includes(state.expenseTypeId) && (
            <Col lg={8} md={8} sm={24} xs={24}>
              <Select
                label={'Consultor'}
                options={users}
                value={state.userId}
                onChange={(userId) => dispatch({ userId })}
              />
            </Col>
          )}
          {arrayTypeExpensesRequiredVehicle.includes(state.expenseTypeId) && (
            <Col lg={8} md={8} sm={24} xs={24}>
              <Select
                label={'Veiculo'}
                options={vehicles}
                value={state.vehicleId}
                onChange={(vehicleId) => dispatch({ vehicleId })}
              />
            </Col>
          )}
        </>
      )}

      {type === 'create' && (
        <Col lg={5} md={12} sm={12} xs={24}>
          <Input
            label={'Dividido em'}
            required={true}
            type={'number'}
            placeholder=""
            value={state.dividedIn}
            onChange={(e) => dispatch({ dividedIn: e.target.value })}
          />
        </Col>
      )}
      <Col lg={3} md={8} sm={12} xs={24}>
        <Switch
          label={'Paga'}
          title="Não / Sim"
          checked={state.paidOut}
          checkedChildren="Sim"
          unCheckedChildren="Não"
          onChange={() => dispatch({ paidOut: !state.paidOut })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
