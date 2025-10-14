import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';

import TableReport from 'components/Report/TableReport';
import Td from './Td';
import { Visit } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';
import assinatura from 'assets/assinatura.png';

interface PropTypes {
  item: Visit;
}

const Print: React.FC<PropTypes> = ({ item }) => {
  return (
    <PrintContainer show={true}>
      <TableReport
        title={`Visita ${item.id}`}
        image={item?.company?.image || ''}
      >
        <div style={{ padding: '35px', fontSize: '15px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>
            <strong>VISITA TÉCNICA</strong>
          </h2>
          <p>
            A empresa{' '}
            <strong>Gramfort Hidrossemeadura Soluções Ambientais LTDA</strong>{' '}
            CNPJ: 50.641.930/0001-00 com sede na Estrada União e Industria,
            22.373 Galpão 04 — Pedro do Rio — Petrópolis — RJ identificou o
            pagamento realizado no valor de {formatPrice(Number(item.value))} na
            conta: Santander Ag 4421 CC 13002793-2 Gramfort Hidrossemeadura Pix:
            CNPJ {item.company?.pixKey} referente a visita técnica para medição
            de uma área para projeto de Hidrossemeadura, para{' '}
            <strong>{item.client?.name}</strong>, visita em
            {item.address} - {item.city} - {item.state}. Declaro ainda que esse
            valor será abatido de um eventual contrato de prestação de serviço
            do valor total acordado.
          </p>

          <p>Data para visita {item.date}</p>
          <p style={{ marginTop: '50px' }}>{item.createdAt}</p>

          <img alt={''} src={assinatura} style={{ width: '200px' }} />
          <p>Valter Rodrigo dos Santos</p>
          <p>CPF:101.311.397-70</p>
        </div>
        {/* <table>
          <thead>
            <tr>
              <th style={{ borderRight: '0' }}>Codigo</th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>Produto</th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>Preço</th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>
                Valor vendido
              </th>
              <th style={{ borderRight: '0', borderLeft: '0' }}>Quantidade</th>
              <th style={{ borderLeft: '0' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {item.productsSales.map((sp: SaleProduct, index: number) => (
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
              <Td title="Data" value={item.createdAt} />
              <Td colSpan={2} title="Vendedor" value={item.userName} />
              <Td colSpan={2} title="Cliente" value={item.clientName} />
              <Td
                title="Valor total"
                value={formatPrice(Number(item.value!))}
              />
            </tr>
            <tr>
              <Td colSpan={6} title="Obs." value={item.note} />
            </tr>
          </tbody>
        </table> */}
      </TableReport>
    </PrintContainer>
  );
};

export default Print;
