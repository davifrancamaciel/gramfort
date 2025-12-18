import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, notification, Row } from 'antd';
import { Input, Select, Switch, Textarea } from 'components/_inputs';
import PanelCrud from 'components/PanelCrud';
import {
  apiRoutes,
  appRoutes,
  productCategoriesEnum,
  roules,
  userType
} from 'utils/defaultValues';
import useFormState from 'hooks/useFormState';
import { calcInput, getCost, initialStateForm } from '../interfaces';
import api from 'services/api-aws-amplify';
import ShowByRoule from 'components/ShowByRoule';
import { formatNumberWhithDecimalCaseOnChange } from 'utils/formatPrice';
import { useAppContext } from 'hooks/contextLib';

const CreateEdit: React.FC = (props: any) => {
  const { companies } = useAppContext();
  const history = useHistory();
  const { state, dispatch } = useFormState(initialStateForm);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const product = { ...state, price: Number(state.price) };

    const cost = getCost(product);
    dispatch({ cost });
  }, [state.inventoryCount, state.price]);

  useEffect(() => {
    const { totalTank, totalM2 } = calcInput(state);
    dispatch({ totalTank, totalM2 });
  }, [state.kgPerTank, state.m2PerTank, state.bag, state.inventoryCount]);

  useEffect(() => {
    props.match.params.id && get(props.match.params.id);
    props.match.params.id ? setType('update') : setType('create');
  }, [props.match.params.id]); // eslint-disable-line

  const get = async (id: string) => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.products}/${id}`);
      dispatch({
        ...resp.data,
        price: formatNumberWhithDecimalCaseOnChange(resp.data?.price || 0)
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const action = async () => {
    try {
      if (!state.name || !state.price) {
        const message = 'Existem campos obrigatórios não preenchidos';
        notification.warning({ message });
        return;
      }
      setLoading(true);
      const method = type === 'update' ? 'put' : 'post';
      const result = await api[method](apiRoutes.products, state);
      setLoading(false);

      result.success && history.push(`/${appRoutes.products}`);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <PanelCrud
      title={`${type === 'update' ? 'Editar' : 'Novo'} produto`}
      type={type}
      onClickActionButton={action}
      loadingBtnAction={false}
      loadingPanel={loading}
    >
      <Col lg={24} md={24} sm={24} xs={24}>
        <Row gutter={[16, 24]}>
          <ShowByRoule roule={roules.administrator}>
            <Col lg={6} md={12} sm={24} xs={24}>
              <Select
                label={'Empresa'}
                options={companies}
                value={state.companyId}
                onChange={(companyId) => dispatch({ companyId })}
              />
            </Col>
          </ShowByRoule>

          <Col lg={6} md={12} sm={24} xs={24}>
            <Select
              label={'Categoria'}
              url={`${apiRoutes.categories}/all`}
              value={state.categoryId}
              onChange={(categoryId) => dispatch({ categoryId })}
            />
          </Col>

          <Col lg={12} md={12} sm={24} xs={24}>
            <Input
              label={'Nome do produto'}
              required={true}
              placeholder="Bola"
              value={state.name}
              onChange={(e) => dispatch({ name: e.target.value })}
            />
          </Col>

          <Col lg={6} md={12} sm={24} xs={24}>
            <Input
              label={'Preço'}
              required={true}
              type={'tel'}
              placeholder="15.00"
              value={state.price}
              onChange={(e) =>
                dispatch({
                  price: formatNumberWhithDecimalCaseOnChange(e.target.value)
                })
              }
            />
          </Col>

          {state.categoryId === productCategoriesEnum.INSUMO && (
            <>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input
                  label={'Estoque'}
                  type={'number'}
                  placeholder="1"
                  value={state.inventoryCount}
                  onChange={(e) => dispatch({ inventoryCount: e.target.value })}
                />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input label={'Custo'} disabled={true} value={state.cost} />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input
                  label={'KG por tanque'}
                  placeholder="15"
                  type={'number'}
                  value={state.kgPerTank}
                  onChange={(e) =>
                    dispatch({
                      kgPerTank: e.target.value
                    })
                  }
                />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input
                  label={'Sacaria'}
                  type={'number'}
                  placeholder="15"
                  value={state.bag}
                  onChange={(e) =>
                    dispatch({
                      bag: e.target.value
                    })
                  }
                />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input
                  label={'M2 por tanque'}
                  type={'number'}
                  placeholder="15"
                  value={state.m2PerTank}
                  onChange={(e) =>
                    dispatch({
                      m2PerTank: e.target.value
                    })
                  }
                />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input
                  label={'Total tanque'}
                  disabled={true}
                  value={state.totalTank}
                />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Input
                  label={'Total m2'}
                  disabled={true}
                  value={state.totalM2}
                />
              </Col>
              <Col lg={6} md={12} sm={24} xs={24}>
                <Select
                  label={'Fornecedor'}
                  url={`${apiRoutes.users}/all?type=${userType.SUPPLIER}`}
                  value={state.supplierId}
                  onChange={(supplierId) => dispatch({ supplierId })}
                />
              </Col>
            </>
          )}

          <Col lg={6} md={12} sm={24} xs={24}>
            <Switch
              label={'Ativo'}
              title="Inativo / Ativo"
              checked={state.active}
              checkedChildren="Ativo"
              unCheckedChildren="Inativo"
              onChange={() => dispatch({ active: !state.active })}
            />
          </Col>
        </Row>
      </Col>

      <Col lg={24} md={24} sm={24} xs={24}>
        <Textarea
          label={'Descrição'}
          value={state.description}
          onChange={(e) => dispatch({ description: e.target.value })}
        />
      </Col>
    </PanelCrud>
  );
};

export default CreateEdit;
