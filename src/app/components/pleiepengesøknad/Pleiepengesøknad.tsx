import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import WelcomingPageContainer from '../../redux/containers/pages/welcoming-page/WelcomingPageContainer';
import { Formik, FormikBag, FormikProps } from 'formik';
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
                    onSubmit={(
                        values: PleiepengerFormdata,
                        { setSubmitting, setFormikState }: FormikBag<PleiepengerFormdata, PleiepengerFormdata>
                    ) => {
                        setSubmitting(false);
                        setFormikState({
                            submitCount: 0
                        });
                    }}
                    render={({
                        values,
                        isValid,
                        submitForm
                    }: FormikProps<PleiepengerFormdata> & { submitForm: () => Promise<void> }) => {
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
                                        <MedlemsskapStep
                                            onSubmit={submitForm}
                                            values={values}
                                            isValid={isValid}
                                            {...props}
                                        />
                                    )}
                                />
                                <Route
                                    path={getSøknadRoute(StepID.SUMMARY)}
                                    render={(props) => (
                                        <SummaryStep
                                            onSubmit={submitForm}
                                            values={values}
                                            isValid={isValid}
                                            {...props}
                                        />
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
