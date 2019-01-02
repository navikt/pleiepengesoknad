import * as React from 'react';
import { StepID } from '../../config/stepConfig';
import { getSøknadRoute } from '../../utils/routeConfigHelper';
import { Formik, FormikBag as FormikBagType, FormikProps } from 'formik';
import { Redirect, Route, Switch } from 'react-router';
import RelasjonTilBarnStep from '../steps/relasjon-til-barn/RelasjonTilBarnStep';
import MedlemsskapStep from '../steps/medlemsskap/MedlemsskapStep';
import SummaryStep from '../steps/summary/SummaryStep';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

type FormikPropsWorkaround = FormikProps<PleiepengesøknadFormData> & { submitForm: () => Promise<void> };
type FormikBag = FormikBagType<PleiepengesøknadFormData, PleiepengesøknadFormData>;

const StepBasedFormWrapper = () => (
    <Formik
        initialValues={{ someField1: '', someField2: '' }}
        onSubmit={(values: PleiepengesøknadFormData, bag: FormikBag) => {
            const { setSubmitting, setFormikState } = bag;
            setSubmitting(false);
            setFormikState({
                submitCount: 0
            });
        }}
        render={({ values, isValid, submitForm }: FormikPropsWorkaround) => {
            return (
                <Switch>
                    <Route
                        path={getSøknadRoute(StepID.RELASJON_TIL_BARN)}
                        render={(props) => (
                            <RelasjonTilBarnStep onSubmit={submitForm} values={values} isValid={isValid} {...props} />
                        )}
                    />
                    <Route
                        path={getSøknadRoute(StepID.MEDLEMSSKAP)}
                        render={(props) => (
                            <MedlemsskapStep onSubmit={submitForm} values={values} isValid={isValid} {...props} />
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

export default StepBasedFormWrapper;
