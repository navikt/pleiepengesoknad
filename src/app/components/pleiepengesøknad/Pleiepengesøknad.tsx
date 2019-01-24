import * as React from 'react';
import { StepID } from '../../config/stepConfig';
import { getSøknadRoute } from '../../utils/routeConfigHelper';
import { Formik } from 'formik';
import { Redirect, Route, Switch } from 'react-router';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import OpplysningerOmArbeidsforholdStep from '../steps/arbeidsforhold/OpplysningerOmArbeidsforholdStep';
import SummaryStep from '../steps/summary/SummaryStep';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { CustomFormikProps as FormikProps } from '../../types/FormikProps';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';

const Pleiepengesøknad = () => (
    <Formik
        initialValues={initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setFormikState, setTouched }: FormikBag) => {
            setSubmitting(false);
            setFormikState({ submitCount: 0 });
            setTouched({});
        }}
        render={(allFormikProps: FormikProps) => {
            const { handleSubmit, isSubmitting, isValid, values } = allFormikProps;
            const commonFormikProps = { handleSubmit, isSubmitting, isValid };
            return (
                <Switch>
                    <Route path="/velkommen" render={(props) => <WelcomingPage {...commonFormikProps} {...props} />} />
                    <Route
                        path={getSøknadRoute(StepID.TIDSROM)}
                        render={(props) => <OpplysningerOmTidsromStep {...commonFormikProps} {...props} />}
                    />
                    <Route
                        path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                        render={(props) => <OpplysningerOmBarnetStep formikProps={allFormikProps} {...props} />}
                    />
                    <Route
                        path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                        render={(props) => <OpplysningerOmArbeidsforholdStep {...commonFormikProps} {...props} />}
                    />
                    <Route
                        path={getSøknadRoute(StepID.SUMMARY)}
                        render={(props) => <SummaryStep values={values} {...commonFormikProps} {...props} />}
                    />
                    <Route path="/soknad-sendt" component={ConfirmationPage} />
                    <Redirect to="/velkommen" />
                </Switch>
            );
        }}
    />
);

export default Pleiepengesøknad;
