import React, { useEffect, useState } from 'react';

import {
  arrayCashWithdrawal,
  arrayExpenses,
  arrayImpostos,
  arrayInput,
  arrayInvestment
} from 'utils/defaultValues';

import {
  DataDreResult,
  DreGrigResult,
  DreTotals,
  DreTotalsResult,
  typeDataDreEnum,
  typeItemEnum,
  typeLayoutDreEnum
} from '../interfaces';

import Table from '../Table';
import { getPercentLine, mapData, parseNegative } from '../utils';

interface PropTypes {
  data: DataDreResult;
  setPrint: (table: any) => void;
  year: number;
}

const Simplified: React.FC<PropTypes> = (props) => {
  const [items, setItems] = useState<Array<DreGrigResult>>([]);

  useEffect(() => {
    if (props.data) {
      const items = createPropColsSimplified(props.data);
      setItems(items);
      props.setPrint(createTable(items));
    }
  }, [props.data]);

  const createPropColsSimplified = (data: DreTotalsResult) => {
    const arrayGroup = [...data.sales, ...data.visits];
    const faturamentoBruto = mapData(arrayGroup, typeItemEnum.PRICE);

    const applications = mapData(data.applications, typeItemEnum.NUMBER);
    const m2 = mapData(data.m2, typeItemEnum.NUMBER);
    const dataCosts: Array<DreTotals> = data.sales.map((item: any) => ({
      ...item,
      total: Number(item.totalCost) * -1,
      name: typeDataDreEnum.INSUMOS
    }));

    const costs = mapData(dataCosts, typeItemEnum.PRICE);

    const arrayGroupBalances = [...data.sales, ...data.visits, ...dataCosts];
    const dataBalances: Array<DreTotals> = arrayGroupBalances.map(
      (item: DreTotals) => ({
        ...item,
        name: typeDataDreEnum.MARGEM_BRUTA
      })
    );
    const balances = mapData(dataBalances, typeItemEnum.PRICE);

    const arrExpemenses = [...arrayExpenses, ...arrayImpostos];
    const dataExpensesFiltered = data.expenses.filter(
      (x: DreTotals) => !arrExpemenses.includes(x.expenseTypeId)
    );

    const dataExpenses = parseNegative(
      dataExpensesFiltered,
      typeDataDreEnum.DESPESAS
    );
    const expenses = mapData(dataExpenses, typeItemEnum.PRICE);

    const arrayGroupEbitda = [...arrayGroupBalances, ...dataExpenses];
    const dataEbitda: Array<DreTotals> = arrayGroupEbitda.map(
      (item: DreTotals) => ({
        ...item,
        name: typeDataDreEnum.EBITDA
      })
    );
    const ebitda = mapData(dataEbitda, typeItemEnum.PRICE);

    const dataImpostosFiltered = data.expenses.filter((x: DreTotals) =>
      arrayImpostos.includes(x.expenseTypeId)
    );
    const dataImpostos = parseNegative(
      dataImpostosFiltered,
      typeDataDreEnum.IMPOSTOS
    );
    const impostos = mapData(dataImpostos, typeItemEnum.PRICE);

    const arrayGroupLiquido = [...arrayGroupEbitda, ...dataImpostos];
    const dataLiquido: Array<DreTotals> = arrayGroupLiquido.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total),
        name: typeDataDreEnum.LIQUIDO
      })
    );

    const liquido = mapData(dataLiquido, typeItemEnum.PRICE);

    const dataInvestmentFiltered = data.expenses.filter((x: DreTotals) =>
      arrayInvestment.includes(x.expenseTypeId)
    );
    const dataInvestment = parseNegative(
      dataInvestmentFiltered,
      typeDataDreEnum.INVESTIMENTOS
    );
    const investment = mapData(dataInvestment, typeItemEnum.PRICE);

    const dataCashWithdrawalFiltered = data.expenses.filter((x: DreTotals) =>
      arrayCashWithdrawal.includes(x.expenseTypeId)
    );
    const dataCashWithdrawal = parseNegative(
      dataCashWithdrawalFiltered,
      typeDataDreEnum.RETIRADAS
    );
    const cashWithdrawal = mapData(dataCashWithdrawal, typeItemEnum.PRICE);

    const dataInputExpenseFiltered = data.expenses.filter((x: DreTotals) =>
      arrayInput.includes(x.expenseTypeId)
    );

    const dataInputExpense = parseNegative(
      dataInputExpenseFiltered,
      typeDataDreEnum.PGTO_INSUMO
    );
    const inputExpense = mapData(dataInputExpense, typeItemEnum.PRICE);

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
    const box = mapData(dataBox, typeItemEnum.PRICE);
    const blank = mapData(
      [{ name: typeDataDreEnum.BLANK, acc: '' } as DreGrigResult],
      typeItemEnum.TEXT
    );
    const percentMargen = getPercentLine(balances, faturamentoBruto);
    const percentFaturament = getPercentLine(ebitda, faturamentoBruto);
    const percentLiquido = getPercentLine(liquido, faturamentoBruto);

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

  const createTable = (items: DreGrigResult[]) => {
    return (
      <Table
        items={items}
        type={typeLayoutDreEnum.SIMPLIFIED}
        year={props.year}
      />
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'scroll'
      }}
    >
      {createTable(items)}
    </div>
  );
};

export default Simplified;
