import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RelasjonTilBarnStep from '../steps/relasjon-til-barn/RelasjonTilBarnStep';
import MedlemsskapStep from '../steps/medlemsskap/MedlemsskapStep';
import routeConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import SummaryStep from '../steps/summary/SummaryStep';

const StepRoutes: React.FunctionComponent = () => (
    <Switch>
        <Route
            component={RelasjonTilBarnStep}
            path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.RELASJON_TIL_BARN}`}
        />
        <Route component={MedlemsskapStep} path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.MEDLEMSSKAP}`} />
        <Route component={SummaryStep} path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.SUMMARY}`} />
        <Redirect to="/" />
    </Switch>
);

export default StepRoutes;
