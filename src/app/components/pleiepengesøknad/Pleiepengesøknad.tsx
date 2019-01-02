import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import WelcomingPageContainer from '../../redux/containers/pages/welcoming-page/WelcomingPageContainer';
import routeConfig from '../../config/routeConfig';
import { Formik, FormikActions, FormikProps } from 'formik';
import MedlemsskapStep from '../steps/medlemsskap/MedlemsskapStep';
import RelasjonTilBarnStep from '../steps/relasjon-til-barn/RelasjonTilBarnStep';
import { StepID } from '../../config/stepConfig';
import SummaryStep from '../steps/summary/SummaryStep';

export interface PleiepengerFormdata {
    someField1: string;
    someField2: string;
}

class Pleiepengesøknad extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/velkommen" component={WelcomingPageContainer} />
                <Formik
                    initialValues={{ someField1: '', someField2: '' }}
                    onSubmit={(values: PleiepengerFormdata, actions: FormikActions<PleiepengerFormdata>) => {
                        console.log(values, actions);
                    }}
                    render={(formikProps: FormikProps<PleiepengerFormdata>) => (
                        <Switch>
                            <Route
                                path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.RELASJON_TIL_BARN}`}
                                render={(props) => <RelasjonTilBarnStep {...props} values={formikProps.values} />}
                            />
                            <Route
                                path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.MEDLEMSSKAP}`}
                                render={(props) => <MedlemsskapStep {...props} values={formikProps.values} />}
                            />
                            <Route
                                path={`${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.SUMMARY}`}
                                render={() => <SummaryStep />}
                            />
                            <Redirect to="/velkommen" />
                        </Switch>
                    )}
                />
                <Redirect to="/velkommen" />
            </Switch>
        );
    }
}

export default Pleiepengesøknad;
