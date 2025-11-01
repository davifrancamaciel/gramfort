import { IOptions } from 'utils/commonInterfaces';
import { appRoutes, userType } from 'utils/defaultValues';
import { UserCognito, UserCognitoAttribute, Users } from './interfaces';

export const mapUser = (user: UserCognito): Users => {
  return {
    id: findAttribute(user.Attributes, 'sub'),
    name: findAttribute(user.Attributes, 'name'),
    email: findAttribute(user.Attributes, 'email'),
    companyId: findAttribute(user.Attributes, 'custom:company_id'),
    accessType: user.Groups,
    // login: user.Username,
    status: user.Enabled,
    userStatusText: user.UserStatus,
    type: 'USER',
    active: user.Enabled
  };
};

const findAttribute = (array: UserCognitoAttribute[], name: string) => {
  const obj = array.find((a: UserCognitoAttribute) => a.Name === name);
  return obj ? obj.Value : '';
};

export const getType = () => {
  if (window.location.pathname.includes(appRoutes.clients))
    return userType.CLIENT;
  if (window.location.pathname.includes(appRoutes.suppliers))
    return userType.SUPPLIER;
  return userType.USER;
};

export const getTitle = (path: string, isPlural: boolean = false) => {
  switch (path) {
    case userType.CLIENT:
      return `Cliente${isPlural ? 's' : ''}`;
    case userType.SUPPLIER:
      return `Fornecedor${isPlural ? 'es' : ''}`;
    default:
      return `Usuário${isPlural ? 's' : ''}`;
  }
};

const array = [
  'INSTAGRAM',
  'FACEBOOK ',
  'GOOGLE ',
  'TIKTOK ',
  'INDICAÇÃO EXCLIENTE',
  'INDICAÇÃO PROFISSIONAL ',
  'CAPTAÇÃO NA OBRA ',
  'CAPTAÇÃO ATIVA ',
  'FACHADA DE OBRA',
  'OUTDOOR',
  'RÁDIO  ',
  'MÍDIA CARROS ',
  'FEIRA/EVENTO ',
  'TV ',
  'OUTROS '
];

export const arrayCapture: IOptions[] = array.map((item: string) => ({
  value: item,
  label: item
}));

const levelArray = [1, 2, 3, 4, 5];
export const arrayLevel: IOptions[] = levelArray.map((item: number) => ({
  value: item.toString(),
  label: item.toString()
}));

const natureArray = ['FISICA', 'JURÍDICA'];
export const arrayNature: IOptions[] = natureArray.map((item: string) => ({
  value: item,
  label: item
}));

const demandArray = [
  'Casa',
  'Sítio',
  'Fazenda/Haras',
  'Condomínio',
  'Comercial',
  'Rodovia/Estrada',
  'Empreendimento ',
  'Prefeitura ',
  'Lote/Terreno',
  'Outros',
];
export const arrayDemand: IOptions[] = demandArray.map((item: string) => ({
  value: item,
  label: item
}));
