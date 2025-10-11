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
