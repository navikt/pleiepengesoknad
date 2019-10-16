import * as React from 'react';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import { Route, Switch } from 'react-router-dom';
import RouteConfig from './config/routeConfig';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import IntroPage from './components/pages/intro-page/IntroPage';
import { render } from 'react-dom';
import Modal from 'nav-frontend-modal';
import { Locale } from './types/Locale';
import { getLocaleFromSessionStorage, setLocaleInSessionStorage } from './utils/localeUtils';
import './styles/globalStyles.less';
import { appIsRunningInDemoMode } from './utils/envUtils';

const localeFromSessionStorage = getLocaleFromSessionStorage();

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
                <Switch>
                    <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} component={Pleiepengesøknad} />
                    <Route path="/" component={IntroPage} />
                </Switch>
            )}
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
