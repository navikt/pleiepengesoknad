import * as React from 'react';
import { StepID } from '../../config/stepConfig';
import { getSøknadRoute } from '../../utils/routeConfigHelper';
import { Formik, FormikBag as FormikBagType, FormikProps } from 'formik';
import { Redirect, Route, Switch } from 'react-router';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import OpplysningerOmArbeidsforholdStep from '../steps/arbeidsforhold/OpplysningerOmArbeidsforholdStep';
import SummaryStep from '../steps/summary/SummaryStep';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

type FormikPropsWorkaround = FormikProps<PleiepengesøknadFormData> & { submitForm: () => Promise<void> };
type FormikBag = FormikBagType<PleiepengesøknadFormData, PleiepengesøknadFormData>;

const Pleiepengesøknad = () => (
    <Formik
        initialValues={{
            arbeidsgiversNavn: '',
            arbeidsgiversAdresse: '',
            barnetsEtternavn: '',
            barnetsAdresse: '',
            barnetsFnr: '',
            barnetsFornavn: '',
            søkersRelasjonTilBarnet: '',
            harGodkjentVilkår: false
        }}
        onSubmit={(values: PleiepengesøknadFormData, bag: FormikBag) => {
            const { setSubmitting, setFormikState, resetForm } = bag;
            setSubmitting(false);
            setFormikState({
                submitCount: 0
            });
            resetForm(values);
        }}
        render={({ values, isValid, isSubmitting, isValidating, submitForm }: FormikPropsWorkaround) => {
            return (
                <Switch>
                    <Route
                        path="/velkommen"
                        render={(props) => <WelcomingPage onSubmit={submitForm} isValid={isValid} {...props} />}
                    />
                    <Route
                        path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                        render={(props) => (
                            <OpplysningerOmBarnetStep
                                onSubmit={submitForm}
                                values={values}
                                isValid={isValid}
                                {...props}
                            />
                        )}
                    />
                    <Route
                        path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                        render={(props) => (
                            <OpplysningerOmArbeidsforholdStep
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
                            <SummaryStep onSubmit={submitForm} values={values} isValid={isValid} {...props} />
                        )}
                    />
                    <Redirect to="/velkommen" />
                </Switch>
            );
        }}
    />
);

export default Pleiepengesøknad;
