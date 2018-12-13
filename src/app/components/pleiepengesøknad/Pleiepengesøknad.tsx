import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import WelcomingPageContainer from '../../redux/containers/pages/welcoming-page/WelcomingPageContainer';
import StepRoutes from '../step-routes/StepRoutes';
import routeConfig from '../../config/routeConfig';

class Pleiepengesøknad extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/velkommen" component={WelcomingPageContainer} />
                <Route path={routeConfig.SØKNAD_ROUTE_PREFIX} component={StepRoutes} />
                <Redirect to="/velkommen" />
            </Switch>
        );
    }
}

export default Pleiepengesøknad;
