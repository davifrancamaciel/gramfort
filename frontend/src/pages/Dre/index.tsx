import React, { useEffect, useState } from 'react';

import api from 'services/api-aws-amplify';
import { apiRoutes } from 'utils/defaultValues';

import FastFilter from 'components/FastFilter';
import { Filter, initialState } from '../Dashboard/Cards/interfaces';
import { Col, Row, Card, Tabs } from 'antd';
import {
  DataDreResult,
  initialStateDre,
  typeLayoutDreEnum
} from './interfaces';

import PrintContainer from 'components/Report/PrintContainer';
import TableReport from 'components/Report/TableReport';
import { useAppContext } from 'hooks/contextLib';
import { Company } from '../Company/interfaces';
import Simplified from './Simplified';
import Detailed from './Detailed';

const Dre: React.FC = () => {
  const { companies, userAuthenticated } = useAppContext();
  const { signInUserSession } = userAuthenticated;
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<Filter>(initialState);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [company, setCompany] = useState<Company>({} as Company);
  const [text, setText] = useState('');
  const [data, setData] = useState<DataDreResult>(initialStateDre);
  const [print, setPrint] = useState();
  const [printSimple, setPrintSimple] = useState();
  const [printDetail, setPrintDetail] = useState();
  const [type, setType] = useState<string>(typeLayoutDreEnum.SIMPLIFIED);

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

  useEffect(() => {
    setPrint(printSimple);
  }, [printSimple]);

  useEffect(() => {
    setPrint(printDetail);
  }, [printDetail]);

  const onChangeTab = (tab: string) => {
    setType(tab);
    if (tab === typeLayoutDreEnum.SIMPLIFIED) setPrint(printSimple);
    if (tab === typeLayoutDreEnum.DEATAILED) setPrint(printDetail);
  };

  const action = async (date: Date, companyId?: string) => {
    try {
      setLoading(true);
      setData(initialStateDre);
      setYear(date.getFullYear());
      const resp = await api.get(apiRoutes.dre, {
        dateReference: date.toISOString(),
        companyId: companyId ? companyId : ''
      });

      setData(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
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
                filename={`DRE-${type}-${year} ${text}`}
              >
                <TableReport
                  title={company?.fantasyName || ''}
                  image={company?.image || ''}
                  subTitle={`EXERCICIO ${year} ${text}`}
                >
                  {print}
                </TableReport>
              </PrintContainer>
            }
          >
            <Tabs
              defaultActiveKey={typeLayoutDreEnum.SIMPLIFIED}
              onChange={onChangeTab}
            >
              <Tabs.TabPane
                tab={typeLayoutDreEnum.SIMPLIFIED}
                key={typeLayoutDreEnum.SIMPLIFIED}
              >
                <Simplified data={data} setPrint={setPrintSimple} year={year} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={typeLayoutDreEnum.DEATAILED}
                key={typeLayoutDreEnum.DEATAILED}
              >
                <Detailed
                  data={data}
                  setPrint={setPrintDetail}
                  year={year}
                  company={company}
                />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Dre;
