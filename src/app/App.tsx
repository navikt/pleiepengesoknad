import { SanityConfig } from '@navikt/appstatus-react/lib/types';
import React from 'react';
import { render } from 'react-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude/lib';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import dayjs from 'dayjs';
import Modal from 'nav-frontend-modal';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import RouteConfig from './config/routeConfig';
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
dayjs.locale(localeFromSessionStorage);

const getAppStatusSanityConfig = (): SanityConfig | undefined => {
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
            <Route path="/" exact={true}>
                <Redirect to={RouteConfig.SØKNAD_ROUTE_PREFIX} />
            </Route>
            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX}>
                <Søknad />
            </Route>
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
