import { History } from 'history';
import routeConfig from '../config/routeConfig';

export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR_PAGE_ROUTE);
export const userIsCurrentlyOnErrorPage = () => window.location.pathname === routeConfig.ERROR_PAGE_ROUTE;
