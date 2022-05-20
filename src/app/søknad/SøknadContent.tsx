import React, { useCallback, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { ApiError, ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { useFormikContext } from 'formik';
import { persist, purge } from '../api/api';
import { SKJEMANAVN } from '../App';
import RouteConfig from '../config/routeConfig';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import { KvitteringInfo } from '../types/KvitteringInfo';
import { Søkerdata } from '../types/Søkerdata';
import { SøknadApiData } from '../types/søknad-api-data/SøknadApiData';
import { SøknadFormData } from '../types/SøknadFormData';
import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { getKvitteringInfoFromApiData } from '../utils/kvitteringUtils';
import { navigateTo, navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import ArbeidstidStep from './arbeidstid-step/ArbeidstidStep';
import LegeerklæringStep from './legeerklæring-step/LegeerklæringStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import NattevåkOgBeredskapStep from './nattevåk-og-beredskap-step/NattevåkOgBeredskapStep';
import OmsorgstilbudStep from './omsorgstilbud-step/OmsorgstilbudStep';
import OpplysningerOmBarnetStep from './opplysninger-om-barnet-step/OpplysningerOmBarnetStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSøknadsdataContext } from './SøknadsdataContext';
import { StepID } from './søknadStepsConfig';
import TidsromStep from './tidsrom-step/TidsromStep';

interface PleiepengesøknadContentProps {
    lastStepID?: StepID;
    harMellomlagring: boolean;
}

const SøknadContent = ({ lastStepID, harMellomlagring }: PleiepengesøknadContentProps) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const { values, resetForm } = useFormikContext<SøknadFormData>();
    const history = useHistory();
    const { logHendelse, logUserLoggedOut, logSoknadStartet, logApiError } = useAmplitudeInstance();
    const { setSøknadsdata } = useSøknadsdataContext();

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
                            logApiError(ApiError.mellomlagring, { stepId });
                            return navigateToErrorPage(history);
                        }
                    });
            }
        });
    };

    const startSoknad = async () => {
        await logSoknadStartet(SKJEMANAVN);
        await purge();
        await persist(undefined, StepID.OPPLYSNINGER_OM_BARNET).catch((error) => {
            if (apiUtils.isUnauthorized(error)) {
                userNotLoggedIn();
            } else {
                logApiError(ApiError.mellomlagring, { step: 'velkommen' });
                return navigateToErrorPage(history);
            }
        });

        setTimeout(() => {
            setSøknadsdata(getSøknadsdataFromFormValues(values));
            navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`, history);
        });
    };

    const søknadsperiode = values ? getSøknadsperiodeFromFormData(values) : undefined;
    const søknadsdato = dateToday;

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
                            onValidSubmit={() => {
                                setTimeout(() => {
                                    setSøknadsdata(getSøknadsdataFromFormValues(values));
                                    navigateToNextStepFrom(StepID.OPPLYSNINGER_OM_BARNET);
                                });
                            }}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.TIDSROM, values) && (
                <Route
                    path={getSøknadRoute(StepID.TIDSROM)}
                    render={() => (
                        <TidsromStep
                            onValidSubmit={() => {
                                setTimeout(() => {
                                    setSøknadsdata(getSøknadsdataFromFormValues(values));
                                    navigateToNextStepFrom(StepID.TIDSROM);
                                });
                            }}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSSITUASJON, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSSITUASJON)}
                    render={() => (
                        <ArbeidssituasjonStep
                            onValidSubmit={() => {
                                setTimeout(() => {
                                    setSøknadsdata(getSøknadsdataFromFormValues(values));
                                    navigateToNextStepFrom(StepID.ARBEIDSSITUASJON);
                                });
                            }}
                            søknadsdato={søknadsdato}
                            søknadsperiode={søknadsperiode}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEIDSTID, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSTID)}
                    render={() => (
                        <ArbeidstidStep
                            periode={søknadsperiode}
                            onValidSubmit={() => {
                                setTimeout(() => {
                                    setSøknadsdata(getSøknadsdataFromFormValues(values));
                                    navigateToNextStepFrom(StepID.ARBEIDSTID);
                                });
                            }}
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
                                onValidSubmit={() => {
                                    setTimeout(() => {
                                        setSøknadsdata(getSøknadsdataFromFormValues(values));
                                        navigateToNextStepFrom(StepID.OMSORGSTILBUD);
                                    });
                                }}
                                søknadsperiode={søknadsperiode}
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
                                onValidSubmit={() => {
                                    setTimeout(() => {
                                        setSøknadsdata(getSøknadsdataFromFormValues(values));
                                        navigateToNextStepFrom(StepID.NATTEVÅK_OG_BEREDSKAP);
                                    });
                                }}
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
                            onValidSubmit={() => {
                                setTimeout(() => {
                                    setSøknadsdata(getSøknadsdataFromFormValues(values));
                                    navigateToNextStepFrom(StepID.MEDLEMSKAP);
                                });
                            }}
                            søknadsdato={søknadsdato}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.LEGEERKLÆRING, values) && (
                <Route
                    path={getSøknadRoute(StepID.LEGEERKLÆRING)}
                    render={() => (
                        <LegeerklæringStep
                            onValidSubmit={() => {
                                setTimeout(() => {
                                    setSøknadsdata(getSøknadsdataFromFormValues(values));
                                    navigateToNextStepFrom(StepID.LEGEERKLÆRING);
                                });
                            }}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.SUMMARY, values) && søknadsperiode && (
                <Route
                    path={getSøknadRoute(StepID.SUMMARY)}
                    render={() => (
                        <OppsummeringStep
                            values={values}
                            søknadsdato={søknadsdato}
                            onApplicationSent={(apiData: SøknadApiData, søkerdata: Søkerdata) => {
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

export default SøknadContent;
