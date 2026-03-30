import React, { useEffect, useState } from 'react';
import GridList from 'components/GridList';
import { Row, Col, Image, Carousel } from 'antd';

import { apiRoutes, appRoutes } from 'utils/defaultValues';
import { Application } from '../interfaces';

import api from 'services/api-aws-amplify';
import { formatDate, formatDateHour } from 'utils/formatDate';
import Action from 'components/Action';

interface PropTypes {
  saleId: number;
  clientId: number;
  companyId: string;
}

const List: React.FC<PropTypes> = ({ saleId, companyId, clientId }) => {
  const [items, setItems] = useState<Application[]>([]);

  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    actionFilter(1, saleId, companyId);
  }, [saleId]);

  const contentStyle: React.CSSProperties = {
    height: '400px',
    color: '#fff',
    lineHeight: '400px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    background: '#364d79'
  };
  const actionFilter = async (
    pageNumber: number = 1,
    saleId: number,
    companyId: string
  ) => {
    try {
      setLoading(true);
      const resp = await api.get(apiRoutes.applications, {
        saleId,
        companyId,
        pageNumber: 1,
        pageSize: 100
      });
      setLoading(false);

      const { count, rows } = resp.data;
      const itemsFormatted = rows.map((item: Application) => {
        const itemFormatted = {
          ...item,
          image: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Image style={{ height: '40px' }} src={item.image1} />
            </div>
          ),
          clientName: item.client?.name,
          companyName: item.company?.name,
          userName: item.user?.name,
          createdAt: formatDateHour(item.createdAt),
          updatedAt: formatDateHour(item.updatedAt),
          date: formatDate(item.date),
          approved: (
            <Action
              item={item}
              setUpdate={() => {}}
              apiRoutes={apiRoutes.applications}
              propName="approved"
            />
          ),

          expandable: (
            <div
              style={{
                height: '600px',
                width: '800px'
              }}
            >
              <Carousel
                autoplay
                arrows
                style={{
                  height: '400px',
                  width: '800px',
                  marginBottom: '20px'
                }}
              >
                {item.image1 && (
                  <div>
                    <div style={contentStyle}>
                      <Image
                        src={item.image1}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>
                )}

                {item.image2 && (
                  <div>
                    <div style={contentStyle}>
                      <Image
                        src={item.image2}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>
                )}
                {item.image3 && (
                  <div>
                    <div style={contentStyle}>
                      <Image
                        src={item.image3}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>
                )}
                {item.image4 && (
                  <div>
                    <div style={contentStyle}>
                      <Image
                        src={item.image4}
                        style={{
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </Carousel>
              <div
                dangerouslySetInnerHTML={{
                  __html: item?.note ? item?.note : ''
                }}
              />
            </div>
          )
        };
        return { ...itemFormatted };
      });
      setItems(itemsFormatted);
      setTotalRecords(count);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Row style={{ width: '100%', marginTop: '30px' }}>
      <Col lg={24} md={24} sm={24} xs={24}>
        <GridList
          size="small"
          scroll={{ x: 840 }}
          columns={[
            { title: '', dataIndex: 'image' },
            { title: 'Aplicador', dataIndex: 'userName' },
            { title: 'Data', dataIndex: 'date' },
            { title: 'Cliente', dataIndex: 'clientName' },
            { title: 'Quantidade', dataIndex: 'amount' },
            { title: 'Tipo', dataIndex: 'type' },
            { title: 'Aprovada', dataIndex: 'approved' }
          ]}
          dataSource={items}
          totalRecords={totalRecords}
          pageSize={100}
          loading={loading}
          routes={{
            routeCreate: `/${appRoutes.applications}/create?saleId=${saleId}&companyId=${companyId}&clientId=${clientId}`,
            routeUpdate: `/${appRoutes.applications}/edit`,
            routeDelete: `/${appRoutes.applications}`
          }}
        />
      </Col>
    </Row>
  );
};

export default List;
