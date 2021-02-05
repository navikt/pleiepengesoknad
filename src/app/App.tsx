import * as React from 'react';
import { render } from 'react-dom';
import { AmplitudeProvider } from '@navikt/sif-common-amplitude';
import moment from 'moment';
import Modal from 'nav-frontend-modal';
import AppStatusWrapper from '@navikt/sif-common-core/lib/components/app-status-wrapper/AppStatusWrapper';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import UnavailablePage from './components/pages/unavailable-page/UnavailablePage';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
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

const getAppStatusSanityConfig = () => {
    const projectId = getEnvironmentVariable('APPSTATUS_PROJECT_ID');
    const dataset = getEnvironmentVariable('APPSTATUS_DATASET');
    return !projectId || !dataset ? undefined : { projectId, dataset };
};

const App = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);

    const appStatusSanityConfig = getAppStatusSanityConfig();

    return (
        <AmplitudeProvider
            applicationKey={APPLICATION_KEY}
            isActive={getEnvironmentVariable('USE_AMPLITUDE') === 'true'}>
            <ApplicationWrapper
                locale={locale}
                onChangeLocale={(activeLocale: Locale) => {
                    setLocaleInSessionStorage(activeLocale);
                    setLocale(activeLocale);
                }}>
                {appStatusSanityConfig ? (
                    <AppStatusWrapper
                        applicationKey={APPLICATION_KEY}
                        unavailableContentRenderer={() => <UnavailablePage />}
                        sanityConfig={appStatusSanityConfig}
                        contentRenderer={() => <Pleiepengesøknad />}
                    />
                ) : (
                    <Pleiepengesøknad />
                )}
            </ApplicationWrapper>
        </AmplitudeProvider>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
