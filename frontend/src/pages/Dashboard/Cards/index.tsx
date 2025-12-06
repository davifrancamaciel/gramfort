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
import { roules, systemColors } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

import api from 'services/api-aws-amplify';
import { apiRoutes, appRoutes, expensesTypesEnum } from 'utils/defaultValues';
import { formatPrice } from 'utils/formatPrice';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import Card from './Card';
import { Header } from './styles';
import { formatDateEn } from 'utils/formatDate';
import { getValueExpensesByTypes } from 'pages/Expense/utils';
import { ExpenseResult } from 'pages/Expense/interfaces';
import FastFilter from 'components/FastFilter';
import { Filter, initialState } from './interfaces';

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
  const [others, setOthers] = useState<CardValues>({} as CardValues);
  const [expenses, setExpenses] = useState<CardValues>({} as CardValues);
  const [faturamento, setFaturamento] = useState<number>(0);
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
      [expensesTypesEnum.INVESTIMENTOS],
      true
    );
    setInvestiment(_investment);

    const _input = getValueExpensesByTypes(
      cards?.expensesByType,
      [expensesTypesEnum.INSUMOS],
      true
    );
    setInput(_input);

    const _others = getValueExpensesByTypes(
      cards?.expensesByType,
      [expensesTypesEnum.OUTROS],
      true
    );
    setOthers(_others);

    const _expenses = getValueExpensesByTypes(
      cards?.expensesByType,
      [
        expensesTypesEnum.INSUMOS,
        expensesTypesEnum.INVESTIMENTOS,
        expensesTypesEnum.OUTROS
      ],
      false
    );
    setExpenses(_expenses);
    const valueVisits =
      Number(cards?.sales.totalValueVisitsMonth!) -
      Number(cards?.sales.totalValueVisitsInSalesMonth!);

    const _faturamento = Number(cards?.sales.totalValueMonth!) + valueVisits;
    setFaturamento(_faturamento);

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
      text: `vendas (${cards?.sales.count!})`,
      subText: `Visitas ${formatPrice(cards.sales.totalValueVisitsMonth)} (${
        cards.sales.countVisis
      })`,
      icon: <ArrowDownOutlined />,
      url: `${appRoutes.sales}?dateReference=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardSaleInputMonth = (cards: CardsResult) => {
    return {
      loading,
      value: formatPrice(cards?.sales.totalValueInputMonth!),
      color: systemColors.LIGHT_PINK,
      text: `Custos em vendas`,
      icon: <ArrowUpOutlined />,
      url: `${appRoutes.sales}?dateReference=${dateEn}`
    } as CardPropTypes;
  };

  const handleCardFaturamentotMonth = (cards: CardsResult) => {
    return {
      loading,
      value: formatPrice(bruto),
      color: systemColors.BLUE,
      text: `Saldo bruto`,
      icon: <DollarOutlined />,
      url: `${appRoutes.sales}?dateReference=${dateEn}`
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
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={formatPrice(expensePaidOutNo.totalValueMonth)}
              color={systemColors.RED}
              text={`A PAGAR (${expensePaidOutNo.count})`}
              icon={<WarningOutlined />}
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
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
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={formatPrice(expenses.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`DESPESAS (${expenses.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={formatPrice(investment.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`INVESTIMENTOS (${investment.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={formatPrice(input.totalValueMonth)}
              color={systemColors.ORANGE}
              text={`INSUMOS (${input.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={formatPrice(others.totalValueMonth)}
              color={systemColors.LIGHT_GREY}
              text={`OUTROS (${others.count})`}
              icon={<ArrowUpOutlined />}
              url={`${appRoutes.expenses}?dateReference=${dateEn}`}
            />
          </>
        )}
        {Boolean(checkRouleProfileAccess(groups, roules.sales)) && (
          <>
            <Card {...handleCardSaleMonth(cards)} />
            <Card {...handleCardSaleInputMonth(cards)} />
            <Card {...handleCardFaturamentotMonth(cards)} />
            <Card
              loading={loading}
              value={formatPrice(liquido)}
              color={systemColors.YELLOW}
              text={`LUCRO LIQUIDO`}
              subText={`Lucratividade ${getPercent(liquido, faturamento)}%`}
              icon={<DollarOutlined />}
              url={`${appRoutes.sales}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={formatPrice(box)}
              color={systemColors.YELLOW}
              text={`SALDO CAIXA`}
              icon={<DollarOutlined />}
              url={`${appRoutes.sales}?dateReference=${dateEn}`}
            />
            <Card
              loading={loading}
              value={`${getM2(cards?.sales.m2!)}`}
              color={systemColors.BLUE}
              text={`M2 APLICADO`}
              icon={<MediumOutlined />}
              url={`${appRoutes.sales}?dateReference=${dateEn}`}
            />
          </>
        )}
      </Header>
    </>
  );
};

export default Cards;
