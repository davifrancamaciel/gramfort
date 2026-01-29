import React, { useEffect, useState } from 'react';
import { Col, Image, Row } from 'antd';
import TableReport from 'components/Report/TableReport';
import Td from './Td';
import { Sale, SaleProduct } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';
import {
  systemColors,
  categorIdsArrayProduct,
  productCategoriesEnum,
  appRoutes
} from 'utils/defaultValues';
import { formatDate, formatDateText } from 'utils/formatDate';

import assinatura from 'assets/assinatura.png';
import logoGota from 'assets/logo-gota.png';
import { Clause, Footer, Header } from './styles';
import { getBalance } from '../../utils';
import { numberWithDots, currency } from 'utils';
import { ContractLabels, language } from 'utils/languages';

interface PropTypes {
  sale: Sale;
}

const Table: React.FC<PropTypes> = ({ sale }) => {
  const [labels, setLabels] = useState<ContractLabels>();

  useEffect(() => {
    const currencyCompany = sale.company?.currency
      ? sale.company?.currency
      : currency.BRL;
    const label = language[appRoutes.contracts][
      currencyCompany
    ] as ContractLabels;
    setLabels(label);
  }, [sale]);

  const getPrefixProductDescription = (sp: SaleProduct) => {
    return sp.product.categoryId === productCategoriesEnum.SERVICO_M2
      ? `${(sp.amount / sale.company?.sizeTank!) * 2000} ${
          labels?.textAmountInput
        } `
      : '';
  };

  return (
    <TableReport
      title={``}
      image={sale?.company?.image || ''}
      imageFooterContract={sale?.company?.imageFooterContract || ''}
      showImageLastPage={true}
    >
      <tr style={{ border: '0', fontSize: '10px' }}>
        <td style={{ border: '0' }}>
          <div style={{ minHeight: '900px' }}>
            <Header>
              <table
                style={{
                  textAlign: 'center',
                  marginBottom: '15px',
                  backgroundColor: systemColors.GREY_MEDIUM
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderRight: '0',
                        color: '#fff',
                        backgroundColor: systemColors.DARK_BLUE,
                        textAlign: 'center',
                        textTransform: 'uppercase'
                      }}
                    >
                      {sale.company?.fantasyName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {labels?.cpfCnpj} {sale.company?.cnpj} {labels?.phone}{' '}
                      {sale.company?.phone}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {sale.company?.address} {sale.company?.city}/
                      {sale.company?.state}. {labels?.zipCode}{' '}
                      {sale.company?.zipCode}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {sale.company?.site} | {sale.company?.email} |{' '}
                      {sale.company?.instagran}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <img src={sale.company?.imageHeaderContract} alt="" />
              </div>
            </Header>

            <p style={{ textAlign: 'center' }} id="contact">
              {labels?.textClient
                .replace('{contact}', `${sale.contact}`)
                .replace('null', '')}
            </p>
            <table
              style={{
                marginTop: '15px',
                backgroundColor: systemColors.GREY_MEDIUM
              }}
            >
              <tbody>
                <tr>
                  <Td colSpan={2} title={labels?.id} value={sale.id} />
                  <Td
                    colSpan={2}
                    title={labels?.user}
                    value={sale.user?.name}
                  />
                </tr>
                <tr>
                  <Td
                    colSpan={2}
                    title={labels?.client}
                    value={sale.client?.name}
                  />
                  <Td
                    colSpan={2}
                    title={labels?.cpfCnpj}
                    value={sale.client?.cpfCnpj}
                  />
                </tr>
                <tr>
                  <Td
                    colSpan={2}
                    title={labels?.email}
                    value={sale.client?.email}
                  />
                  <Td
                    colSpan={2}
                    title={labels?.phone}
                    value={sale.client?.phone}
                  />
                </tr>
                <tr>
                  <Td
                    colSpan={2}
                    title={labels?.address}
                    value={`${sale.visit?.address || ''} ${
                      sale.visit?.city || ''
                    } ${sale.visit?.state || ''}`}
                  />
                  <Td
                    colSpan={2}
                    title={labels?.distance}
                    value={sale.distance}
                  />
                </tr>
              </tbody>
            </table>

            <table style={{ fontSize: '14px', marginTop: '10px' }}>
              <thead>
                <tr
                  style={{
                    color: '#fff',
                    backgroundColor: systemColors.DARK_BLUE,
                    textAlign: 'center'
                  }}
                >
                  <th style={{ borderRight: '0' }}>{labels?.item}</th>
                  <th style={{ borderRight: '0', borderLeft: '0' }}>
                    {labels?.decription}
                  </th>
                  <th style={{ borderRight: '0', borderLeft: '0' }}>
                    {labels?.amount}
                  </th>
                  <th style={{ borderRight: '0', borderLeft: '0' }}>
                    {labels?.curency}
                  </th>
                  <th style={{ borderLeft: '0' }}>{labels?.total}</th>
                </tr>
              </thead>
              <tbody>
                {sale.productsSales
                  .filter((sp: SaleProduct) =>
                    categorIdsArrayProduct.includes(sp.product?.categoryId || 0)
                  )
                  .map((sp: SaleProduct, index: number) => (
                    <>
                      <tr
                        key={index}
                        style={{ backgroundColor: systemColors.GREY_MEDIUM }}
                      >
                        <td>{index + 1}</td>
                        <td>{sp.product.name}</td>
                        <td>{numberWithDots(Number(sp.amount))}</td>
                        <td>{formatPrice(Number(sp.value!))}</td>
                        <td>{formatPrice(Number(sp.valueAmount!))}</td>
                      </tr>
                      {sp.product.description && (
                        <tr key={index + 100}>
                          <Td
                            colSpan={5}
                            title=""
                            value={sp.product.description}
                            prefixValue={getPrefixProductDescription(sp)}
                          />
                        </tr>
                      )}
                    </>
                  ))}

                <tr>
                  <td
                    colSpan={3}
                    style={{
                      border: 'none',
                      borderRight: '#eee solid 1px'
                    }}
                  ></td>
                  <td>{labels?.totalService}</td>
                  <td>{formatPrice(Number(sale.value))}</td>
                </tr>
                {sale.discountDescription && sale.discountValue && (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        border: 'none',
                        borderRight: '#eee solid 1px'
                      }}
                    ></td>
                    <td
                      style={{
                        color: '#fff',
                        backgroundColor: systemColors.DARK_BLUE
                      }}
                    >
                      {sale.discountDescription}
                    </td>
                    <td
                      style={{
                        color: '#fff',
                        backgroundColor: systemColors.BLUE
                      }}
                    >
                      -{formatPrice(Number(sale.discountValue))}
                    </td>
                  </tr>
                )}
                {sale.visit?.value && Boolean(Number(sale.visit?.value)) && (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        border: 'none',
                        borderRight: '#eee solid 1px'
                      }}
                    ></td>
                    <td
                      style={{
                        color: '#fff',
                        backgroundColor: systemColors.DARK_BLUE
                      }}
                    >
                      {labels?.visitDicount}
                    </td>
                    <td
                      style={{
                        color: '#fff',
                        backgroundColor: systemColors.BLUE
                      }}
                    >
                      -{formatPrice(Number(sale.visit?.value))}
                    </td>
                  </tr>
                )}

                <tr>
                  <td
                    colSpan={3}
                    style={{
                      border: 'none',
                      borderRight: '#eee solid 1px'
                    }}
                  ></td>
                  <td>{labels?.valueTotal}</td>
                  <td
                    style={{
                      color: '#fff',
                      backgroundColor: systemColors.GREEN
                    }}
                  >
                    {getBalance(sale)}
                  </td>
                </tr>
              </tbody>
            </table>

            <Clause>
              <h3>{labels?.clause1}</h3>
              {sale.paymentMethod && <p>{sale.paymentMethod}</p>}
              <p>
                {sale.company?.agencyBank} {sale.company?.fantasyName} Pix{' '}
                {labels?.cpfCnpj} {sale.company?.pixKey}
              </p>
              <p>
                {labels?.expectedDateForApplication}{' '}
                <strong>
                  {sale.expectedDateForApplication
                    ? formatDate(sale.expectedDateForApplication)
                    : labels?.textDefinition}
                </strong>
              </p>
            </Clause>
            <Clause>
              <h3>{labels?.clause2}</h3>
              <p>
                Equipe, equipamento e insumos serão de responsabilidade da
                contratada assim como entrega da aplicação.
              </p>
              <p>
                O Contratante autoriza a contratada registra e postar nas redes
                sociais, fotos e vídeos antes e depois.
              </p>
              <p>
                Prazo de execução <strong>{sale.daysExecution} dias.</strong>
                Proposta válida por 15 dias. Efetivação mediante pagamento do
                Sinal.
              </p>
            </Clause>
            <Clause>
              <h3>{labels?.clause3}</h3>
              <p>
                <strong>1. Isolar a área</strong> aplicada para evitar
                pisoteamento de pessoas e animais, pois compromete a germinação
                uniforme das sementes.
              </p>
              <p>
                <strong>2. Fazer irrigação</strong> 2x ao dia nos 30 primeiros
                dias (principalmente as 7h da manhã e final da tarde após o por
                do sol).
              </p>
              <p>
                <strong>3.</strong> Observar{' '}
                <strong>acumulo de passáros,</strong> pois podem comer as
                sementes. Sugerimos alimentá-los na parte baixa com coxos
              </p>
              <p>
                <strong>4.</strong> Efetuar a{' '}
                <strong>
                  drenagem eficiente na parte superior dos taludes.
                </strong>{' '}
                Não reaplicamos caso a água lave devido a falta de drenagem.
              </p>
              <p>
                <strong>5.</strong> Observar a existência de{' '}
                <strong>formigueiro próximos e eliminá-los,</strong> pois podem
                comprometer o resultado.
              </p>
            </Clause>
            <Clause>
              <h3>{labels?.clause4}</h3>
              <p>
                A técnica garante a cobertura vegetal do solo, e apesar de
                contribuir para sua estabilidade, não elimina os riscos
              </p>
              <p>
                de ocorrer deslizamentos, barreiras ou movimento de solo que
                afete os resultados. Nesses casos não fazemos reaplicações.
              </p>
              <p>
                Áreas rochosas ou compactadas podem apresentar falhas assim como
                taludes acima de 80º de inclinação.
              </p>
              <p>
                <strong>IMPORTANTE:</strong> Após aplicação, caso ocorra chuvas
                extremas/temporais/tromba d'agua - isto é, que foge a
                normalidade - pode ocasionar
              </p>
              <p>
                a lavagem do material aplicado, neste caso nos comprometemos a
                realizar a reaplicação pelo valor de 30% do valor cobrado.
              </p>
              <p>
                Caso o cliente respeite e siga as orientação e ainda sim no
                período de 90 (noventa) dias não ocorrer a
              </p>
              <p>
                germinação de 90% da área, a {sale.company?.fantasyName} se
                compromete a refazer o plantio.
              </p>
            </Clause>
          </div>
          <Footer>
            <div
              style={{
                marginTop: '10px',
                display: 'grid',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <img alt={''} src={assinatura} style={{ width: '200px' }} />
              </span>

              <p
                style={{
                  fontSize: '15px',
                  borderTop: 'solid 1px',
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <strong>Valter Rodrigo S Silva</strong>
              </p>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                {labels?.textDir}
              </p>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                {labels?.id} {sale.id}
              </p>
            </div>
            <img
              alt={''}
              src={logoGota}
              style={{ width: '90px', height: '100%', marginTop: '30px' }}
            />
            <div
              style={{
                marginTop: '10px',
                display: 'grid',
                justifyContent: 'center'
              }}
            >
              <div style={{ height: '81px' }}></div>
              <p
                style={{
                  fontSize: '15px',
                  borderTop: 'solid 1px'
                }}
              >
                <strong>{sale.client?.name}</strong>
              </p>
              <p>{labels?.client}</p>
              <p>
                {sale.company?.city}, {formatDateText(sale.createdAt!)}
              </p>
            </div>
          </Footer>
          {sale.image1 && (
            <div>
              <Header>
                <table style={{ textAlign: 'center', marginBottom: '15px' }}>
                  <thead>
                    <tr>
                      <th
                        colSpan={4}
                        style={{
                          borderRight: '0',
                          color: '#fff',
                          backgroundColor: systemColors.DARK_BLUE,
                          textAlign: 'center'
                        }}
                      >
                        {labels?.visitTitle}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.visit && (
                      <tr style={{ fontSize: '14px' }}>
                        <td>
                          {labels?.textRealization.replace(
                            '{user}',
                            sale.visit?.user?.name ? sale.visit?.user?.name : ''
                          )}{' '}
                          {formatDate(sale.visit?.date)}
                        </td>
                      </tr>
                    )}

                    {sale?.note && (
                      <>
                        <tr>
                          <td colSpan={4}> </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              color: '#fff',
                              backgroundColor: systemColors.DARK_BLUE
                            }}
                          >
                            {labels?.info}
                          </td>
                        </tr>
                      </>
                    )}
                    {sale?.note
                      ?.split('\n')
                      .map((item: string, index: number) => (
                        <tr key={index + 100} style={{ fontSize: '14px' }}>
                          <td colSpan={4}>{item}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div>
                  <img src={sale.company?.imageHeaderContract} alt="" />
                </div>
              </Header>
              <Row
                gutter={[24, 24]}
                style={{ marginBottom: '15px', marginTop: '15px' }}
              >
                {sale.image1 && (
                  <Col
                    lg={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'end',
                      width: '50%'
                    }}
                  >
                    <Image
                      style={{ height: '200px', maxWidth: '350px' }}
                      src={sale.image1}
                    />
                  </Col>
                )}
                {sale.image2 && (
                  <Col
                    lg={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      width: '50%'
                    }}
                  >
                    <Image
                      style={{ height: '200px', maxWidth: '350px' }}
                      src={sale.image2}
                    />
                  </Col>
                )}
              </Row>
              <Row gutter={[16, 24]}>
                <Col
                  lg={12}
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    width: '50%'
                  }}
                >
                  {sale.image3 && (
                    <Image
                      style={{ height: '500px', maxWidth: '350px' }}
                      src={sale.image3}
                    />
                  )}
                </Col>
                <Col
                  lg={12}
                  style={{
                    display: 'grid',
                    justifyContent: 'start  ',
                    width: '50%',
                    gap: '10px'
                  }}
                >
                  {sale.image4 && (
                    <Image
                      style={{ height: '160px', maxWidth: '350px' }}
                      src={sale.image4}
                    />
                  )}
                  {sale.image5 && (
                    <Image
                      style={{ height: '160px', maxWidth: '350px' }}
                      src={sale.image5}
                    />
                  )}
                  {sale.image6 && (
                    <Image
                      style={{ height: '160px', maxWidth: '350px' }}
                      src={sale.image6}
                    />
                  )}
                </Col>
              </Row>
            </div>
          )}
        </td>
      </tr>
    </TableReport>
  );
};

export default Table;
