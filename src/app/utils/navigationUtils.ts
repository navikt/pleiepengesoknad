import { History } from 'history';
import RouteConfig from '../config/routeConfig';
import routeConfig, { getRouteUrl } from '../config/routeConfig';
import { StepID } from '../søknad/søknadStepsConfig';
import appSentryLogger from './appSentryLogger';
import { getEnvironmentVariable } from './envUtils';

export const userIsCurrentlyOnErrorPage = () => {
    return window.location.pathname === getRouteUrl(routeConfig.ERROR_PAGE_ROUTE);
};

/** Hard redirect enforcing page reload */
const relocateTo = (url: string): void => {
    window.location.assign(url);
};

/** Simple route change, no page reload */
export const navigateTo = (route: string, history: History): void => {
    if (history.push) {
        history.push(route);
    } else {
        appSentryLogger.logError('history.push undefined', JSON.stringify({ history, route }));
    }
};
export const navigateToSoknadStep = (step: StepID, history: History): void => history.push(`${step}`);

export const relocateToLoginPage = (): void => relocateTo(getEnvironmentVariable('LOGIN_URL'));
export const relocateToNavFrontpage = (): void => relocateTo('https://www.nav.no/');
export const relocateToSoknad = (): void => relocateTo(getRouteUrl(RouteConfig.SØKNAD_ROUTE_PREFIX));
export const relocateToMinSide = (): void => relocateTo(getEnvironmentVariable('MINSIDE_URL'));

export const navigateToErrorPage = (history: History): void => {
    navigateTo(RouteConfig.ERROR_PAGE_ROUTE, history);
};
