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
import {
  systemColors,
  apiRoutes,
  appRoutes,
  categorIdsArrayProduct
} from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';

import Export from './Export';
import PrintAll from './PrintAll';
import { Sale, SaleProduct } from '../../interfaces';
import { getBalance, getBalanceValue, getCostValue } from '../../utils';

interface PropTypes {
  state: any;
  title: string;
  path: string;
}

const Actions: React.FC<PropTypes> = ({ state, title, path }) => {
  const { loading, setLoading } = useAppContext();

  const [print, setPrint] = useState(false);
  const [items, setItems] = useState<Sale[]>([]);

  const actionFilter = async (
    type: string,
    pageNumber: number = 1,
    itemsArray: Sale[] = []
  ) => {
    try {
      setLoading(true);
      setPrint(false);

      const resp = await api.get(apiRoutes.sales, {
        ...state,
        pageNumber,
        pageSize: 500
      });

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Sale) => ({
        ...item,
        products: item.productsSales
          .filter((p: SaleProduct) =>
            categorIdsArrayProduct.includes(p.product.categoryId || 0)
          )
          .map(
            (sp: SaleProduct) =>
              `${sp.amount} ${sp.product.name} ${formatPrice(
                Number(sp.valueAmount! || 0)
              )}, `
          ),
        clientName: item.client?.name,
        companyName: item.company?.name,
        userName: item.user?.name,
        state: item.visit?.state,
        city: item.visit?.city,
        address: item.visit?.address,

        valueFormatted: formatPrice(Number(item.value) || 0),
        valueCostFormatted: formatPrice(
          getCostValue(item, path === appRoutes.sales)
        ),
        cost: getCostValue(item, path === appRoutes.sales),
        balanceFormatted: getBalance(item, path === appRoutes.sales),
        balance: getBalanceValue(item, path === appRoutes.sales),

        saleDate: formatDate(item.saleDate),
        createdAt: formatDateHour(item.createdAt),
        updatedAt: formatDateHour(item.updatedAt),
        expectedDateForApplication: formatDate(item.expectedDateForApplication),

        approved: item.approved ? 'SIM' : 'NÃO',
        invoice: item.invoice ? 'SIM' : 'NÃO'
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
          path={path}
          state={state}
        />
      </Menu.Item>

      <Menu.Item key="2" icon={<DownloadOutlined />}>
        <Export
          actionFilter={actionFilter}
          items={items}
          title={title}
          path={path}
        />
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
