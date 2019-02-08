import * as React from 'react';
import { StepID } from '../../config/stepConfig';
import { Formik } from 'formik';
import { Redirect, Route, Switch } from 'react-router';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import OpplysningerOmAnsettelsesforholdStep from '../steps/ansettelsesforhold/OpplysningerOmAnsettelsesforholdStep';
import SummaryStep from '../steps/summary/SummaryStep';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { CustomFormikProps as FormikProps } from '../../types/FormikProps';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import { getSøknadRoute } from '../../utils/routeUtils';
import { stepRouteIsAvailable } from '../../utils/stepUtils';
import ErrorPage from '../pages/error-page/ErrorPage';
import routeConfig from '../../config/routeConfig';

const Pleiepengesøknad = () => (
    <Formik
        initialValues={initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setFormikState, setTouched }: FormikBag) => {
            setSubmitting(false);
            setFormikState({ submitCount: 0 });
            setTouched({});
        }}
        render={(formikProps: FormikProps) => {
            const { handleSubmit, isSubmitting, isValid, values } = formikProps;
            const commonFormikProps = { handleSubmit, isSubmitting, isValid };
            return (
                <Switch>
                    <Route path="/velkommen" render={(props) => <WelcomingPage {...commonFormikProps} {...props} />} />

                    {stepRouteIsAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                        <Route
                            path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                            render={(props) => <OpplysningerOmBarnetStep formikProps={formikProps} {...props} />}
                        />
                    )}

                    {stepRouteIsAvailable(StepID.TIDSROM, values) && (
                        <Route
                            path={getSøknadRoute(StepID.TIDSROM)}
                            render={(props) => (
                                <OpplysningerOmTidsromStep
                                    formikProps={formikProps}
                                    {...commonFormikProps}
                                    {...props}
                                />
                            )}
                        />
                    )}

                    {stepRouteIsAvailable(StepID.ANSETTELSESFORHOLD, values) && (
                        <Route
                            path={getSøknadRoute(StepID.ANSETTELSESFORHOLD)}
                            render={(props) => (
                                <OpplysningerOmAnsettelsesforholdStep {...commonFormikProps} {...props} />
                            )}
                        />
                    )}

                    {stepRouteIsAvailable(StepID.LEGEERKLÆRING, values) && (
                        <Route
                            path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                            render={(props) => <LegeerklæringStep {...commonFormikProps} {...props} />}
                        />
                    )}

                    {stepRouteIsAvailable(StepID.SUMMARY, values) && (
                        <Route
                            path={getSøknadRoute(StepID.SUMMARY)}
                            render={(props) => <SummaryStep values={values} {...commonFormikProps} {...props} />}
                        />
                    )}

                    <Route path={routeConfig.ERROR_PAGE_ROUTE} component={ErrorPage} />
                    <Route path="/soknad-sendt" component={ConfirmationPage} />
                    <Redirect to="/velkommen" />
                </Switch>
            );
        }}
    />
);

export default Pleiepengesøknad;
