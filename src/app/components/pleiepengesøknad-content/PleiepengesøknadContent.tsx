import * as React from 'react';
import { CustomFormikProps as FormikProps } from '../../types/FormikProps';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import { StepID } from '../../config/stepConfig';
import { getSøknadRoute, stepRouteIsAvailable } from '../../utils/routeUtils';
import { Redirect, Route, Switch } from 'react-router';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import routeConfig from '../../config/routeConfig';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import OpplysningerOmAnsettelsesforholdStep from '../steps/ansettelsesforhold/OpplysningerOmAnsettelsesforholdStep';
import MedlemsskapStep from '../steps/medlemsskap/MedlemsskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import SummaryStep from '../steps/summary/SummaryStep';
import ErrorPage from '../pages/error-page/ErrorPage';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';

interface PleiepengesøknadContentProps {
    formikProps: FormikProps;
}

const PleiepengesøknadContent: React.FunctionComponent<PleiepengesøknadContentProps> = ({ formikProps }) => {
    const { handleSubmit, isSubmitting, isValid, values } = formikProps;
    const commonFormikProps = { handleSubmit, isSubmitting, isValid };
    return (
        <Switch>
            <Route
                path={routeConfig.WELCOMING_PAGE_ROUTE}
                render={(props) => <WelcomingPage {...commonFormikProps} {...props} />}
            />

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
                        <OpplysningerOmTidsromStep formikProps={formikProps} {...commonFormikProps} {...props} />
                    )}
                />
            )}

            {stepRouteIsAvailable(StepID.ANSETTELSESFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ANSETTELSESFORHOLD)}
                    render={(props) => <OpplysningerOmAnsettelsesforholdStep {...commonFormikProps} {...props} />}
                />
            )}

            {stepRouteIsAvailable(StepID.MEDLEMSSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSSKAP)}
                    render={(props) => <MedlemsskapStep {...commonFormikProps} {...props} />}
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
            <Route path={routeConfig.SØKNAD_SENDT_ROUTE} component={ConfirmationPage} />
            <Redirect to={routeConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default PleiepengesøknadContent;
