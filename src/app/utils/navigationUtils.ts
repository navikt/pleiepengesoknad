import { History } from 'history';
import routeConfig from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const loginUrl = getEnvironmentVariable('LOGIN_URL');
const navNoUrl = 'https://www.nav.no/';
const welcomePageUrl = `${getEnvironmentVariable('PUBLIC_PATH')}/${routeConfig.WELCOMING_PAGE_ROUTE}`;

const getLoginUrl = (route?: string): string => {
    return route ? `${loginUrl}${route}` : loginUrl;
};

export const redirectTo = (route: string) => window.location.assign(route);
export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToLoginPage = (route?: string) => window.location.assign(getLoginUrl(route));
export const userIsCurrentlyOnErrorPage = () => window.location.pathname === routeConfig.ERROR_PAGE_ROUTE;
export const navigateToNAVno = () => window.location.assign(navNoUrl);
export const navigateToWelcomePage = () => window.location.assign(welcomePageUrl);
