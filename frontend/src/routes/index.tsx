import React, { Suspense, lazy } from 'react';
import {
  Redirect,
  BrowserRouter,
  Route as RouteDOM,
  Switch
} from 'react-router-dom';

import Route from './Route';
import SuspenseLoading from 'components/SuspenseLoading';

import { roules, appRoutes } from 'utils/defaultValues';
import { IRouteProps } from './interfaces';

const PageNotFound = lazy(() => import('components/PageNotFound'));
const PageForbidden = lazy(() => import('components/PageForbidden'));
const Login = lazy(() => import('pages/Login'));
const Forgot = lazy(() => import('pages/ForgotPassword'));
const ChangePassword = lazy(() => import('pages/ChangePassword'));
const Dashboard = lazy(() => import('pages/Dashboard'));
const UserList = lazy(() => import('pages/User/List'));
const UserCreateEdit = lazy(() => import('pages/User/CreateEdit'));
const SaleList = lazy(() => import('pages/Sale/List'));
const SaleCreateEdit = lazy(() => import('pages/Sale/CreateEdit'));
const SaleContract = lazy(() => import('pages/Sale/Contract'));
const ProductList = lazy(() => import('pages/Product/List'));
const ProductCreateEdit = lazy(() => import('pages/Product/CreateEdit'));
const ProductDetails = lazy(() => import('pages/Product/Details'));
const ExpenseCommisionList = lazy(() => import('pages/Expense/Commision'));
const ExpenseList = lazy(() => import('pages/Expense/List'));
const ExpenseCreateEdit = lazy(() => import('pages/Expense/CreateEdit'));
const VisitList = lazy(() => import('pages/Visit/List'));
const VisitCreateEdit = lazy(() => import('pages/Visit/CreateEdit'));
const VehicleList = lazy(() => import('pages/Vehicle/List'));
const VehicleCreateEdit = lazy(() => import('pages/Vehicle/CreateEdit'));
const CompanyList = lazy(() => import('pages/Company/List'));
const CompanyCreateEdit = lazy(() => import('pages/Company/CreateEdit'));
const ServicesList = lazy(() => import('pages/Services/List'));

const routesArray: IRouteProps[] = [
  { path: '/login', component: Login, isPrivate: false },
  { path: '/forgot-password', component: Forgot, isPrivate: false },
  { path: '/change-password', component: ChangePassword },
  { path: '/', component: Dashboard },
  { path: `/${appRoutes.users}`, component: UserList, roule: roules.users },
  {
    path: `/${appRoutes.users}/create`,
    component: UserCreateEdit,
    roule: roules.users
  },
  {
    path: `/${appRoutes.users}/edit/:id`,
    component: UserCreateEdit,
    roule: roules.users
  },
  { path: `/${appRoutes.clients}`, component: UserList, roule: roules.clients },
  {
    path: `/${appRoutes.clients}/create`,
    component: UserCreateEdit,
    roule: roules.clients
  },
  {
    path: `/${appRoutes.clients}/edit/:id`,
    component: UserCreateEdit,
    roule: roules.clients
  },
  {
    path: `/${appRoutes.suppliers}`,
    component: UserList,
    roule: roules.suppliers
  },
  {
    path: `/${appRoutes.suppliers}/create`,
    component: UserCreateEdit,
    roule: roules.suppliers
  },
  {
    path: `/${appRoutes.suppliers}/edit/:id`,
    component: UserCreateEdit,
    roule: roules.suppliers
  },

  {
    path: `/${appRoutes.sales}`,
    component: SaleList,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/create`,
    component: SaleCreateEdit,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/edit/:id`,
    component: SaleCreateEdit,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/my-commisions`,
    component: ExpenseCommisionList,
    roule: roules.sales
  },
  {
    path: `/${appRoutes.sales}/contract/:id`,
    component: SaleContract,
    isPrivate: false
  },
  {
    path: `/${appRoutes.products}`,
    component: ProductList,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/create`,
    component: ProductCreateEdit,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/edit/:id`,
    component: ProductCreateEdit,
    roule: roules.products
  },
  {
    path: `/${appRoutes.products}/details/:id`,
    component: ProductDetails,
    roule: roules.products
  },
  {
    path: `/${appRoutes.expenses}`,
    component: ExpenseList,
    roule: roules.expenses
  },
  {
    path: `/${appRoutes.expenses}/create`,
    component: ExpenseCreateEdit,
    roule: roules.expenses
  },
  {
    path: `/${appRoutes.expenses}/edit/:id`,
    component: ExpenseCreateEdit,
    roule: roules.expenses
  },
  {
    path: `/${appRoutes.shopping}`,
    component: ExpenseList,
    roule: roules.shopping
  },
  {
    path: `/${appRoutes.shopping}/create`,
    component: ExpenseCreateEdit,
    roule: roules.shopping
  },
  {
    path: `/${appRoutes.shopping}/edit/:id`,
    component: ExpenseCreateEdit,
    roule: roules.shopping
  },
  {
    path: `/${appRoutes.companies}`,
    component: CompanyList,
    roule: roules.administrator
  },
  {
    path: `/${appRoutes.companies}/create`,
    component: CompanyCreateEdit,
    roule: roules.administrator
  },
  {
    path: `/${appRoutes.companies}/edit/:id`,
    component: CompanyCreateEdit,
    roule: roules.administrator
  },
  {
    path: `/${appRoutes.visits}`,
    component: VisitList,
    roule: roules.visit
  },
  {
    path: `/${appRoutes.visits}/create`,
    component: VisitCreateEdit,
    roule: roules.visit
  },
  {
    path: `/${appRoutes.visits}/edit/:id`,
    component: VisitCreateEdit,
    roule: roules.visit
  },
  {
    path: `/${appRoutes.vehicles}`,
    component: VehicleList,
    roule: roules.vehicles
  },
  {
    path: `/${appRoutes.vehicles}/create`,
    component: VehicleCreateEdit,
    roule: roules.vehicles
  },
  {
    path: `/${appRoutes.vehicles}/edit/:id`,
    component: VehicleCreateEdit,
    roule: roules.vehicles
  },
  {
    path: `/${appRoutes.services}`,
    component: ServicesList,
    roule: roules.administrator
  }
];

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoading />}>
        <Switch>
          {routesArray.map((props: IRouteProps, i: number) => (
            <Route key={i} {...props} exact={true} />
          ))}
          <RouteDOM path="/access-not-allowed" component={PageForbidden} />
          <RouteDOM path="/not-found" component={PageNotFound} />
          <Redirect from="*" to="/not-found" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
