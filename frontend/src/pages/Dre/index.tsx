import React, { useEffect, useState } from 'react';

import api from 'services/api-aws-amplify';
import {
  apiRoutes,
  arrayCashWithdrawal,
  arrayExpenses,
  arrayImpostos,
  arrayInput,
  arrayInvestment
} from 'utils/defaultValues';

import FastFilter from 'components/FastFilter';
import { Filter, initialState } from '../Dashboard/Cards/interfaces';
import { Col, Row, Card } from 'antd';
import { groupBy } from 'utils';
import {
  DreGrigResult,
  DreTotals,
  DreTotalsResult,
  typeDataDreEnum,
  typeItemEnum
} from './interfaces';

import Table from './Table';
import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';
import { getPercent } from 'utils';
import { useAppContext } from 'hooks/contextLib';
import { Company } from '../Company/interfaces';
import { formatValue, getStyle, sum } from './utils';

const Dre: React.FC = () => {
  const { companies, userAuthenticated } = useAppContext();
  const { signInUserSession } = userAuthenticated;
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<Filter>(initialState);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [itemsSimplified, setItemsSimplified] = useState<Array<DreGrigResult>>(
    []
  );
  const [company, setCompany] = useState<Company>({} as Company);
  const [text, setText] = useState('');

  useEffect(() => {
    let companyId = signInUserSession.idToken.payload['custom:company_id'];
    if (state.companyId) {
      companyId = state.companyId;
      const currentName = companies.find(
        (c: Company) => c.id === companyId
      )?.name;

      setText(currentName);
    } else {
      const currentName = companies
        .filter((c: Company) => c.companiesIds?.includes(companyId))
        ?.map((c: Company) => c?.name)
        .join('-');

      setText(currentName);
    }
    const companyUser = companies.find((c: Company) => c.id === companyId);
    setCompany(companyUser);
  }, [companies, state.companyId]);

  useEffect(() => {
    const { date, companyId, _date } = state;
    if (_date) action(date, companyId);
  }, [state.date, state.companyId]);

  const action = async (date: Date, companyId?: string) => {
    try {
      setLoading(true);
      setItemsSimplified([]);
      setYear(date.getFullYear());
      const resp = await api.get(apiRoutes.dre, {
        dateReference: date.toISOString(),
        companyId: companyId ? companyId : ''
      });

      const itemsFormattedsimplified = createPropColsSimplified(resp.data);
      setItemsSimplified(itemsFormattedsimplified);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const createPropColsSimplified = (data: DreTotalsResult) => {
    const arrayGroup = [...data.sales, ...data.visits];
    const faturamentoBruto: Array<DreGrigResult> = mapData(
      arrayGroup,
      'name',
      typeItemEnum.PRICE
    );

    const applications: Array<DreGrigResult> = mapData(
      data.applications,
      'name',
      typeItemEnum.NUMBER
    );
    const m2: Array<DreGrigResult> = mapData(
      data.m2,
      'name',
      typeItemEnum.NUMBER
    );
    const dataCosts: Array<DreTotals> = data.sales.map((item: any) => ({
      ...item,
      total: Number(item.totalCost) * -1,
      name: typeDataDreEnum.INSUMOS
    }));
    const costs: Array<DreGrigResult> = mapData(
      dataCosts,
      'name',
      typeItemEnum.PRICE
    );

    const arrayGroupBalances = [...data.sales, ...data.visits, ...dataCosts];
    const dataBalances: Array<DreTotals> = arrayGroupBalances.map(
      (item: DreTotals) => ({
        ...item,
        name: typeDataDreEnum.MARGEM_BRUTA
      })
    );
    const balances: Array<DreGrigResult> = mapData(
      dataBalances,
      'name',
      typeItemEnum.PRICE
    );

    const arrExpemenses = [...arrayExpenses, ...arrayImpostos];
    const dataExpensesFiltered = data.expenses.filter(
      (x: DreTotals) => !arrExpemenses.includes(x.expenseTypeId)
    );
    const dataExpenses: Array<DreTotals> = dataExpensesFiltered.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: typeDataDreEnum.DESPESAS
      })
    );
    const expenses: Array<DreGrigResult> = mapData(
      dataExpenses,
      'name',
      typeItemEnum.PRICE
    );

    const arrayGroupEbitda = [...arrayGroupBalances, ...dataExpenses];
    const dataEbitda: Array<DreTotals> = arrayGroupEbitda.map(
      (item: DreTotals) => ({
        ...item,
        name: typeDataDreEnum.EBITDA
      })
    );
    const ebitda: Array<DreGrigResult> = mapData(
      dataEbitda,
      'name',
      typeItemEnum.PRICE
    );

    const dataImpostosFiltered = data.expenses.filter((x: DreTotals) =>
      arrayImpostos.includes(x.expenseTypeId)
    );
    const dataImpostos: Array<DreTotals> = dataImpostosFiltered.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: typeDataDreEnum.IMPOSTOS
      })
    );
    const impostos: Array<DreGrigResult> = mapData(
      dataImpostos,
      'name',
      typeItemEnum.PRICE
    );

    const arrayGroupLiquido = [...arrayGroupEbitda, ...dataImpostos];
    const dataLiquido: Array<DreTotals> = arrayGroupLiquido.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total),
        name: typeDataDreEnum.LIQUIDO
      })
    );

    const liquido: Array<DreGrigResult> = mapData(
      dataLiquido,
      'name',
      typeItemEnum.PRICE
    );

    const dataInvestmentFiltered = data.expenses.filter((x: DreTotals) =>
      arrayInvestment.includes(x.expenseTypeId)
    );
    const dataInvestment: Array<DreTotals> = dataInvestmentFiltered.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: typeDataDreEnum.INVESTIMENTOS
      })
    );
    const investment: Array<DreGrigResult> = mapData(
      dataInvestment,
      'name',
      typeItemEnum.PRICE
    );

    const dataCashWithdrawalFiltered = data.expenses.filter((x: DreTotals) =>
      arrayCashWithdrawal.includes(x.expenseTypeId)
    );
    const dataCashWithdrawal: Array<DreTotals> = dataCashWithdrawalFiltered.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: typeDataDreEnum.RETIRADAS
      })
    );
    const cashWithdrawal: Array<DreGrigResult> = mapData(
      dataCashWithdrawal,
      'name',
      typeItemEnum.PRICE
    );

    const dataInputExpenseFiltered = data.expenses.filter((x: DreTotals) =>
      arrayInput.includes(x.expenseTypeId)
    );
    const dataInputExpense: Array<DreTotals> = dataInputExpenseFiltered.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: typeDataDreEnum.PGTO_INSUMO
      })
    );
    const inputExpense: Array<DreGrigResult> = mapData(
      dataInputExpense,
      'name',
      typeItemEnum.PRICE
    );

    const arrayGroupBox = [
      ...dataLiquido,
      ...dataInvestment,
      ...dataCashWithdrawal,
      ...dataInputExpense
    ];
    const dataBox: Array<DreTotals> = arrayGroupBox.map((item: DreTotals) => ({
      ...item,
      name: typeDataDreEnum.SALDO
    }));
    const box: Array<DreGrigResult> = mapData(
      dataBox,
      'name',
      typeItemEnum.PRICE
    );
    const blank: Array<DreGrigResult> = mapData(
      [{ name: typeDataDreEnum.BLANK, acc: '' } as DreGrigResult],
      'name',
      typeItemEnum.TEXT
    );
    const percentMargen: Array<DreGrigResult> = getPercentLine(
      balances,
      faturamentoBruto
    );
    const percentFaturament: Array<DreGrigResult> = getPercentLine(
      ebitda,
      faturamentoBruto
    );
    const percentLiquido: Array<DreGrigResult> = getPercentLine(
      liquido,
      faturamentoBruto
    );

    return [
      ...faturamentoBruto,
      ...m2,
      ...applications,
      ...costs,
      ...balances,
      ...percentMargen,
      ...blank,
      ...expenses,
      ...ebitda,
      ...percentFaturament,
      ...blank,
      ...impostos,
      ...liquido,
      ...percentLiquido,
      ...blank,
      ...investment,
      ...cashWithdrawal,
      ...inputExpense,
      ...box
    ];
  };

  const mapData = (data: Array<any>, propGroup: string, type: string) => {
    let arrayItems: Array<DreGrigResult> = [];

    const items: Array<DreTotals> = groupBy(data, propGroup);
    items.map((array: any) => arrayItems.push(createObjGrid(array, type)));
    return arrayItems;
  };

  const createObjGrid = (
    arrayGroup: Array<DreTotals>,
    type: string
  ): DreGrigResult => {
    const item: DreGrigResult = {
      type: type,
      name: arrayGroup[0].name,
      style: getStyle(arrayGroup[0].name),
      acc: `${sum(arrayGroup)}`,
      month1: formatValue(arrayGroup, 1),
      month2: formatValue(arrayGroup, 2),
      month3: formatValue(arrayGroup, 3),
      month4: formatValue(arrayGroup, 4),
      month5: formatValue(arrayGroup, 5),
      month6: formatValue(arrayGroup, 6),
      month7: formatValue(arrayGroup, 7),
      month8: formatValue(arrayGroup, 8),
      month9: formatValue(arrayGroup, 9),
      month10: formatValue(arrayGroup, 10),
      month11: formatValue(arrayGroup, 11),
      month12: formatValue(arrayGroup, 12)
    };
    return item;
  };

  const getPercentLine = (array1: DreGrigResult[], array2: DreGrigResult[]) => {
    const [first] = array1;
    const [second] = array2;
    let acc: Array<DreTotals> = [];
    const getPercentFormatted = (value1?: string, value2?: string) => {
      const value = getPercent(Number(value1), Number(value2));
      if (value) {
        acc.push({ total: Number(value) } as DreTotals);
      }
      return value;
    };

    let item = {
      name: typeDataDreEnum.PERCENT,
      month1: getPercentFormatted(first.month1, second.month1),
      month2: getPercentFormatted(first.month2, second.month2),
      month3: getPercentFormatted(first.month3, second.month3),
      month4: getPercentFormatted(first.month4, second.month4),
      month5: getPercentFormatted(first.month5, second.month5),
      month6: getPercentFormatted(first.month6, second.month6),
      month7: getPercentFormatted(first.month7, second.month7),
      month8: getPercentFormatted(first.month8, second.month8),
      month9: getPercentFormatted(first.month9, second.month9),
      month10: getPercentFormatted(first.month10, second.month10),
      month11: getPercentFormatted(first.month11, second.month11),
      month12: getPercentFormatted(first.month12, second.month12),
      type: typeItemEnum.PERCENT,
      style: getStyle(typeDataDreEnum.PERCENT)
    } as DreGrigResult;

    const value = sum(acc) / acc.length;
    item.acc = `${parseFloat(value.toString()).toFixed(2)}`;

    const percent: Array<DreGrigResult> = [item];
    return percent;
  };

  return (
    <div>
      <FastFilter state={state} setState={setState} type={'YEAR'} />
      <Row style={{ width: '100%', marginTop: '30px' }}>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Card
            title={`DRE - EXERCICIO-${year} ${text}`}
            bordered={false}
            loading={loading}
            extra={
              <PrintContainer
                show={true}
                filename={`DRE-SIMPLIFICADO-${year} ${text}`}
              >
                <TableReport
                  title={company?.fantasyName || ''}
                  image={company?.image || ''}
                  subTitle={`EXERCICIO ${year} ${text}`}
                >
                  <Table
                    items={itemsSimplified}
                    type={'SIMPLIFICADO'}
                    year={year}
                  />
                </TableReport>
              </PrintContainer>
            }
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                overflowX: 'scroll'
              }}
            >
              <Table
                items={itemsSimplified}
                type={'SIMPLIFICADO'}
                year={year}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dre;
