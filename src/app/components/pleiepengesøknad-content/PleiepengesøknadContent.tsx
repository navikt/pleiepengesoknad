import * as React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { SøkerdataContextConsumer } from 'app/context/SøkerdataContext';
import { getAktiveArbeidsforholdIPerioden } from 'app/utils/arbeidsforholdUtils';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { PleiepengesøknadFormikProps } from '../../types/PleiepengesøknadFormikProps';
import { redirectTo } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import ArbeidsforholdStep from '../steps/arbeidsforholdStep/ArbeidsforholdStep';
import BeredskapStep from '../steps/beredskapStep/BeredskapStep';
import LegeerklæringStep from '../steps/legeerklæring/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap/MedlemsskapStep';
import NattevåkStep from '../steps/nattevåkStep/NattevåkStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet/OpplysningerOmBarnetStep';
import SummaryStep from '../steps/summary/SummaryStep';
import OpplysningerOmTidsromStep from '../steps/tidsrom/OpplysningerOmTidsromStep';
import TilsynsordningStep from '../steps/tilsynsordning/TilsynsordningStep';

interface PleiepengesøknadContentProps {
    lastStepID: StepID;
    formikProps: PleiepengesøknadFormikProps;
}

export interface CommonStepFormikProps {
    formValues: PleiepengesøknadFormData;
    handleSubmit: () => void;
}

const PleiepengesøknadContent: React.FunctionComponent<PleiepengesøknadContentProps> = ({
    lastStepID,
    formikProps
}) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [antallArbeidsforhold, setAntallArbeidsforhold] = React.useState<number>(0);
    const { handleSubmit, values, isSubmitting, isValid, resetForm } = formikProps;
    const commonFormikProps: CommonStepFormikProps = { handleSubmit, formValues: formikProps.values };

    if (location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE) {
        const nextStepRoute = getNextStepRoute(lastStepID, values);
        if (nextStepRoute) {
            redirectTo(nextStepRoute);
        }
    }
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
                        <SøkerdataContextConsumer>
                            {(søkerdata) => {
                                if (søkerdata) {
                                    return (
                                        <OpplysningerOmTidsromStep
                                            formikProps={formikProps}
                                            søkerdata={søkerdata}
                                            nextStepRoute={getNextStepRoute(StepID.TIDSROM, values)}
                                            {...props}
                                        />
                                    );
                                }
                                return <div>Manglende søkerdata</div>;
                            }}
                        </SøkerdataContextConsumer>
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                    render={(props) => (
                        <SøkerdataContextConsumer>
                            {(søkerdata) => {
                                if (søkerdata) {
                                    return (
                                        <ArbeidsforholdStep
                                            {...commonFormikProps}
                                            formikProps={formikProps}
                                            søkerdata={søkerdata}
                                            {...props}
                                            nextStepRoute={getNextStepRoute(StepID.ARBEIDSFORHOLD, values)}
                                        />
                                    );
                                }
                                return <div>Manglende søkerdata</div>;
                            }}
                        </SøkerdataContextConsumer>
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

            {(isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values) || søknadHasBeenSent === true) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => {
                        // we clear form state here to ensure that no steps will be available
                        // after the application has been sent. this is done in a setTimeout
                        // because we do not want to update state during render.
                        if (values.harForståttRettigheterOgPlikter === true) {
                            // Only call reset if it has not been called before (prevent loop)
                            setTimeout(() => {
                                setAntallArbeidsforhold(getAktiveArbeidsforholdIPerioden(values.arbeidsforhold).length);
                                resetForm();
                            });
                        }
                        if (søknadHasBeenSent === false) {
                            setSøknadHasBeenSent(true);
                        }
                        return <ConfirmationPage numberOfArbeidsforhold={antallArbeidsforhold} />;
                    }}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default PleiepengesøknadContent;
