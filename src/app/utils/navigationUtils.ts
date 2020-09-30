import { History } from 'history';
import RouteConfig from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';

const loginUrl = getEnvironmentVariable('LOGIN_URL');
const navNoUrl = 'https://www.nav.no/';
const welcomePageUrl = `${getEnvironmentVariable('PUBLIC_PATH')}${RouteConfig.WELCOMING_PAGE_ROUTE}`;

export const redirectTo = (route: string) => window.location.assign(route);
export const redirectToLoginPage = () => window.location.assign(loginUrl);
export const redirectToNAVno = () => window.location.assign(navNoUrl);
export const redirectToWelcomePage = (history: History) => window.location.assign(welcomePageUrl);
export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToWelcomePage = (history: History) => history.push(RouteConfig.WELCOMING_PAGE_ROUTE);
