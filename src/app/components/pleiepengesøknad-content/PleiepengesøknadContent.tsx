import * as React from 'react';
import { CustomFormikProps } from '../../types/FormikProps';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import { StepID } from '../../config/stepConfig';
import { getSøknadRoute, isAvailable, getNextStepRoute } from '../../utils/routeUtils';
import { Redirect, Route, Switch } from 'react-router-dom';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import RouteConfig from '../../config/routeConfig';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import SummaryStep from '../steps/summary/SummaryStep';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import OpplysningerOmAnsettelsesforholdGradertStep from '../steps/ansettelsesforhold/OpplysningerOmAnsettelsesforholdGradertStep';
import TilsynsordningStep from '../steps/tilsynsordning/TilsynsordningStep';
import NattevåkStep from '../steps/nattevåkStep/NattevåkStep';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import BeredskapStep from '../steps/beredskapStep/BeredskapStep';

interface PleiepengesøknadContentProps {
    formikProps: CustomFormikProps;
}

export interface CommonStepFormikProps {
    formValues: PleiepengesøknadFormData;
    handleSubmit: () => void;
}

const PleiepengesøknadContent: React.FunctionComponent<PleiepengesøknadContentProps> = ({ formikProps }) => {
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const { handleSubmit, values, isSubmitting, isValid, resetForm } = formikProps;
    const commonFormikProps: CommonStepFormikProps = { handleSubmit, formValues: formikProps.values };
    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={(props) => (
                    <WelcomingPage
                        {...commonFormikProps}
                        {...props}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                        nextStepRoute={`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`}
                    />
                )}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={(props) => (
                        <OpplysningerOmBarnetStep
                            formikProps={formikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.OPPLYSNINGER_OM_BARNET, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={(props) => (
                        <OpplysningerOmTidsromStep
                            formikProps={formikProps}
                            nextStepRoute={getNextStepRoute(StepID.TIDSROM, values)}
                            {...props}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ANSETTELSESFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ANSETTELSESFORHOLD)}
                    render={(props) => (
                        <OpplysningerOmAnsettelsesforholdGradertStep
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.ANSETTELSESFORHOLD, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.OMSORGSTILBUD, values) && (
                <Route
                    path={getSøknadRoute(StepID.OMSORGSTILBUD)}
                    render={(props) => {
                        return (
                            <TilsynsordningStep
                                {...commonFormikProps}
                                {...props}
                                nextStepRoute={getNextStepRoute(StepID.OMSORGSTILBUD, values)}
                            />
                        );
                    }}
                />
            )}

            {isAvailable(StepID.NATTEVÅK, values) && (
                <Route
                    path={getSøknadRoute(StepID.NATTEVÅK)}
                    render={(props) => {
                        return (
                            <NattevåkStep
                                formikProps={formikProps}
                                {...commonFormikProps}
                                {...props}
                                nextStepRoute={getNextStepRoute(StepID.NATTEVÅK, values)}
                            />
                        );
                    }}
                />
            )}

            {isAvailable(StepID.BEREDSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.BEREDSKAP)}
                    render={(props) => {
                        return (
                            <BeredskapStep
                                formikProps={formikProps}
                                {...commonFormikProps}
                                {...props}
                                nextStepRoute={getNextStepRoute(StepID.BEREDSKAP, values)}
                            />
                        );
                    }}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={(props) => (
                        <MedlemsskapStep
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.MEDLEMSKAP, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={(props) => (
                        <LegeerklæringStep
                            formikProps={formikProps}
                            {...commonFormikProps}
                            {...props}
                            nextStepRoute={getNextStepRoute(StepID.LEGEERKLÆRING, values)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={(props) => <SummaryStep {...commonFormikProps} {...props} />}
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
                        return <ConfirmationPage numberOfAnsettelsesforhold={1} />;
                    }}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default PleiepengesøknadContent;
