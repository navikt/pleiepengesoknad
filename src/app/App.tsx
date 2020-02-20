import * as React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import moment from 'moment';
import Modal from 'nav-frontend-modal';
import { Locale } from 'common/types/Locale';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import IntroPage from './components/pages/intro-page/IntroPage';
import UnavailablePage from './components/pages/unavailable-page/UnavailablePage';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import RouteConfig from './config/routeConfig';
import { appIsRunningInDemoMode } from './utils/envUtils';
import { Feature, isFeatureEnabled } from './utils/featureToggleUtils';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import 'common/styles/globalStyles.less';

const localeFromSessionStorage = getLocaleFromSessionStorage();
moment.locale(localeFromSessionStorage);

const App: React.FunctionComponent = () => {
    const [locale, setLocale] = React.useState<Locale>(localeFromSessionStorage);
    return (
        <ApplicationWrapper
            locale={locale}
            onChangeLocale={(activeLocale: Locale) => {
                setLocaleInSessionStorage(activeLocale);
                setLocale(activeLocale);
            }}>
            {appIsRunningInDemoMode() && <Pleiepengesøknad />}
            {appIsRunningInDemoMode() === false && (
                <>
                    {isFeatureEnabled(Feature.UTILGJENGELIG) ? (
                        <UnavailablePage />
                    ) : (
                        <Switch>
                            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} component={Pleiepengesøknad} />
                            <Route path="/" component={IntroPage} />
                        </Switch>
                    )}
                </>
            )}
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
