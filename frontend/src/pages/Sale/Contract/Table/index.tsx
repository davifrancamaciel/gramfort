import React from 'react';
import { Col, Image, Row } from 'antd';
import TableReport from 'components/Report/TableReport';
import Td from './Td';
import { Sale, SaleProduct } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';
import { systemColors, productCategoriesEnum } from 'utils/defaultValues';
import { formatDate, formatDateText } from 'utils/formatDate';

import assinatura from 'assets/assinatura.png';
import logo from 'assets/logo-vertical.jpeg';
import { Clause, Footer, Header } from './styles';

interface PropTypes {
  sale: Sale;
}
const categorIdsArray = [
  productCategoriesEnum.SERVICO,
  productCategoriesEnum.SERVICO_M2
];

const Table: React.FC<PropTypes> = ({ sale }) => {
  return (
    <TableReport
      title={``}
      image={sale?.company?.image || ''}
      showImageLastPage={true}
    >
      <tr style={{ border: '0', fontSize: '10px' }}>
        <td style={{ border: '0' }}>
          <Header>
            <table style={{ textAlign: 'center', marginBottom: '15px' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      borderRight: '0',
                      color: '#fff',
                      backgroundColor: systemColors.DARK_BLUE,
                      textAlign: 'center'
                    }}
                  >
                    GRAMFORT HIDROSSEMEADURA E SOLUÇÕES AMBIENTAIS LTDA
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CNPJ 50.641.930/0001-00 Fone +55 24 98100.8000</td>
                </tr>
                <tr>
                  <td>
                    Estrada União e Industria, 20647. Petrópolis/RJ. CEP
                    25.750-222
                  </td>
                </tr>
                <tr>
                  <td>
                    www.gramfort.com.br | gramfort@hotmail.com | @gramfort_
                  </td>
                </tr>
              </tbody>
            </table>
            <img src={logo} alt="" />
          </Header>

          <p style={{ textAlign: 'center' }}>
            Prezado(a) Sr(a), <strong>{sale.client?.name}</strong> atendendo ao
            seu pedido estamos enviando nossa proposta comercial de
            Hidrossemeadura.
          </p>
          <table style={{ marginTop: '15px' }}>
            <tbody>
              <tr>
                <Td colSpan={2} title="Proposta Comercial nº" value={sale.id} />
                <Td
                  colSpan={2}
                  title="Consultor Técnico"
                  value={sale.user?.name}
                />
              </tr>
              <tr>
                <Td colSpan={2} title="Cliente" value={sale.client?.name} />
                <Td colSpan={2} title="CNPJ/CPF" value={sale.client?.cpfCnpj} />
              </tr>
              <tr>
                <Td colSpan={2} title="E-mail" value={sale.client?.email} />
                <Td colSpan={2} title="Fone" value={sale.client?.phone} />
              </tr>
              <tr>
                <Td
                  colSpan={2}
                  title="Local Aplicação"
                  value={`${sale.visit?.address || ''} ${
                    sale.visit?.city || ''
                  } ${sale.visit?.state || ''}`}
                />
                <Td colSpan={2} title="KM da Base" value={sale.visit?.km} />
              </tr>
            </tbody>
          </table>
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            DETALHES DO ORÇAMENTO
          </p>

          <table>
            <thead>
              <tr
                style={{
                  color: '#fff',
                  backgroundColor: systemColors.DARK_BLUE,
                  textAlign: 'center'
                }}
              >
                <th style={{ borderRight: '0' }}>ITEM</th>
                <th style={{ borderRight: '0', borderLeft: '0' }}>DESCRIÇÃO</th>
                <th style={{ borderRight: '0', borderLeft: '0' }}>METROS</th>
                <th style={{ borderRight: '0', borderLeft: '0' }}>R$/M2</th>
                <th style={{ borderLeft: '0' }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {sale.productsSales
                .filter((sp: SaleProduct) =>
                  categorIdsArray.includes(sp.product?.categoryId || 0)
                )
                .map((sp: SaleProduct, index: number) => (
                  <>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{sp.product.name}</td>
                      <td>{sp.amount}</td>
                      <td>{formatPrice(Number(sp.value!))}</td>
                      <td>{formatPrice(Number(sp.valueAmount!))}</td>
                    </tr>
                    {sp.product.description && (
                      <tr key={index + 100}>
                        <Td
                          colSpan={5}
                          title=""
                          value={sp.product.description}
                        />
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: '30px',
              justifyContent: 'end',
              display: 'flex'
            }}
          >
            <table style={{ width: '300px', borderTop: '#eee solid 1px' }}>
              <tbody>
                <tr>
                  <td>Total da Proposta</td>
                  <td>{formatPrice(Number(sale.value))}</td>
                </tr>
                {sale.discountDescription && sale.discountValue && (
                  <tr>
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
                        backgroundColor: systemColors.LIGHT_BLUE
                      }}
                    >
                      {formatPrice(Number(sale.discountValue))}
                    </td>
                  </tr>
                )}
                {sale.visit?.value && (
                  <tr>
                    <td
                      style={{
                        color: '#fff',
                        backgroundColor: systemColors.DARK_BLUE
                      }}
                    >
                      Desconto Visita
                    </td>
                    <td
                      style={{
                        color: '#fff',
                        backgroundColor: systemColors.LIGHT_BLUE
                      }}
                    >
                      {formatPrice(Number(sale.visit?.value))}
                    </td>
                  </tr>
                )}

                <tr>
                  <td>Valor Total</td>
                  <td
                    style={{
                      color: '#fff',
                      backgroundColor: systemColors.GREEN
                    }}
                  >
                    {formatPrice(
                      Number(sale.value || 0) -
                        Number(sale.visit?.value || 0) -
                        Number(sale.discountValue || 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Clause>
            <h3>CLÁUSULA PRIMEIRA - DA FORMA DE PAGAMENTO</h3>
            {sale.paymentMethod && <p>{sale.paymentMethod}</p>}
            <p>
              Santander Ag 4421 CC 13002793-2 Gramfort Hidrossemeadura Pix CNPJ
              50641930000100
            </p>
            <p>
              Data prevista para execução{' '}
              <strong>
                {sale.expectedDateForApplication
                  ? formatDate(sale.expectedDateForApplication)
                  : 'a definir'}
              </strong>
            </p>
          </Clause>
          <Clause>
            <h3>CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES GERAIS</h3>
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
            <h3>
              CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE PARA MANUTENÇÃO
              DA GARANTIA
            </h3>
            <p>
              <strong>1. Isolar a área</strong> aplicada para evitar
              pisoteamento de pessoas e animais, pois compromete a germinação
              uniforme das sementes.
            </p>
            <p>
              <strong>2. Fazer irrigação</strong> 2x ao dia nos 30 primeiros
              dias (principalmente as 7h da manhã e final da tarde após o por do
              sol).
            </p>
            <p>
              <strong>3.</strong> Observar <strong>acumulo de passáros,</strong>{' '}
              pois podem comer as sementes. Sugerimos alimentá-los na parte
              baixa com coxos
            </p>
            <p>
              <strong>4.</strong> Efetuar a{' '}
              <strong>drenagem eficiente na parte superior dos taludes.</strong>{' '}
              Não reaplicamos caso a água lave devido a falta de drenagem.
            </p>
            <p>
              <strong>5.</strong> Observar a existência de{' '}
              <strong>formigueiro próximos e eliminá-los,</strong> pois podem
              comprometer o resultado.
            </p>
          </Clause>
          <Clause>
            <h3>CLÁUSULA QUARTA - INFORMAÇÕES/TERMOS ADCIONAIS</h3>
            <p>
              A técnica garante a cobertura vegetal do solo, e apesar de
              contribuir para sua estabilidade, não elimina os riscos
            </p>
            <p>
              de ocorrer deslizamentos, barreiras ou movimento de solo que afete
              os resultados. Nesses casos não fazemos reaplicações.
            </p>
            <p>
              Áreas rochosas ou compactadas podem apresentar falhas assim como
              taludes acima de 80º de inclinação.
            </p>
            <p>
              <strong>IMPORTANTE:</strong> Após aplicação, caso ocorra chuvas
              extremas/temporais/tromba d'agua - isto é, que foge a normalidade
              - pode ocasionar
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
              germinação de 90% da área, a GRAMFORT se compromete a refazer o
              plantio.
            </p>
          </Clause>

          <Footer>
            <div
              style={{
                marginTop: '10px',
                display: 'grid',
                justifyContent: 'center'
              }}
            >
              <img alt={''} src={assinatura} style={{ width: '200px' }} />

              <p style={{ fontSize: '15px', borderTop: 'solid 1px' }}>
                <strong>Valter Rodrigo S Silva</strong>
              </p>
              <p>Diretor Comercial GramFort</p>
              <p>Proposta Comercial nº {sale.id}</p>
            </div>
            <div
              style={{
                marginTop: '10px',
                display: 'grid',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  fontSize: '15px',
                  borderTop: 'solid 1px',
                  marginTop: '81px'
                }}
              >
                <strong>{sale.client?.name}</strong>
              </p>
              <p>Cliente/Contratante</p>
              <p>Petrópolis, {formatDateText(sale.createdAt!)}</p>
            </div>
          </Footer>

          {sale.visit && (
            <Header>
              <table style={{ textAlign: 'center', marginBottom: '15px' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        borderRight: '0',
                        color: '#fff',
                        backgroundColor: systemColors.DARK_BLUE,
                        textAlign: 'center'
                      }}
                    >
                      RELATÓRIO DE VISITA TÉCNICA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Realizada por {sale.visit?.user?.name} em{' '}
                      {formatDate(sale.visit?.date)}
                    </td>
                  </tr>
                  {sale.visit?.note && (
                    <tr>
                      <td
                        style={{
                          color: '#fff',
                          backgroundColor: systemColors.GREEN
                        }}
                      >
                        INFORMAÇÕES IMPORTANTES
                      </td>
                    </tr>
                  )}
                  {sale.visit?.note
                    ?.split('\n')
                    .map((item: string, index: number) => (
                      <tr key={index + 100}>
                        <td>{item}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <img src={logo} alt="" />
            </Header>
          )}
          <Row
            gutter={[16, 24]}
            style={{ marginBottom: '15px', marginTop: '15px' }}
          >
            <Col
              lg={24}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%'
              }}
            >
              {sale.image1 && (
                <Image style={{ height: '200px' }} src={sale.image1} />
              )}
              {sale.image2 && (
                <Image style={{ height: '200px' }} src={sale.image2} />
              )}
            </Col>
          </Row>
          <Row gutter={[16, 24]}>
            <Col
              lg={12}
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '50%'
              }}
            >
              {sale.image3 && (
                <Image style={{ height: '500px' }} src={sale.image3} />
              )}
            </Col>
            <Col
              lg={12}
              style={{
                display: 'grid',
                justifyContent: 'space-around',
                width: '50%'
              }}
            >
              {sale.image4 && (
                <Image style={{ height: '150px' }} src={sale.image4} />
              )}
              {sale.image5 && (
                <Image style={{ height: '150px' }} src={sale.image5} />
              )}
              {sale.image6 && (
                <Image style={{ height: '150px' }} src={sale.image6} />
              )}
            </Col>
          </Row>
        </td>
      </tr>
    </TableReport>
  );
};

export default Table;
