import * as React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import Modal from 'nav-frontend-modal';
import { Locale } from 'common/types/Locale';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import UnavailablePage from './components/pages/unavailable-page/UnavailablePage';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import appSentryLogger from './utils/appSentryLogger';
import { Feature, isFeatureEnabled } from './utils/featureToggleUtils';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import 'common/styles/globalStyles.less';
import './app.less';

appSentryLogger.init();

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);

const App = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    return (
        <ApplicationWrapper
            locale={locale}
            onChangeLocale={(activeLocale: Locale) => {
                setLocaleInSessionStorage(activeLocale);
                setLocale(activeLocale);
            }}>
            {isFeatureEnabled(Feature.UTILGJENGELIG) ? <UnavailablePage /> : <Pleiepengesøknad />}
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
