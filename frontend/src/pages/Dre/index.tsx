import React, { useEffect, useState } from 'react';
import { systemColors } from 'utils/defaultValues';

import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';

import FastFilter from 'components/FastFilter';
import { Filter, initialState } from '../Dashboard/Cards/interfaces';
import { Col, Row, Card } from 'antd';
import GridList from 'components/GridList';
import { arrayMonth } from '../User/utils';
import { IOptions } from '../../utils/commonInterfaces';
import { groupBy } from 'utils';
import { DreGrigResult, DreTotals, DreTotalsResult } from './interfaces';

const Dre: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<Filter>(initialState);
  const [items, setItems] = useState<Array<DreGrigResult>>([]);

  useEffect(() => {
    const { date, companyId } = state;
    action(date, companyId);
  }, [state]);

  const action = async (date: Date, companyId?: string) => {
    try {
      setLoading(true);
      const resp = await api.get(apiRoutes.dre, {
        dateReference: date.toISOString(),
        companyId: companyId ? companyId : ''
      });

      const itemsFormatted = createPropCols(resp.data);

      setItems(itemsFormatted);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const createPropCols = (data: DreTotalsResult) => {
    let arrayItems: Array<DreGrigResult> = [];

    const expenses: Array<DreTotals> = groupBy(data.expenses, 'name');
    expenses.map((array: any) => arrayItems.push(createObjGrid(array)));

    const visits: Array<DreTotals> = groupBy(data.visits, 'name');
    visits.map((array: any) => arrayItems.push(createObjGrid(array)));

    return arrayItems;
  };

  const filterValue = (items: Array<DreTotals>, month: number) => {
    const item = items.find((x: DreTotals) => x.month === month);
    return item ? formatPrice(item.total) : '';
  };

  const createObjGrid = (arrayGroup: Array<DreTotals>): DreGrigResult => {
    const item: DreGrigResult = {
      name: arrayGroup[0].name,
      acc: formatPrice(sum(arrayGroup)),
      month1: filterValue(arrayGroup, 1),
      month2: filterValue(arrayGroup, 2),
      month3: filterValue(arrayGroup, 3),
      month4: filterValue(arrayGroup, 4),
      month5: filterValue(arrayGroup, 5),
      month6: filterValue(arrayGroup, 6),
      month7: filterValue(arrayGroup, 7),
      month8: filterValue(arrayGroup, 8),
      month9: filterValue(arrayGroup, 9),
      month10: filterValue(arrayGroup, 10),
      month11: filterValue(arrayGroup, 11),
      month12: filterValue(arrayGroup, 12)
    };
    return item;
  };

  const sum = (items: DreTotals[]) => {
    const value = items
      .filter((p: DreTotals) => p.total)
      .reduce((acc: number, p: DreTotals) => acc + Number(p.total), 0);
    return value ? value : 0;
  };

  const getColls = () => {
    let arrayCols = [];
    arrayCols.push({ title: '', dataIndex: `name` });
    arrayCols.push({ title: 'ACUMULADO', dataIndex: `acc` });

    arrayMonth.map((item: IOptions) =>
      arrayCols.push({ title: item.label, dataIndex: `month${item.value}` })
    );

    return arrayCols;
  };

  return (
    <div>
      <FastFilter state={state} setState={setState} type={'YEAR'} />
      <Row style={{ width: '100%', marginTop: '30px' }}>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Card
            title={`DRE - DEMONSTRATIVO DE EXERCÍCIO ANUAL`}
            bordered={false}
          >
            <GridList
              size="small"
              scroll={{ x: 840 }}
              columns={getColls()}
              dataSource={items}
              totalRecords={items.length}
              pageSize={items.length}
              loading={loading}
              routes={{}}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dre;
