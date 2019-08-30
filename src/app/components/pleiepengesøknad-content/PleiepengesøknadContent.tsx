import * as React from 'react';
import { CustomFormikProps as FormikProps } from '../../types/FormikProps';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import { StepID } from '../../config/stepConfig';
import { getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import { Redirect, Route, Switch } from 'react-router-dom';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import RouteConfig from '../../config/routeConfig';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import OpplysningerOmAnsettelsesforholdStep from '../steps/ansettelsesforhold/OpplysningerOmAnsettelsesforholdStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import SummaryStep from '../steps/summary/SummaryStep';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';
import OpplysningerOmAnsettelsesforholdGradertStep from '../steps/ansettelsesforhold/OpplysningerOmAnsettelsesforholdGradertStep';

interface PleiepengesøknadContentProps {
    formikProps: FormikProps;
}

const PleiepengesøknadContent: React.FunctionComponent<PleiepengesøknadContentProps> = ({ formikProps }) => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { handleSubmit, values, isSubmitting, isValid, resetForm } = formikProps;
    const commonFormikProps = { handleSubmit };
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={(props) => (
                    <WelcomingPage {...commonFormikProps} {...props} isSubmitting={isSubmitting} isValid={isValid} />
                )}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={(props) => <OpplysningerOmBarnetStep formikProps={formikProps} {...props} />}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={(props) => (
                        <OpplysningerOmTidsromStep formikProps={formikProps} {...commonFormikProps} {...props} />
                    )}
                />
            )}

            {isAvailable(StepID.ANSETTELSESFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ANSETTELSESFORHOLD)}
                    render={(props) => {
                        return isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD) ? (
                            <OpplysningerOmAnsettelsesforholdGradertStep {...commonFormikProps} {...props} />
                        ) : (
                            <OpplysningerOmAnsettelsesforholdStep {...commonFormikProps} {...props} />
                        );
                    }}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={(props) => <MedlemsskapStep {...commonFormikProps} {...props} />}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={(props) => <LegeerklæringStep {...commonFormikProps} {...props} />}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={(props) => <SummaryStep values={values} {...commonFormikProps} {...props} />}
                />
            )}

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => {
                        // we clear form state here to ensure that no steps will be available
                        // after the application has been sent. this is done in a setTimeout
                        // because we do not want to update state during render.
                        setTimeout(() => {
                            resetForm();
                        });
                        setSøknadHasBeenSent(true);
                        return <ConfirmationPage />;
                    }}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default PleiepengesøknadContent;
