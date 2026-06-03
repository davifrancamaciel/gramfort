import React, { useEffect, useState } from 'react';

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
import { Container } from './styles';

const Dre: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<Filter>(initialState);
  const [items, setItems] = useState<Array<DreGrigResult>>([]);
  const [itemsSimplified, setItemsSimplified] = useState<Array<DreGrigResult>>(
    []
  );

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

      const itemsFormattedsimplified = createPropColsSimplified(resp.data);
      setItemsSimplified(itemsFormattedsimplified);

      const itemsFormatted = createPropCols(resp.data);
      setItems(itemsFormatted);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const createPropCols = (data: DreTotalsResult) => {
    const expenses: Array<DreGrigResult> = mapData(data.expenses, 'name');

    const visits: Array<DreGrigResult> = mapData(data.visits, 'name');

    return [...expenses, ...visits];
  };

  const createPropColsSimplified = (data: DreTotalsResult) => {
    const arrayGroup = [...data.sales, ...data.visits];
    const faturamentoBruto: Array<DreGrigResult> = mapData(arrayGroup, 'name');

    const applications: Array<DreGrigResult> = mapData(
      data.applications,
      'name',
      false
    );
    const m2: Array<DreGrigResult> = mapData(data.m2, 'name', false);
    const dataCosts: Array<DreTotals> = data.sales.map((item: any) => ({
      ...item,
      total: Number(item.totalCost) * -1,
      name: 'Insumos'
    }));
    const costs: Array<DreGrigResult> = mapData(dataCosts, 'name');

    const arrayGroupBalances = [...data.sales, ...data.visits, ...dataCosts];
    const dataBalances: Array<DreTotals> = arrayGroupBalances.map(
      (item: DreTotals) => ({
        ...item,
        name: 'M Bruta'
      })
    );

    const balances: Array<DreGrigResult> = mapData(dataBalances, 'name');

    return [...faturamentoBruto, ...m2, ...applications, ...costs, ...balances];
  };

  const mapData = (
    data: Array<any>,
    propGroup: string,
    format: boolean = true
  ) => {
    let arrayItems: Array<DreGrigResult> = [];

    const items: Array<DreTotals> = groupBy(data, propGroup);
    items.map((array: any) => arrayItems.push(createObjGrid(array, format)));
    return arrayItems;
  };

  const filterValue = (items: Array<DreTotals>, month: number) => {
    const item = items.filter((x: DreTotals) => x.month === month);
    return item ? sum(item) : 0;
  };

  const createObjGrid = (
    arrayGroup: Array<DreTotals>,
    format: boolean
  ): DreGrigResult => {
    const item: DreGrigResult = {
      name: arrayGroup[0].name,
      className: getClassName(arrayGroup[0].name),
      acc: format ? formatPrice(sum(arrayGroup)) : `${sum(arrayGroup)}`,
      month1: formatValue(arrayGroup, 1, format),
      month2: formatValue(arrayGroup, 2, format),
      month3: formatValue(arrayGroup, 3, format),
      month4: formatValue(arrayGroup, 4, format),
      month5: formatValue(arrayGroup, 5, format),
      month6: formatValue(arrayGroup, 6, format),
      month7: formatValue(arrayGroup, 7, format),
      month8: formatValue(arrayGroup, 8, format),
      month9: formatValue(arrayGroup, 9, format),
      month10: formatValue(arrayGroup, 10, format),
      month11: formatValue(arrayGroup, 11, format),
      month12: formatValue(arrayGroup, 12, format)
    };
    return item;
  };

  const getClassName = (name: string) => {
    switch (name) {
      case 'Fat Bruto':
        return 'blue';        
      case 'M Bruta':
      case 'EBITIDA':
        return 'green';
      case 'Insumos':
      case 'DESPESAS':
        return 'pink';
      default:
        return 'gray';
    }
  };


  const formatValue = (
    arrayGroup: Array<DreTotals>,
    month: number,
    format: boolean
  ) => {
    const value = filterValue(arrayGroup, month);
    if (!value) return '';
    return format ? formatPrice(value) : `${value}`;
  };

  const sum = (items: DreTotals[]) => {
    const value = items
      .filter((p: DreTotals) => p.total)
      .reduce((acc: number, p: DreTotals) => acc + Number(p.total), 0);
    return value ? value : 0;
  };

  const getColls = (title: string) => {
    let arrayCols = [];
    arrayCols.push({ title: title, dataIndex: `name` });
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
            <Container>
              <h2>SIMPLIFICADO</h2>
              <table>
                <thead>
                  <tr>
                    {getColls('SIMPLIFICADO').map((item: any) => (
                      <th key={item.dataIndex}>{item.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {itemsSimplified.map((item: DreGrigResult) => (
                    <tr key={item.name} className={item.className}>
                      <td>{item.name}</td>
                      <td>{item.acc}</td>
                      <td>{item.month1}</td>
                      <td>{item.month2}</td>
                      <td>{item.month3}</td>
                      <td>{item.month4}</td>
                      <td>{item.month5}</td>
                      <td>{item.month6}</td>
                      <td>{item.month7}</td>
                      <td>{item.month8}</td>
                      <td>{item.month9}</td>
                      <td>{item.month10}</td>
                      <td>{item.month11}</td>
                      <td>{item.month12}</td>
                    </tr>
                  ))}
                  {/* <tr className="faturamento">
                    <td>Fat Bruto (+)</td>
                    <td>100</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="neutro">
                    <td>M2 aplicados</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="neutro">
                    <td>Tanques Aplicados</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="custos">
                    <td>Insumos (-)</td>
                    <td>-20</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="resultado">
                    <td>#NOME?</td>
                    <td>80</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>% Em relação ao Faturamento</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr> */}

                  <tr className="despesas">
                    <td>Despesas (-)</td>
                    <td>-50</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="resultado">
                    <td>#NOME?</td>
                    <td>30</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>% Em relação ao Faturamento</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr className="impostos">
                    <td>Impostos (-)</td>
                    <td>-5</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="resultado">
                    <td>#NOME?</td>
                    <td>25</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>% Em relação ao Faturamento</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr className="neutro">
                    <td>Investimentos (-)</td>
                    <td>5</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="neutro">
                    <td>Retiradas (-)</td>
                    <td>3</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="neutro">
                    <td>Pgto Insumos (-)</td>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="resultado">
                    <td>#NOME?</td>
                    <td>15</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </Container>

            <GridList
              size="small"
              scroll={{ x: 840 }}
              columns={getColls('DETALHADO')}
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
