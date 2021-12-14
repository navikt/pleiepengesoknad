import * as React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude/lib';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import dayjs from 'dayjs';
import moment from 'moment';
import Modal from 'nav-frontend-modal';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import RouteConfig from './config/routeConfig';
import IntroPage from './pages/intro-page/IntroPage';
import UnavailablePage from './pages/unavailable-page/UnavailablePage';
import Søknad from './søknad/Søknad';
import appSentryLogger from './utils/appSentryLogger';
import { getEnvironmentVariable } from './utils/envUtils';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import '@navikt/sif-common-core/lib/styles/globalStyles.less';
import './app.less';

export const APPLICATION_KEY = 'pleiepengesoknad';
export const SKJEMANAVN = 'Søknad om pleiepenger';

appSentryLogger.init();

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);
dayjs.locale(localeFromSessionStorage);

const getAppStatusSanityConfig = () => {
    const projectId = getEnvironmentVariable('APPSTATUS_PROJECT_ID');
    const dataset = getEnvironmentVariable('APPSTATUS_DATASET');
    return !projectId || !dataset ? undefined : { projectId, dataset };
};

const App = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);

    const appStatusSanityConfig = getAppStatusSanityConfig();
    const publicPath = getEnvironmentVariable('PUBLIC_PATH');

    const content = (
        <Switch>
            <Route path="/" component={IntroPage} exact={true} />
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} component={Søknad} />
        </Switch>
    );

    return (
        <AmplitudeProvider applicationKey={APPLICATION_KEY}>
            <ApplicationWrapper
                locale={locale}
                publicPath={publicPath}
                onChangeLocale={(activeLocale: Locale) => {
                    setLocaleInSessionStorage(activeLocale);
                    setLocale(activeLocale);
                }}>
                {appStatusSanityConfig ? (
                    <AppStatusWrapper
                        applicationKey={APPLICATION_KEY}
                        unavailableContentRenderer={() => <UnavailablePage />}
                        sanityConfig={appStatusSanityConfig}
                        contentRenderer={() => content}
                    />
                ) : (
                    content
                )}
            </ApplicationWrapper>
        </AmplitudeProvider>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
