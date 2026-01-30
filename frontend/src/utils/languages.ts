export interface ContractLabels {
  id: string;
  user: string;
  client: string;
  textClient: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  address: string;
  distance: string;
  item: string;
  decription: string;
  amount: string;
  curency: string;
  total: string;
  zipCode: string;
  expectedDateForApplication: string;
  totalService: string;
  visitDicount: string;
  valueTotal: string;
  visitTitle: string;
  info: string;
  clause1: string;
  clause2: string;
  clause3: string;
  clause4: string;
  textDefinition: string;
  textRealization: string;
  textDir: string;
  textAmountInput: string;

  titleVisit: string;
}
const BRL: ContractLabels = {
  id: 'Proposta Comercial nº',
  user: 'Consultor Técnico',
  client: 'Cliente/Contratante',
  textClient:
    'Prezado(a) Sr(a), {contact} atendendo ao seu pedido estamos enviando nossa proposta comercial de Hidrossemeadura.',
  cpfCnpj: 'CNPJ/CPF',
  email: 'E-mail',
  phone: 'Fone',
  address: 'Local Aplicação',
  distance: 'KM da Base',
  item: 'ITEM',
  decription: 'DESCRIÇÃO',
  amount: 'METROS',
  curency: 'R$/M2 ',
  total: 'TOTAL',
  zipCode: 'CEP',
  totalService: 'Total de serviços',
  visitDicount: 'Desconto visita técnica',
  valueTotal: 'Valor total da proposta',
  visitTitle: 'RELATÓRIO DE VISITA TÉCNICA',
  info: 'INFORMAÇÕES IMPORTANTES',
  expectedDateForApplication: 'Data prevista para execução',
  clause1: 'CLÁUSULA PRIMEIRA - DA FORMA DE PAGAMENTO',
  clause2: 'CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES GERAIS',
  clause3:
    'CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE PARA MANUTENÇÃO DA GARANTIA',
  clause4: 'CLÁUSULA QUARTA - INFORMAÇÕES/TERMOS ADCIONAIS',
  textDefinition: 'a definir',
  textRealization: 'Realizada por {user} em',
  textDir: 'Diretor Comercial GramFort',
  textAmountInput: 'litros de insumos',
  titleVisit: 'RECIBO DE PAGAMENTO DE VISITA TÉCNICA'
};
const PYG: ContractLabels = {
  ...BRL,
  id: 'Propuesta Comercial N.°',
  cpfCnpj: 'RUC',
  client: 'Cliente/Contratista',
  textClient:
    'Estimado Sr./Sra. {contact}, en respuesta a su solicitud, le enviamos nuestra propuesta comercial para hidrosiembra.',
  email: 'Correo electrónico',
  phone: 'Teléfono',
  address: 'Lugar de la solicitud',
  distance: 'Kilómetros desde la base',
  item: 'ARTÍCULO',
  decription: 'DESCRIPCIÓN',
  curency: 'PYG/M2 ',
  visitTitle: 'INFORME DE VISITA TÉCNICA',
  visitDicount: 'Descuento en visita técnica',
  valueTotal: 'Valor total de la propuesta',
  totalService: 'Servicios totales',
  info: 'INFORMACIÓN IMPORTANTE',
  clause1: 'CLÁUSULA PRIMERA - FORMA DE PAGO',
  clause2: 'CLÁUSULA DOS - OBLIGACIONES GENERALES',
  clause3:
    'CLÁUSULA TERCERA - OBLIGACIONES DEL CONTRATISTA PARA EL MANTENIMIENTO DE LA GARANTÍA',
  clause4: 'CLÁUSULA CUARTA - INFORMACIÓN/TÉRMINOS ADICIONALES',
  expectedDateForApplication: 'Fecha estimada de inicio',
  textDefinition: 'por definir',
  textRealization: 'Interpretado por {user} en',
  textDir: 'Director comercial de GramFort',
  textAmountInput: 'litros de suministros',
  titleVisit: 'RECIBO DE PAGO DE VISITA TÉCNICA'
};

export const language: any = {
  contracts: { BRL, PYG },
  visits: { BRL, PYG },
};
