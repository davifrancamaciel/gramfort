import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import {
  DownloadOutlined,
  DownOutlined,
  PrinterOutlined
} from '@ant-design/icons';

import { useAppContext } from 'hooks/contextLib';
import { systemColors } from 'utils/defaultValues';

import Export from './Export';
import PrintAll from './PrintAll';

interface PropTypes {
  state: any;
}

const Actions: React.FC<PropTypes> = ({ state }) => {
  const { loading } = useAppContext();

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<PrinterOutlined />}>
        <PrintAll state={state} />
      </Menu.Item>

      <Menu.Item key="2" icon={<DownloadOutlined />}>
        <Export state={state} />
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
      <Button
        style={{ background: systemColors.YELLOW, color: '#fff' }}
        loading={loading}
      >
        Ações <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default Actions;
