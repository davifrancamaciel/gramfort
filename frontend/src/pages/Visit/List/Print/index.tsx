import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';

import TableReport from 'components/Report/TableReport';

import { Visit } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';
import assinatura from 'assets/assinatura.png';
import { extractHour, formatDate, formatDateText } from 'utils/formatDate';

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
            pagamento realizado no valor de <strong>{formatPrice(Number(item.value))}</strong> na
            conta: Santander Ag 4421 CC 13002793-2 Gramfort Hidrossemeadura Pix:
            CNPJ {item.company?.pixKey} referente a visita técnica para medição
            de uma área para projeto de Hidrossemeadura, para{' '}
            <strong>{item.client?.name}</strong>, visita em{' '}
            {item.address} - {item.city} - {item.state}. Declaro ainda que esse
            valor será abatido de um eventual contrato de prestação de serviço
            do valor total acordado. Cosultor <strong>{item.user?.name}</strong>
          </p>

          <p>
            Data para visita {formatDate(item.date)} Horário:{' '}
            {extractHour(item.date!)}
          </p>
          <p style={{ marginTop: '50px' }}>{formatDateText(item.createdAt!)}</p>

          <img alt={''} src={assinatura} style={{ width: '200px' }} />
          <p>Valter Rodrigo dos Santos</p>
          <p>CPF:101.311.397-70</p>
        </div>
      </TableReport>
    </PrintContainer>
  );
};

export default Print;
