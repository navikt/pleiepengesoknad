import * as React from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { getAktiveArbeidsforholdIPerioden } from 'app/utils/arbeidsforholdUtils';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { navigateTo, redirectTo } from '../../utils/navigationUtils';
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
}

const PleiepengesøknadContent: React.FunctionComponent<PleiepengesøknadContentProps> = ({ lastStepID }) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [antallArbeidsforhold, setAntallArbeidsforhold] = React.useState<number>(0);
    const { values, resetForm } = useFormikContext<PleiepengesøknadFormData>();

    const history = useHistory();

    if (location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE) {
        const nextStepRoute = getNextStepRoute(lastStepID, values);
        if (nextStepRoute) {
            redirectTo(nextStepRoute);
        }
    }

    const navigateToNextStep = (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        });
    };

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => (
                    <WelcomingPage
                        onValidSubmit={() =>
                            setTimeout(() => {
                                navigateTo(
                                    `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`,
                                    history
                                );
                            })
                        }
                    />
                )}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={() => (
                        <OpplysningerOmBarnetStep
                            onValidSubmit={() => navigateToNextStep(StepID.OPPLYSNINGER_OM_BARNET)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={() => (
                        <OpplysningerOmTidsromStep onValidSubmit={() => navigateToNextStep(StepID.TIDSROM)} />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                    render={() => (
                        <ArbeidsforholdStep onValidSubmit={() => navigateToNextStep(StepID.ARBEIDSFORHOLD)} />
                    )}
                />
            )}

            {isAvailable(StepID.OMSORGSTILBUD, values) && (
                <Route
                    path={getSøknadRoute(StepID.OMSORGSTILBUD)}
                    render={() => {
                        return <TilsynsordningStep onValidSubmit={() => navigateToNextStep(StepID.OMSORGSTILBUD)} />;
                    }}
                />
            )}

            {isAvailable(StepID.NATTEVÅK, values) && (
                <Route
                    path={getSøknadRoute(StepID.NATTEVÅK)}
                    render={() => {
                        return <NattevåkStep onValidSubmit={() => navigateToNextStep(StepID.NATTEVÅK)} />;
                    }}
                />
            )}

            {isAvailable(StepID.BEREDSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.BEREDSKAP)}
                    render={() => {
                        return <BeredskapStep onValidSubmit={() => navigateToNextStep(StepID.BEREDSKAP)} />;
                    }}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStep(StepID.MEDLEMSKAP)} />}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => <LegeerklæringStep onValidSubmit={() => navigateToNextStep(StepID.LEGEERKLÆRING)} />}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => <SummaryStep history={history} values={values} />}
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
