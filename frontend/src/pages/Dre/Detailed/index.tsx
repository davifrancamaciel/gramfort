import React, { useEffect, useState } from 'react';

import {
  arrayCashWithdrawal,
  arrayExpenses,
  arrayImpostos,
  arrayInput,
  arrayInvestment,
  arrayMarketing
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
import { Company } from 'pages/Company/interfaces';

interface PropTypes {
  data: DataDreResult;
  setPrint: (table: any) => void;
  year: number;
  company: Company;
}

const Detailed: React.FC<PropTypes> = (props) => {
  const [items, setItems] = useState<Array<DreGrigResult>>([]);

  useEffect(() => {
    if (props.data) {
      const items = createPropCols(props.data);
      setItems(items);
      props.setPrint(createTable(items));
    }
  }, [props.data]);

  const createPropCols = (data: DreTotalsResult) => {
    const arrayAllContractsAndSales = [...data.sales, ...data.contracts];
    const arrayGroup = [...data.sales, ...data.visits];
    const faturamentoBruto = mapData(arrayGroup, typeItemEnum.PRICE);
    const funilTitle = lineText(typeDataDreEnum.FUNIL);
    const dataCountVisits: Array<DreGrigResult> = data.visits.map(
      (item: any) => ({
        ...item,
        total: item.count,
        name: 'Visitas'
      })
    );
    const countVisits = mapData(dataCountVisits, typeItemEnum.NUMBER);
    const dataCountContracs: Array<DreGrigResult> =
      arrayAllContractsAndSales.map((item: any) => ({
        ...item,
        total: item.count,
        name: 'Propostas'
      }));
    const countContracts = mapData(dataCountContracs, typeItemEnum.NUMBER);
    const dataCountSales: Array<DreGrigResult> = data.sales.map(
      (item: any) => ({
        ...item,
        total: item.count,
        name: 'Vendas'
      })
    );
    const countSales = mapData(dataCountSales, typeItemEnum.NUMBER);
    const percentContractXSales = getPercentLine(
      countSales,
      countContracts,
      '% conver'
    );

    const indicatorsTitle = lineText(typeDataDreEnum.INDICADORES);
    const contracts = mapData(
      arrayAllContractsAndSales.map((x: DreTotals) => ({
        ...x,
        name: 'Propostas'
      })),
      typeItemEnum.PRICE
    );
    const faturamentoVisits = mapData(
      data.visits.map((x: DreTotals) => ({ ...x, name: 'Fat visitas' })),
      typeItemEnum.PRICE
    );
    const dataKmVisits: Array<DreGrigResult> = data.visits.map((item: any) => ({
      ...item,
      total: item.km,
      name: typeDataDreEnum.KM_VISITAS
    }));
    const kmsVisits = mapData(dataKmVisits, typeItemEnum.NUMBER);
    const dataTiketmed: Array<DreGrigResult> = data.sales.map((item: any) => ({
      ...item,
      total: Number(item.total) / Number(item.count),
      name: 'Ticket Méd'
    }));
    const tiketmed = mapData(dataTiketmed, typeItemEnum.PRICE);
    const dataValueM2med: Array<DreGrigResult> = data.sales.map(
      (item: any) => ({
        ...item,
        total: Number(item.valuePerMeter) / Number(item.count),
        name: typeDataDreEnum.PRICE_MED_M2
      })
    );
    const valueM2med = mapData(dataValueM2med, typeItemEnum.PRICE);

    const indicatorsOpTitle = lineText(typeDataDreEnum.INDICADORES_OP);
    const applications = mapData(data.applications, typeItemEnum.NUMBER);
    const m2 = mapData(data.m2, typeItemEnum.NUMBER);
    const dataLiters: Array<DreGrigResult> = data.m2.map((item: any) => ({
      ...item,
      total: ((item.total / props.company.sizeTank!) * 2000).toFixed(2),
      name: typeDataDreEnum.LITERS
    }));
    const liters = mapData(dataLiters, typeItemEnum.NUMBER);

    const dataKgInput: Array<DreGrigResult> = data.applications.map(
      (item: any) => ({
        ...item,
        total: (item.total * Number(props.company.kgInputPerTank)).toFixed(2),
        name: 'Kg insumos'
      })
    );
    const kgInput = mapData(dataKgInput, typeItemEnum.NUMBER);
    const dataKgSeed: Array<DreGrigResult> = data.applications.map(
      (item: any) => ({
        ...item,
        total: (item.total * Number(props.company.kgSeedPerTank)).toFixed(2),
        name: 'Kg sementes'
      })
    );
    const kgSeed = mapData(dataKgSeed, typeItemEnum.NUMBER);
    const dataKgDiscart: Array<DreGrigResult> = data.applications.map(
      (item: any) => ({
        ...item,
        total: (item.total * Number(props.company.kgDiscartPerTank)).toFixed(2),
        name: 'Kg Reciclados'
      })
    );
    const kgDiscart = mapData(dataKgDiscart, typeItemEnum.NUMBER);

    const dataCosts: Array<DreTotals> = data.sales.map((item: any) => ({
      ...item,
      total: Number(item.totalCost) * -1,
      name: typeDataDreEnum.INSUMOS
    }));
    const costs = mapData(dataCosts, typeItemEnum.PRICE);
    const percentCost = getPercentLine(costs, faturamentoBruto);

    const arrayGroupBalances = [...data.sales, ...data.visits, ...dataCosts];
    const dataBalances: Array<DreTotals> = arrayGroupBalances.map(
      (item: DreTotals) => ({ ...item, name: typeDataDreEnum.MARGEM_BRUTA })
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

    const arrExpemensesNoMarketing = [
      ...arrayExpenses,
      ...arrayImpostos,
      ...arrayMarketing
    ];
    const dataExpensesDetailsNoMarketingFiltered = data.expenses.filter(
      (x: DreTotals) => !arrExpemensesNoMarketing.includes(x.expenseTypeId)
    );
    const dataExpensesNoMarketingDetail: Array<DreTotals> =
      dataExpensesDetailsNoMarketingFiltered.map((item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: item.description ? item.description.split('(')[0] : item.name
      }));
    const expensesTitle = lineText(typeDataDreEnum.DESPESAS_OP);
    const expensesNoMarketingDetail = mapData(
      dataExpensesNoMarketingDetail,
      typeItemEnum.PRICE
    );

    const dataExpensesDetailsYesMarketingFiltered = data.expenses.filter(
      (x: DreTotals) => arrayMarketing.includes(x.expenseTypeId)
    );
    const dataExpensesYesMarketingTotal = parseNegative(
      dataExpensesDetailsYesMarketingFiltered,
      typeDataDreEnum.MARKETING
    );

    const expensesYesMarketingTotal = mapData(
      dataExpensesYesMarketingTotal,
      typeItemEnum.PRICE
    );
    const percentExpensesYesMarketingTotal = getPercentLine(
      expensesYesMarketingTotal,
      faturamentoBruto
    );

    const dataExpensesYesMarketingDetail: Array<DreTotals> =
      dataExpensesDetailsYesMarketingFiltered.map((item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: item.description ? item.description.split('(')[0] : item.name
      }));

    const expensesYesMarketingDetail = mapData(
      dataExpensesYesMarketingDetail,
      typeItemEnum.PRICE
    );

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

    const dataImpostosDetail: Array<DreTotals> = dataImpostosFiltered.map(
      (item: DreTotals) => ({
        ...item,
        total: Number(item.total) * -1,
        name: item.description ? item.description.split('(')[0] : item.name
      })
    );

    const impostosDetail = mapData(dataImpostosDetail, typeItemEnum.PRICE);

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

    const investmentTitle = lineText(typeDataDreEnum.PGTO_ADICIONAIS);
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
    const blank = lineText(typeDataDreEnum.BLANK);
    const percentMargen = getPercentLine(balances, faturamentoBruto);
    const percentFaturament = getPercentLine(ebitda, faturamentoBruto);
    const percentLiquido = getPercentLine(liquido, faturamentoBruto);
    const percentExpense = getPercentLine(expenses, faturamentoBruto);

    return [
      ...faturamentoBruto,
      ...blank,
      ...funilTitle,
      ...countVisits,
      ...countContracts,
      ...countSales,
      ...percentContractXSales,
      ...blank,
      ...indicatorsTitle,
      ...contracts,
      ...faturamentoVisits,
      ...kmsVisits,
      ...tiketmed,
      ...valueM2med,
      ...blank,
      ...indicatorsOpTitle,
      ...m2,
      ...applications,
      ...kgInput,
      ...kgSeed,
      ...liters,
      ...kgDiscart,
      ...blank,
      ...costs,
      ...percentCost,
      ...blank,
      ...balances,
      ...percentMargen,
      ...blank,
      ...expenses,
      ...percentExpense,
      ...blank,
      ...expensesTitle,
      ...expensesNoMarketingDetail,
      ...blank,
      ...expensesYesMarketingTotal,
      ...percentExpensesYesMarketingTotal,
      ...expensesYesMarketingDetail,
      ...blank,
      ...ebitda,
      ...percentFaturament,
      ...blank,
      ...impostos,
      ...impostosDetail,
      ...blank,
      ...liquido,
      ...percentLiquido,
      ...blank,
      ...investmentTitle,
      ...investment,
      ...cashWithdrawal,
      ...inputExpense,
      ...box
    ];
  };

  const lineText = (name: string): Array<DreGrigResult> => {
    const line: Array<DreGrigResult> = mapData(
      [{ name } as DreGrigResult],
      typeItemEnum.TEXT
    );
    return line;
  };

  const createTable = (items: DreGrigResult[]) => {
    return (
      <Table
        items={items}
        type={typeLayoutDreEnum.DEATAILED}
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

export default Detailed;
