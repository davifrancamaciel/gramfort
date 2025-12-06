import React, { useEffect, useMemo, useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import { roules } from 'utils/defaultValues';
import { useAppContext } from 'hooks/contextLib';

import { formatDateEn } from 'utils/formatDate';
import ShowByRoule from 'components/ShowByRoule';
import { Col } from 'antd';
import { Select } from 'components/_inputs';
import { Container } from './styles';
import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';

interface PropTypes {
  state: any;
  setState: (state: any) => void;
}

const FastFilter: React.FC<PropTypes> = ({ state, setState }) => {
  const { companies, userAuthenticated } = useAppContext();
  const [date, setDate] = useState(new Date());
  const [groups, setGroups] = useState<string[]>([]);

  const dateFormated = useMemo(
    () => format(date, "MMMM 'de' yyyy", { locale: pt }),
    [date]
  );

  useEffect(() => {
    const { signInUserSession } = userAuthenticated;
    setGroups(signInUserSession.accessToken.payload['cognito:groups']);
  }, []);

  useEffect(() => {
    const _date = formatDateEn(date.toISOString());
    setState({ ...state, date, _date });
  }, [date]);

  const handlePrevMonth = () => setDate(subMonths(date, 1));

  const handleNextMonth = () => setDate(addMonths(date, 1));

  return (
    <Container
      content={
        Boolean(checkRouleProfileAccess(groups, roules.administrator))
          ? 'space-between'
          : 'center'
      }
    >
      <ShowByRoule roule={roules.administrator}>
        <Col lg={5} md={6} sm={12} xs={8}>
          <Select
            placeholder={'Empresa'}
            options={companies}
            value={state.companyId}
            onChange={(companyId) => setState({ ...state, companyId })}
          />
        </Col>
      </ShowByRoule>

      <div>
        <span onClick={handlePrevMonth}>
          <LeftOutlined />
        </span>
        <strong>{dateFormated}</strong>
        <span onClick={handleNextMonth}>
          <RightOutlined />
        </span>
      </div>
    </Container>
  );
};

export default FastFilter;
