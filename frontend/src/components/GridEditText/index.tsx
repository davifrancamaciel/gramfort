import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Input } from 'components/_inputs';
import api from 'services/api-aws-amplify';

interface PropTypes {
  propName: string;
  apiRoutes: string;
  item: any;
  setUpdate: (items: any) => void;
  setLoading: (loading: boolean) => void;
}
const GridEditText: React.FC<PropTypes> = ({
  item,
  setUpdate,
  setLoading,
  apiRoutes,
  propName
}) => {
  const [enable, setEnable] = useState<boolean>();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    setValue(item[propName]);
  }, [item]);

  const action = async (event: any) => {
    try {
      event.preventDefault();
      if (!value) {
        notification.warning({
          message: 'Este campo é obrigatório'
        });
        return;
      }
      setLoading(true);

      let data = item;
      data[propName] = value;

      const result = await api['put'](apiRoutes, data);
      setLoading(false);
      setEnable(false);
      setUpdate(result.data);
    } catch (error) {
      setLoading(false);
    }
  };

  return enable ? (
    <form onSubmit={action}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ minWidth: '300px' }}
      />
    </form>
  ) : (
    <span onClick={() => setEnable(true)}>
      {value} <EditOutlined />
    </span>
  );
};

export default GridEditText;
