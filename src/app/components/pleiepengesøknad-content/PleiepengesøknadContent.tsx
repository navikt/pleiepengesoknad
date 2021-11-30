import React, { useCallback, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { useFormikContext } from 'formik';
import { persist } from '../../api/api';
import { SKJEMANAVN } from '../../App';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { ArbeidsgiverApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../types/Søkerdata';
import { getSøknadsperiodeFromFormData } from '../../utils/formDataUtils';
import { getKvitteringInfoFromApiData } from '../../utils/kvitteringUtils';
import { navigateTo, navigateToErrorPage, relocateToLoginPage } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../utils/tidsbrukUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import HistoriskArbeidStep from '../steps/arbeid-i-periode-steps/HistoriskArbeidStep';
import PlanlagtArbeidStep from '../steps/arbeid-i-periode-steps/PlanlagtArbeidStep';
import ArbeidssituasjonStep from '../steps/arbeidssituasjon-step/ArbeidssituasjonStep';
import LegeerklæringStep from '../steps/legeerklæring-step/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap-step/MedlemsskapStep';
import NattevåkOgBeredskapStep from '../steps/nattevåk-og-beredskap-step/NattevåkOgBeredskapStep';
import OmsorgstilbudStep from '../steps/omsorgstilbud-step/OmsorgstilbudStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet-step/OpplysningerOmBarnetStep';
import SummaryStep from '../steps/summary-step/SummaryStep';
import OpplysningerOmTidsromStep from '../steps/tidsrom-step/OpplysningerOmTidsromStep';

interface PleiepengesøknadContentProps {
    lastStepID?: StepID;
    harMellomlagring: boolean;
}

export interface KvitteringInfo {
    fom: Date;
    tom: Date;
    søkernavn: string;
    arbeidsgivere: ArbeidsgiverApiData[];
}

const PleiepengesøknadContent = ({ lastStepID, harMellomlagring }: PleiepengesøknadContentProps) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<PleiepengesøknadFormData>();
    const history = useHistory();
    const { logHendelse, logUserLoggedOut, logSoknadStartet } = useAmplitudeInstance();

    const sendUserToStep = useCallback(
        async (route: string) => {
            await logHendelse(ApplikasjonHendelse.starterMedMellomlagring, { step: route });
            navigateTo(route, history);
        },
        [logHendelse, history]
    );

    const isOnWelcomPage = location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE;
    const nextStepRoute = søknadHasBeenSent ? undefined : lastStepID ? getNextStepRoute(lastStepID, values) : undefined;

    useEffect(() => {
        if (isOnWelcomPage && nextStepRoute !== undefined) {
            sendUserToStep(nextStepRoute);
        }
        if (isOnWelcomPage && nextStepRoute === undefined && harMellomlagring && !søknadHasBeenSent) {
            sendUserToStep(StepID.OPPLYSNINGER_OM_BARNET);
        }
    }, [isOnWelcomPage, nextStepRoute, harMellomlagring, søknadHasBeenSent, sendUserToStep]);

    const userNotLoggedIn = async () => {
        await logUserLoggedOut('Mellomlagring ved navigasjon');
        relocateToLoginPage();
    };

    const navigateToNextStepFrom = async (stepId: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepId, values);
            if (nextStepRoute) {
                persist(values, stepId)
                    .then(() => {
                        navigateTo(nextStepRoute, history);
                    })
                    .catch((error) => {
                        if (apiUtils.isUnauthorized(error)) {
                            userNotLoggedIn();
                        } else {
                            return navigateToErrorPage(history);
                        }
                    });
            }
        });
    };

    const startSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        persist(undefined, StepID.OPPLYSNINGER_OM_BARNET);
        setTimeout(() => {
            navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`, history);
        });
    };

    const søknadsperiode = values ? getSøknadsperiodeFromFormData(values) : undefined;
    const søknadsdato = dateToday;
    const periodeFørSøknadsdato = søknadsperiode ? getHistoriskPeriode(søknadsperiode, søknadsdato) : undefined;
    const periodeFraOgMedSøknadsdato = søknadsperiode ? getPlanlagtPeriode(søknadsperiode, søknadsdato) : undefined;

    return (
        <Switch>
            <Route
                path={RouteConfig.WELCOMING_PAGE_ROUTE}
                render={() => <WelcomingPage onValidSubmit={startSoknad} />}
            />

            {isAvailable(StepID.OPPLYSNINGER_OM_BARNET, values) && (
                <Route
                    path={getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)}
                    render={() => (
                        <OpplysningerOmBarnetStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.OPPLYSNINGER_OM_BARNET)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={() => (
                        <OpplysningerOmTidsromStep onValidSubmit={() => navigateToNextStepFrom(StepID.TIDSROM)} />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSSITUASJON, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSSITUASJON)}
                    render={() => (
                        <ArbeidssituasjonStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSSITUASJON)}
                            søknadsdato={søknadsdato}
                            søknadsperiode={søknadsperiode}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEID_HISTORISK, values) && periodeFørSøknadsdato && (
                <Route
                    path={getSøknadRoute(StepID.ARBEID_HISTORISK)}
                    render={() => (
                        <HistoriskArbeidStep
                            periode={periodeFørSøknadsdato}
                            søknadsdato={søknadsdato}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEID_HISTORISK)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEID_PLANLAGT, values) && periodeFraOgMedSøknadsdato && (
                <Route
                    path={getSøknadRoute(StepID.ARBEID_PLANLAGT)}
                    render={() => (
                        <PlanlagtArbeidStep
                            periode={periodeFraOgMedSøknadsdato}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEID_PLANLAGT)}
                            søknadsdato={søknadsdato}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.OMSORGSTILBUD, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.OMSORGSTILBUD)}
                    render={() => {
                        return (
                            <OmsorgstilbudStep
                                onValidSubmit={() => navigateToNextStepFrom(StepID.OMSORGSTILBUD)}
                                søknadsdato={søknadsdato}
                                søknadsperiode={søknadsperiode}
                                periodeFraOgMedSøknadsdato={periodeFraOgMedSøknadsdato}
                                periodeFørSøknadsdato={periodeFørSøknadsdato}
                            />
                        );
                    }}
                />
            )}

            {isAvailable(StepID.NATTEVÅK_OG_BEREDSKAP, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.NATTEVÅK_OG_BEREDSKAP)}
                    render={() => {
                        return (
                            <NattevåkOgBeredskapStep
                                onValidSubmit={() => navigateToNextStepFrom(StepID.NATTEVÅK_OG_BEREDSKAP)}
                                søknadsdato={søknadsdato}
                                søknadsperiode={søknadsperiode}
                            />
                        );
                    }}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => (
                        <MedlemsskapStep
                            onValidSubmit={() => navigateToNextStepFrom(StepID.MEDLEMSKAP)}
                            søknadsdato={søknadsdato}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => (
                        <LegeerklæringStep onValidSubmit={() => navigateToNextStepFrom(StepID.LEGEERKLÆRING)} />
                    )}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => (
                        <SummaryStep
                            values={values}
                            søknadsdato={søknadsdato}
                            søknadsperiode={søknadsperiode}
                            onApplicationSent={(apiData: PleiepengesøknadApiData, søkerdata: Søkerdata) => {
                                setKvitteringInfo(getKvitteringInfoFromApiData(apiData, søkerdata));
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
