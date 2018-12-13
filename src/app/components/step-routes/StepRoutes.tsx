import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RelasjonTilBarnStep from '../steps/relasjon-til-barn/RelasjonTilBarnStep';
import routeConfig from '../../config/routeConfig';

const StepRoutes: React.FunctionComponent = () => (
    <Switch>
        <Route path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/relasjon-til-barn`} component={RelasjonTilBarnStep} />
        <Redirect to="/" />
    </Switch>
);

export default StepRoutes;
