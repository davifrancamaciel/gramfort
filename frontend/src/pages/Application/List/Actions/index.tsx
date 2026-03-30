import React, { useState } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import api from 'services/api-aws-amplify';
import {
  DownloadOutlined,
  DownOutlined,
  PrinterOutlined
} from '@ant-design/icons';

import { formatDate, formatDateHour } from 'utils/formatDate';
import { useAppContext } from 'hooks/contextLib';
import { systemColors, apiRoutes } from 'utils/defaultValues';

import Export from './Export';
import PrintAll from './PrintAll';
import { Application } from '../../interfaces';

interface PropTypes {
  state: any;
  title: string;
}

const Actions: React.FC<PropTypes> = ({ state, title }) => {
  const { loading, setLoading } = useAppContext();

  const [print, setPrint] = useState(false);
  const [items, setItems] = useState<Application[]>([]);

  const actionFilter = async (
    type: string,
    pageNumber: number = 1,
    itemsArray: Application[] = []
  ) => {
    try {
      setLoading(true);
      setPrint(false);

      const resp = await api.get(apiRoutes.applications, {
        ...state,
        pageNumber,
        pageSize: 500
      });

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Application) => ({
        ...item,
        clientName: item.client?.name,
        companyName: item.company?.name,
        userName: item.user?.name,
        createdAt: formatDateHour(item.createdAt),
        updatedAt: formatDateHour(item.updatedAt),
        date: formatDate(item.date)
      }));

      itemsArray = [...itemsArray, ...itemsFormatted];

      if (count > itemsArray.length) {
        const nextPage = pageNumber + 1;
        await actionFilter(type, nextPage, itemsArray);
      } else {
        setItems(itemsArray);
        setLoading(false);
        type === 'pdf' ? onCompletePrint() : onCompleteCsv();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setPrint(false);
    }
  };

  const onCompletePrint = () => setPrint(true);

  const onCompleteCsv = () => {
    const btn = document.getElementById('ghost-button');
    if (btn) {
      btn.click();
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<PrinterOutlined />}>
        <PrintAll
          actionFilter={actionFilter}
          items={items}
          print={print}
          title={title}
        />
      </Menu.Item>

      <Menu.Item key="2" icon={<DownloadOutlined />}>
        <Export actionFilter={actionFilter} items={items} title={title} />
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
