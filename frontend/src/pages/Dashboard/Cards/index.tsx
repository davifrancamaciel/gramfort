import React, { useEffect, useState } from 'react';
import {
  WarningOutlined,
  CheckOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  MediumOutlined
} from '@ant-design/icons';

import {
  CardPropTypes,
  CardsResult,
  CardValues,
  initialStateCards
} from './Card/interfaces';
import {
  arrayExpensesTypesEnum,
  roules,
  systemColors
} from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, expensesTypesEnum } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import Card from './Card';
import { Header, Shortcut } from './styles';
import { formatDateEn } from 'utils/formatDate';
import { getValueExpensesByTypes } from 'pages/Expense/utils';
import { ExpenseResult } from 'pages/Expense/interfaces';
import FastFilter from 'components/FastFilter';
import { Filter, initialState } from './interfaces';
import { Divider } from 'antd';
import { LinkButton } from 'components/_inputs';

const arrayExpenses = [
  expensesTypesEnum.INSUMOS,
  expensesTypesEnum.INVESTIMENTOS,
  expensesTypesEnum.RETIRADAS,
  expensesTypesEnum.COMPRAS
];
const arrayFilter = arrayExpensesTypesEnum.filter(
  (x: number) => !arrayExpenses.includes(x)
);
const arrayMarketing = [
  expensesTypesEnum.MKT,
  expensesTypesEnum.TPAGO,
  expensesTypesEnum.MOFF,
  expensesTypesEnum.EVENT,
  expensesTypesEnum.MPUB
];

const arrayInput = [expensesTypesEnum.INSUMOS];
const arrayInvestment = [expensesTypesEnum.INVESTIMENTOS];
const arrayCashWithdrawal = [expensesTypesEnum.RETIRADAS];

const Cards: React.FC = () => {
  const { userAuthenticated } = useAppContext();
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CardsResult>(initialStateCards);
  const [state, setState] = useState<Filter>(initialState);
  const [expensePaidOutYes, setExpensePaidOutYes] = useState<CardValues>(
    {} as CardValues
  );
  const [expensePaidOutNo, setExpensePaidOutNo] = useState<CardValues>(
    {} as CardValues
  );
  const [investment, setInvestiment] = useState<CardValues>({} as CardValues);
  const [input, setInput] = useState<CardValues>({} as CardValues);
  const [marketing, setMarketing] = useState<CardValues>({} as CardValues);
  const [marketingAcc, setMarketingAcc] = useState<CardValues>(
    {} as CardValues
  );
  const [cashWithdrawal, setCashWithdrawal] = useState<CardValues>(
    {} as CardValues
  );
  const [expenses, setExpenses] = useState<CardValues>({} as CardValues);
  const [faturamento, setFaturamento] = useState<number>(0);
  const [faturamentoAcc, setFaturamentoAcc] = useState<number>(0);
  const [liquido, setLiquido] = useState<number>(0);
  const [box, setBox] = useState<number>(0);
  const [bruto, setBruto] = useState<number>(0);

  const [dateEn, setDateEn] = useState('');

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
  }, []);

  useEffect(() => {
    const { date, companyId } = state;
    action(date, companyId);
    setDateEn(formatDateEn(date.toISOString()));
  }, [state]);

  useEffect(() => {
    setExpensePaidOutYes(getValueExpenses(cards, 1));
    setExpensePaidOutNo(getValueExpenses(cards, 0));

    const _investment = getValueExpensesByTypes(
      cards?.expensesByType,
      arrayInvestment,
      true
    );
    setInvestiment(_investment);

    const _input = getValueExpensesByTypes(
      cards?.expensesByType,
      arrayInput,
      true
    );
    setInput(_input);

    const _marketing = getValueExpensesByTypes(
      cards?.expensesByType,
      arrayMarketing,
      true
    );
    setMarketing(_marketing);

    const _marketingAcc = getValueExpensesByTypes(
      cards?.expensesByType,
      arrayMarketing,
      true
    );
    setMarketingAcc(_marketingAcc);

    const _cashWithdrawal = getValueExpensesByTypes(
      cards?.expensesByType,
      arrayCashWithdrawal,
      true
    );
    setCashWithdrawal(_cashWithdrawal);

    const _expenses = getValueExpensesByTypes(
      cards?.expensesByType,
      arrayExpenses,
      false
    );
    setExpenses(_expenses);
    const valueVisits = Number(cards?.sales.totalValueVisitsMonth!);

    const _faturamento = Number(cards?.sales.totalValueMonth!) + valueVisits;
    setFaturamento(_faturamento);

    const _faturamentoAcc =
      Number(cards?.salesAcc.totalValueMonth!) +
      Number(cards?.salesAcc.totalValueVisitsMonth!);
    setFaturamentoAcc(_faturamentoAcc);

    const _bruto = _faturamento - cards?.sales.totalValueInputMonth!;
    setBruto(_bruto);

    const _liquido = _bruto - _expenses.totalValueMonth;
    setLiquido(_liquido);

    setBox(
      _bruto -
        _expenses.totalValueMonth -
        _input.totalValueMonth -
        _investment.totalValueMonth
    );
  }, [cards]);

  const action = async (date: Date, companyId?: string) => {
    try {
      setLoading(true);

      const url = `${apiRoutes.dashboard}/cards?companyId=${
        companyId ? companyId : ''
      }`;
      const resp = await api.get(url, { dateReference: date.toISOString() });

      resp?.data && setCards(resp?.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCardSaleMonth = (cards: CardsResult) => {
    return {
      loading,
      value: formatPrice(faturamento),
      color: systemColors.GREEN,
      text: `Faturamento (${cards?.sales.count!})`,
      subText: `Vendas e visitas`,
      icon: <ArrowDownOutlined />,
      url: `${appRoutes.sales}?_date=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardVisitsMonth = (cards: CardsResult) => {
    return {
      loading,
      value: formatPrice(cards.sales.totalValueVisitsMonth),
      color: systemColors.GREEN,
      text: `Visitas (${cards.sales.countVisis!})`,
      icon: <ArrowDownOutlined />,
      url: `${appRoutes.visits}?_date=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardSaleInputMonth = (cards: CardsResult) => {
    return {
      loading,
      value: formatPrice(cards?.sales.totalValueInputMonth!),
      color: systemColors.LIGHT_PINK,
      text: `Custos em vendas`,
      icon: <ArrowUpOutlined />,
      url: `${appRoutes.sales}?_date=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardFaturamentotMonth = (cards: CardsResult) => {
    return {
      loading,
      value: formatPrice(bruto),
      color: systemColors.BLUE,
      text: `Saldo bruto`,
      icon: <DollarOutlined />,
      url: `${appRoutes.sales}?_date=${dateEn}`
    } as CardPropTypes;
  };

  const getValueExpenses = (cards: CardsResult, filter: number) => {
    try {
      const { totalValueMonth, count } = cards?.expenses.find(
        (x: ExpenseResult) => Number(x.paidOut) === filter
      )!;
      return { totalValueMonth: Number(totalValueMonth), count };
    } catch (error) {
      return { totalValueMonth: 0, count: 0 };
    }
  };

  const getPercent = (liquido: number, faturamento: number) => {
    const result = Number(liquido / faturamento);
    if (!result || result === -Infinity || result === NaN) return 0;
    return parseFloat(Number(result * 100).toString()).toFixed(2);
  };

  const getM2 = (m2: number) => {
    if (!m2) return 0;
    return parseFloat(m2.toString()).toFixed(0);
  };

  const getParameter = (array: Array<number>) =>
    array.map((x: number) => `&expenseTypeId=${x}`);

  return (
    <>
      <FastFilter state={state} setState={setState} />
      <Header>
        {Boolean(checkRouleProfileAccess(groups, roules.expenses)) && (
          <>
            <Card
              loading={loading}
              value={formatPrice(expensePaidOutYes.totalValueMonth)}
              color={systemColors.GREEN}
              text={`PAGO (${expensePaidOutYes.count})`}
              icon={<CheckOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}&paidOut=true`}
            />
            <Card
              loading={loading}
              value={formatPrice(expensePaidOutNo.totalValueMonth)}
              color={systemColors.RED}
              text={`A PAGAR (${expensePaidOutNo.count})`}
              icon={<WarningOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}&paidOut=false`}
            />
            <Card
              loading={loading}
              value={formatPrice(
                expensePaidOutYes.totalValueMonth +
                  expensePaidOutNo.totalValueMonth
              )}
              color={systemColors.LIGHT_BLUE}
              text={`TOTAL DE PGTOS (${
                expensePaidOutYes.count + expensePaidOutNo.count
              })`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}`}
            />

            <Card
              loading={loading}
              value={formatPrice(expenses.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`DESPESAS (${expenses.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}${getParameter(
                arrayFilter
              )}`}
            />
            <Card
              loading={loading}
              value={formatPrice(investment.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`INVESTIMENTOS (${investment.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}${getParameter(
                arrayInvestment
              )}`}
            />
            <Card
              loading={loading}
              value={formatPrice(input.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`INSUMOS (${input.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}${getParameter(
                arrayInput
              )}`}
            />
            <Card
              loading={loading}
              value={formatPrice(marketing.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`MARKETING (${marketing.count})`}
              subText={`${getPercent(
                marketing.totalValueMonth,
                faturamento
              )}% Mês / ${getPercent(
                marketingAcc.totalValueMonth,
                faturamentoAcc
              )}% Ano`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}${getParameter(
                arrayMarketing
              )}`}
            />
            <Card
              loading={loading}
              value={formatPrice(cashWithdrawal.totalValueMonth)}
              color={systemColors.LIGHT_GREY}
              text={`RETIRADAS (${cashWithdrawal.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?_date=${dateEn}${getParameter(
                arrayCashWithdrawal
              )}`}
            />
          </>
        )}
        {Boolean(checkRouleProfileAccess(groups, roules.sales)) && (
          <>
            <Card {...handleCardVisitsMonth(cards)} />
            <Card {...handleCardSaleMonth(cards)} />
            <Card {...handleCardSaleInputMonth(cards)} />
            <Card {...handleCardFaturamentotMonth(cards)} />
          </>
        )}{' '}
        {Boolean(checkRouleProfileAccess(groups, roules.saleUserIdChange)) && (
          <>
            <Card
              loading={loading}
              value={formatPrice(liquido)}
              color={systemColors.YELLOW}
              text={`LUCRO LIQUIDO`}
              subText={`Lucratividade ${getPercent(liquido, faturamento)}%`}
              icon={<DollarOutlined />}
              url={`${appRoutes.sales}?_date=${dateEn}`}
            />{' '}
            <Card
              loading={loading}
              value={formatPrice(box)}
              color={systemColors.YELLOW}
              text={`SALDO CAIXA`}
              icon={<DollarOutlined />}
              url={`${appRoutes.sales}?_date=${dateEn}`}
            />
          </>
        )}
        {Boolean(checkRouleProfileAccess(groups, roules.sales)) && (
          <>
            <Card
              loading={loading}
              value={`${getM2(cards?.sales.m2!)}`}
              color={systemColors.BLUE}
              text={`M2 APLICADO`}
              icon={<MediumOutlined />}
              url={`${appRoutes.sales}?_date=${dateEn}`}
            />
          </>
        )}
      </Header>
      <div>
        <Divider>Atalhos</Divider>
        <Shortcut>
          {Boolean(checkRouleProfileAccess(groups, roules.expenses)) && (
            <LinkButton
              to={`${appRoutes.expenses}/create`}
              title="Criar nova despesa"
              text="Despesa"
            />
          )}
          {Boolean(checkRouleProfileAccess(groups, roules.clients)) && (
            <LinkButton
              to={`${appRoutes.clients}/create`}
              title="Criar novo cliente"
              text="Cliente"
            />
          )}
          {Boolean(checkRouleProfileAccess(groups, roules.visit)) && (
            <LinkButton
              to={`${appRoutes.visits}/create`}
              title="Criar nova visita"
              text="Visita"
            />
          )}
          {Boolean(checkRouleProfileAccess(groups, roules.sales)) && (
            <>
              <LinkButton
                to={`${appRoutes.contracts}/create`}
                title="Criar novo contrato"
                text="Contrato"
              />
              <LinkButton
                to={`${appRoutes.sales}/create`}
                title="Criar nova venda"
                text="Venda"
              />
            </>
          )}
        </Shortcut>
      </div>
    </>
  );
};

export default Cards;
