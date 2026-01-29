import React, { useEffect, useState } from 'react';
import { Route as ReactDOMRoute, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import DefaultLayout from 'pages/_layout/Default';
import AuthLayout from 'pages/_layout/Auth';

import { checkRouleProfileAccess } from 'utils/checkRouleProfileAccess';
import { IRouteProps } from './interfaces';
import { useAppContext } from 'hooks/contextLib';
import { Company } from '@/pages/Company/interfaces';

const Route: React.FC<IRouteProps> = ({
  isPrivate = true,
  component: Component,
  path,
  roule,
  ...rest
}) => {
  const {
    isAuthenticated,
    userHasAuthenticated,
    userAuthenticated,
    setUserAuthenticated,
    companies,
    setCompanySelected,
    setUserCompanyId
  } = useAppContext();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [groupsUser, setGroupsUser] = useState<string[]>([]);

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const userAuth = await Auth.currentAuthenticatedUser();
        userHasAuthenticated(!!userAuth);
        setUserAuthenticated(userAuth);
        const groupsAuth =
          userAuth.signInUserSession.accessToken.payload['cognito:groups'];
        setGroupsUser(groupsAuth);
      } catch (e) {
        console.log(e);
        userHasAuthenticated(false);
        if (e != 'No current user') {
          console.log(`Erro na verificação de sessão em Route.ts`, e);
        }
      }
      setIsAuthenticating(false);
    };
    checkAccessToken();
  }, []);

  useEffect(() => {
    const companyId =
      userAuthenticated?.signInUserSession?.idToken?.payload[
        'custom:company_id'
      ];
    setUserCompanyId(companyId);
    const company = companies.find((c: Company) => c.id === companyId);
    setCompanySelected(company);
  }, [userAuthenticated, companies]);

  if (!isAuthenticating && !isAuthenticated && isPrivate) {
    const returnUrl = `?r=${window.location.pathname}${window.location.search}`;
    return <Redirect to={`/login${returnUrl}`} />;
  }

  if (!isAuthenticating && isAuthenticated && !isPrivate) {
    return <Redirect to="/" />;
  }

  if (
    !isAuthenticating &&
    isAuthenticated &&
    isPrivate &&
    roule &&
    !checkRouleProfileAccess(groupsUser, roule)
  ) {
    return <Redirect to="/access-not-allowed" />;
  }

  const Layout = isAuthenticated ? DefaultLayout : AuthLayout;

  return !isAuthenticating ? (
    <ReactDOMRoute
      {...rest}
      render={(props) => (
        <Layout {...rest}>
          <Component {...props} {...rest} />
        </Layout>
      )}
    />
  ) : null;
};

export default Route;
