import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';

import TableReport from 'components/Report/TableReport';
import Td from './Td';
import { Sale, SaleProduct } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';
import { systemColors } from 'utils/defaultValues';
import image from 'assets/contract.jpg';
interface PropTypes {
  sale: Sale;
}
const categorIdsArray = [1, 4];
const Table: React.FC<PropTypes> = ({ sale }) => {
  return (
    <TableReport
      title={`Contrato ${sale.id}`}
      image={sale?.company?.image || ''}
    >
      <tr style={{ border: '0' }}>
        <td style={{ border: '0' }}>
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
                <td>www.gramfort.com.br | gramfort@hotmail.com | @gramfort_</td>
              </tr>
            </tbody>
          </table>
          <p>
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
                  value={`${sale.visit?.address} ${sale.visit?.city} ${sale.visit?.state}`}
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
                  backgroundColor: systemColors.GREY,
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
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Total da Proposta</td>
                  <td>{formatPrice(Number(sale.value))}</td>
                </tr>
                <tr>
                  <td>Desconto Visita</td>
                  <td>{formatPrice(Number(sale.visit?.value))}</td>
                </tr>
                <tr>
                  <td>Valor Total</td>
                  <td>
                    {formatPrice(
                      Number(sale.value) - Number(sale.visit?.value)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <img src={image} alt="" style={{ maxWidth: '100%' }} />
        </td>
      </tr>
      {/* <table>
        <thead>
          <tr>
            <th style={{ borderRight: '0' }}>Codigo</th>
            <th style={{ borderRight: '0', borderLeft: '0' }}>Produto</th>
            <th style={{ borderRight: '0', borderLeft: '0' }}>Preço</th>
            <th style={{ borderRight: '0', borderLeft: '0' }}>Valor vendido</th>
            <th style={{ borderRight: '0', borderLeft: '0' }}>Quantidade</th>
            <th style={{ borderLeft: '0' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td title="Proposta Comercial nº" value={sale.id} />
            <Td colSpan={2} title="Consultor Técnico" value={sale.userName} />
          </tr>
          <tr>
            <Td colSpan={2} title="Cliente" value={sale.clientName} />
            <Td colSpan={2} title="CNPJ/CPF" value={sale.userName} />
          </tr>
          <tr>
            <Td colSpan={2} title="E-mail" value={sale.clientName} />
            <Td colSpan={2} title="Fone" value={sale.userName} />
          </tr>
          <tr>
            <Td colSpan={2} title="Local Aplicação" value={sale.clientName} />
            <Td colSpan={2} title="KM da Base" value={sale.userName} />
          </tr>
          <tr>
            <Td colSpan={2} title="Cliente" value={sale.clientName} />
            <Td title="Valor total" value={formatPrice(Number(sale.value!))} />
          </tr>
          {sale.productsSales.map((sp: SaleProduct, index: number) => (
            <tr key={index}>
              <td>{sp.productId}</td>
              <td>
                {sp.product.name} {sp.product.size}
              </td>
              <td>{formatPrice(Number(sp.product.price!))}</td>
              <td>{formatPrice(Number(sp.value!))}</td>
              <td>{sp.amount}</td>
              <td>{formatPrice(Number(sp.valueAmount!))}</td>
            </tr>
          ))}
          <tr>
            <Td title="Data" value={sale.createdAt} />
            <Td colSpan={2} title="Vendedor" value={sale.userName} />
            <Td colSpan={2} title="Cliente" value={sale.clientName} />
            <Td title="Valor total" value={formatPrice(Number(sale.value!))} />
          </tr>
          <tr>
            <Td colSpan={6} title="Obs." value={sale.note} />
          </tr>
        </tbody>
      </table> */}
    </TableReport>
  );
};

export default Table;
