import React from 'react';
import PrintContainer from 'components/Report/PrintContainer';

import TableReport from 'components/Report/TableReport';

import { Visit } from '../../interfaces';
import { formatPrice } from 'utils/formatPrice';
import assinatura from 'assets/assinatura.png';
import { formatDate, formatDateText } from 'utils/formatDate';

interface PropTypes {
  item: Visit;
}

const Print: React.FC<PropTypes> = ({ item }) => {
  return (
    <PrintContainer show={true}>
      <TableReport title={``} image={item?.company?.image || ''}>
        <div style={{ padding: '35px', fontSize: '15px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>
            <strong>RECIBO DE PAGAMENTO DE VISITA TÉCNICA</strong>
          </h2>
          <div
            style={{
              display: 'grid',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <p>
              Eu, <strong>{item.user?.name}</strong>, na qualidade de Consultor
              Técnico da empresa <strong>{item.company?.fantasyName}</strong>,
              inscrita no CNPJ sob nº {item.company?.cnpj}, com sede na{' '}
              {item.company?.address} – {item.company?.city}/
              {item.company?.state}, declaro, para os devidos fins, que recebi
              nesta data do(a) Sr(a). <strong>{item.client?.name}</strong> a
              quantia de <strong>{formatPrice(Number(item.value))}</strong>,
              referente ao pagamento de uma visita técnica.{' '}
            </p>
            <p>
              A referida visita técnica será agendada e realizada no prazo de
              até 15 (quinze) dias, no endereço {item.address} - {item.city}/
              {item.state}.
            </p>
            <p>
              Fica acordado entre as partes que o valor pago neste recibo será
              integralmente deduzido do valor total, caso o cliente venha a
              firmar contrato de prestação de serviços de hidrossemeadura com a
              empresa. Por outro lado, caso não ocorra a formalização do
              contrato de prestação de serviços – por qualquer motivo - entre as
              partes, o valor pago não será reembolsado.
            </p>
            <p>Data para visita {formatDate(item.date)}</p>
          </div>
          <p
            style={{
              marginTop: '50px',
              display: 'grid',
              justifyContent: 'center'
            }}
          >
            {item.company?.city}, {formatDateText(item.createdAt!)}
          </p>

          <div
            style={{
              marginTop: '100px',
              display: 'grid',
              justifyContent: 'center'
            }}
          >
            <img alt={''} src={assinatura} style={{ width: '200px' }} />

            <p style={{ fontSize: '15px' }}>
              <strong>Valter Rodrigo S Silva</strong>
            </p>
            <p
              style={{
                fontSize: '11px',
                marginTop: '2px',
                marginBottom: '2px'
              }}
            >
              {item.company?.fantasyName}
            </p>

            <p
              style={{
                fontSize: '11px',
                marginTop: '2px',
                marginBottom: '2px'
              }}
            >
              - Diretor Geral -
            </p>
          </div>
        </div>
      </TableReport>
    </PrintContainer>
  );
};

export default Print;
