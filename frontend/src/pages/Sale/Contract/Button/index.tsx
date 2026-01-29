import React, { useState } from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import useFormState from 'hooks/useFormState';

import PrintContainer from 'components/Report/PrintContainer';

import { initialStateForm, Sale, SaleProduct } from 'pages/Sale/interfaces';
import api from 'services/api-aws-amplify';
import {
  apiRoutes,
  categorIdsArrayProduct,
  systemColors
} from 'utils/defaultValues';

import Table from '../Table';
import { Button } from 'antd';
import { getFileName } from '../../utils';

interface PropTypes {
  id: string;
}

const ContractButton: React.FC<PropTypes> = ({ id }) => {
  const { state, dispatch } = useFormState(initialStateForm);
  const [loading, setLoading] = useState(false);
  const [print, setPrint] = useState(false);

  const get = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`${apiRoutes.sales}/${id}`);
      const productsList = resp.data?.productsSales as SaleProduct[];
      const products = productsList.filter((p: SaleProduct) =>
        categorIdsArrayProduct.includes(p.product.categoryId || 0)
      );

      dispatch({ ...resp.data, products });

      setLoading(false);
      setPrint(true);
      setPrint(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  return (
    <>
      <Button
        style={{ backgroundColor: systemColors.LIGHT_GREY, color: '#fff' }}
        icon={<PrinterOutlined />}
        onClick={get}
        loading={loading}
      />
      <div style={{ display: 'none' }}>
        <PrintContainer
          show={true}
          key={'print'}
          filename={getFileName(state)}
          print={print}
        >
          <Table sale={state} />
        </PrintContainer>
      </div>
    </>
  );
};

export default ContractButton;
