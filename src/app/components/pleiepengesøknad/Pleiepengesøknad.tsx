import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import WelcomingPageContainer from '../../redux/containers/pages/welcoming-page/WelcomingPageContainer';
import StepBasedFormWrapper from '../step-based-form-wrapper/StepBasedFormWrapper';

const Pleiepengesøknad: React.FunctionComponent = () => (
    <Switch>
        <Route path="/velkommen" component={WelcomingPageContainer} />
        <StepBasedFormWrapper />
        <Redirect to="/velkommen" />
    </Switch>
);

export default Pleiepengesøknad;
