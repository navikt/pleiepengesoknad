import * as React from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { apiStringDateToDate } from '@sif-common/core/utils/dateUtils';
import { formatName } from '@sif-common/core/utils/personUtils';
import { persist } from '../../api/api';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { ApplikasjonHendelse, useAmplitudeInstance } from '../../sif-amplitude/amplitude';
import { ArbeidsforholdApi, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../types/Søkerdata';
import { apiUtils } from '../../utils/apiUtils';
import { navigateTo, navigateToErrorPage, navigateToLoginPage, redirectTo } from '../../utils/navigationUtils';
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

export interface KvitteringInfo {
    fom: Date;
    tom: Date;
    søkernavn: string;
    arbeidsforhold: ArbeidsforholdApi[];
}

const getKvitteringInfoFromApiData = (
    apiValues: PleiepengesøknadApiData,
    søkerdata: Søkerdata
): KvitteringInfo | undefined => {
    const aktiveArbeidsforhold = apiValues.arbeidsgivere.organisasjoner?.filter((o) => o.skalJobbe);
    if (aktiveArbeidsforhold.length > 0) {
        const { fornavn, mellomnavn, etternavn } = søkerdata.person;
        return {
            arbeidsforhold: aktiveArbeidsforhold,
            fom: apiStringDateToDate(apiValues.fraOgMed),
            tom: apiStringDateToDate(apiValues.tilOgMed),
            søkernavn: formatName(fornavn, etternavn, mellomnavn),
        };
    }
    return undefined;
};

const PleiepengesøknadContent = ({ lastStepID }: PleiepengesøknadContentProps) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<PleiepengesøknadFormData>();

    const history = useHistory();

    if (location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE) {
        const nextStepRoute = getNextStepRoute(lastStepID, values);
        if (nextStepRoute) {
            redirectTo(nextStepRoute);
        }
    }

    const { logHendelse } = useAmplitudeInstance();

    const userNotLoggedIn = async (stepId: StepID) => {
        await logHendelse(ApplikasjonHendelse.brukerSendesTilLoggInn, 'Mellomlagring ved navigasjon');
        navigateToLoginPage(getSøknadRoute(stepId));
    };

    const navigateToNextStep = async (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                persist(values, stepId)
                    .then(() => {
                        navigateTo(nextStepRoute, history);
                    })
                    .catch((error) => {
                        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                            userNotLoggedIn(stepId);
                        } else {
                            return navigateToErrorPage(history);
                        }
                    });
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
                    render={() => (
                        <SummaryStep
                            values={values}
                            onApplicationSent={(apiData: PleiepengesøknadApiData, søkerdata: Søkerdata) => {
                                const info = getKvitteringInfoFromApiData(apiData, søkerdata);
                                setKvitteringInfo(info);
                                setSøknadHasBeenSent(true);
                                resetForm();
                                navigateTo(RouteConfig.SØKNAD_SENDT_ROUTE, history);
                            }}
                        />
                    )}
                />
            )}

            {isAvailable(RouteConfig.SØKNAD_SENDT_ROUTE, values, søknadHasBeenSent) && (
                <Route
                    path={RouteConfig.SØKNAD_SENDT_ROUTE}
                    render={() => <ConfirmationPage kvitteringInfo={kvitteringInfo} />}
                />
            )}

            <Route path={RouteConfig.ERROR_PAGE_ROUTE} component={GeneralErrorPage} />
            <Redirect to={RouteConfig.WELCOMING_PAGE_ROUTE} />
        </Switch>
    );
};

export default PleiepengesøknadContent;
