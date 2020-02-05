import { History } from 'history';
import routeConfig from '../config/routeConfig';
import { getEnvironmentVariable } from './envUtils';
import { StepID } from 'app/config/stepConfig';
import { PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import { persist } from 'app/api/api';

const loginUrl = getEnvironmentVariable('LOGIN_URL');
const navNoUrl = 'https://www.nav.no/';
const welcomePageUrl = `${getEnvironmentVariable('PUBLIC_PATH')}/${routeConfig.WELCOMING_PAGE_ROUTE}`;

export const persistAndNavigateTo = (
    history: History<any>,
    lastStepID: StepID,
    data: PleiepengesøknadFormData,
    nextStep?: string
) => {
    persist(data, lastStepID);
    if (nextStep) {
        history.push(nextStep);
    }
};

export const redirectTo = (route: string) => window.location.assign(route);
export const navigateTo = (route: string, history: History) => history.push(route);
export const navigateToErrorPage = (history: History) => history.push(routeConfig.ERROR_PAGE_ROUTE);
export const navigateToLoginPage = () => window.location.assign(loginUrl);
export const userIsCurrentlyOnErrorPage = () => window.location.pathname === routeConfig.ERROR_PAGE_ROUTE;
export const navigateToNAVno = () => window.location.assign(navNoUrl);
export const navigateToWelcomePage = () => window.location.assign(welcomePageUrl);
