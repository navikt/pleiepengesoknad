import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import WelcomingPageContainer from '../../redux/containers/pages/welcoming-page/WelcomingPageContainer';
import { Formik, FormikActions, FormikProps } from 'formik';
import MedlemsskapStep from '../steps/medlemsskap/MedlemsskapStep';
import RelasjonTilBarnStep from '../steps/relasjon-til-barn/RelasjonTilBarnStep';
import { StepID } from '../../config/stepConfig';
import SummaryStep from '../steps/summary/SummaryStep';
import { getSøknadRoute } from '../../utils/routeConfigHelper';

export interface PleiepengerFormdata {
    someField1?: string;
    someField2?: string;
}

class Pleiepengesøknad extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/velkommen" component={WelcomingPageContainer} />
                <Formik
                    initialValues={{ someField1: undefined, someField2: undefined }}
                    onSubmit={(values: PleiepengerFormdata, actions: FormikActions<PleiepengerFormdata>) => {}}
                    render={(formikProps: FormikProps<PleiepengerFormdata>) => (
                        <Switch>
                            <Route
                                path={getSøknadRoute(StepID.RELASJON_TIL_BARN)}
                                render={(props) => (
                                    <RelasjonTilBarnStep
                                        {...props}
                                        values={formikProps.values}
                                        onSubmit={formikProps.handleSubmit}
                                    />
                                )}
                            />
                            <Route
                                path={getSøknadRoute(StepID.MEDLEMSSKAP)}
                                render={(props) => (
                                    <MedlemsskapStep
                                        {...props}
                                        values={formikProps.values}
                                        onSubmit={formikProps.handleSubmit}
                                    />
                                )}
                            />
                            <Route
                                path={getSøknadRoute(StepID.SUMMARY)}
                                render={(props) => (
                                    <SummaryStep
                                        {...props}
                                        values={formikProps.values}
                                        onSubmit={formikProps.handleSubmit}
                                    />
                                )}
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
