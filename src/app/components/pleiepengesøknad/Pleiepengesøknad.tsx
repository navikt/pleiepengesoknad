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
                    initialValues={{ someField1: '', someField2: '' }}
                    onSubmit={(values: PleiepengerFormdata, actions: FormikActions<PleiepengerFormdata>) => {
                        actions.setSubmitting(false);
                        actions.setFormikState({
                            submitCount: 0
                        });
                        return 1;
                    }}
                    render={(formikProps: FormikProps<PleiepengerFormdata>) => {
                        const { values, handleSubmit, isValid, submitForm } = formikProps;
                        return (
                            <Switch>
                                <Route
                                    path={getSøknadRoute(StepID.RELASJON_TIL_BARN)}
                                    render={(props) => (
                                        <RelasjonTilBarnStep
                                            onSubmit={submitForm}
                                            values={values}
                                            isValid={isValid}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path={getSøknadRoute(StepID.MEDLEMSSKAP)}
                                    render={(props) => (
                                        <MedlemsskapStep {...props} values={values} onSubmit={handleSubmit} />
                                    )}
                                />
                                <Route
                                    path={getSøknadRoute(StepID.SUMMARY)}
                                    render={(props) => (
                                        <SummaryStep {...props} values={values} onSubmit={handleSubmit} />
                                    )}
                                />
                                <Redirect to="/velkommen" />
                            </Switch>
                        );
                    }}
                />
                <Redirect to="/velkommen" />
            </Switch>
        );
    }
}

export default Pleiepengesøknad;
