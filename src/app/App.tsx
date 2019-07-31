import * as React from 'react';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import { Route, Switch } from 'react-router-dom';
import routeConfig from './config/routeConfig';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import IntroPage from './components/pages/intro-page/IntroPage';
import { render } from 'react-dom';
import Modal from 'nav-frontend-modal';
import { Locale } from './types/Locale';
import './globalStyles.less';

const App: React.FunctionComponent = () => {
    const [locale, setLocale] = React.useState<{ activeLocale: Locale }>({ activeLocale: 'nb' });

    return (
        <ApplicationWrapper
            locale={locale.activeLocale}
            onChangeLocale={(activeLocale: Locale) => setLocale({ activeLocale })}>
            <Switch>
                <Route path={routeConfig.SØKNAD_ROUTE_PREFIX} component={Pleiepengesøknad} />
                <Route path="/" component={IntroPage} />
            </Switch>
        </ApplicationWrapper>
    );
};

const root = document.getElementById('app');
Modal.setAppElement('#app');
render(<App />, root);
