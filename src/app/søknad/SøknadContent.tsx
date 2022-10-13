import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { ApiError, ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import BekreftDialog from '@navikt/sif-common-core/lib/components/dialogs/bekreft-dialog/BekreftDialog';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { useFormikContext } from 'formik';
import { purge } from '../api/api';
import { SKJEMANAVN } from '../App';
import RouteConfig from '../config/routeConfig';
import useLogSøknadInfo from '../hooks/useLogSøknadInfo';
import usePersistSoknad from '../hooks/usePersistSoknad';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import { ConfirmationDialog } from '../types/ConfirmationDialog';
import { ImportertSøknad } from '../types/ImportertSøknad';
import { KvitteringInfo } from '../types/KvitteringInfo';
import { Søkerdata } from '../types/Søkerdata';
import { SøknadApiData } from '../types/søknad-api-data/SøknadApiData';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { MellomlagringMetadata } from '../types/SøknadTempStorageData';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';
import { getKvitteringInfoFromApiData } from '../utils/kvitteringUtils';
import { navigateTo, navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../utils/routeUtils';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import { getArbeidsforhold, harFraværIPerioden } from './arbeidstid-step/utils/arbeidstidUtils';
import { getIngenFraværConfirmationDialog } from './confirmation-dialogs/ingenFraværConfirmation';
import LegeerklæringStep from './legeerklæring-step/LegeerklæringStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import NattevåkOgBeredskapStep from './nattevåk-og-beredskap-step/NattevåkOgBeredskapStep';
import OmsorgstilbudStep from './omsorgstilbud-step/OmsorgstilbudStep';
import OpplysningerOmBarnetStep from './opplysninger-om-barnet-step/OpplysningerOmBarnetStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { useSøknadsdataContext } from './SøknadsdataContext';
import { StepID } from './søknadStepsConfig';
import TidsromStep from './tidsrom-step/TidsromStep';
import ArbeidstidStep from './arbeidstid-step/components/ArbeidstidStep';

interface PleiepengesøknadContentProps {
    /** Sist steg som bruker submittet skjema */
    mellomlagringMetadata?: MellomlagringMetadata;
    /** Forrige søknad sendt inn av bruker */
    forrigeSøknad: ImportertSøknad | undefined;
    onSøknadSent: () => void;
    onSøknadStart: () => void;
}

const SøknadContent = ({
    mellomlagringMetadata,
    forrigeSøknad,
    onSøknadSent,
    onSøknadStart,
}: PleiepengesøknadContentProps) => {
    const location = useLocation();
    const [søknadHasBeenSent, setSøknadHasBeenSent] = React.useState(false);
    const [kvitteringInfo, setKvitteringInfo] = React.useState<KvitteringInfo | undefined>(undefined);
    const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog | undefined>(undefined);
    const { values, setValues } = useFormikContext<SøknadFormValues>();
    const history = useHistory();
    const { logHendelse, logUserLoggedOut, logSoknadStartet, logApiError } = useAmplitudeInstance();
    const { setSøknadsdata, setImportertSøknadMetadata } = useSøknadsdataContext();
    const { logBekreftIngenFraværFraJobb } = useLogSøknadInfo();
    const { persistSoknad } = usePersistSoknad();

    const sendUserToStep = useCallback(
        async (route: string) => {
            await logHendelse(ApplikasjonHendelse.starterMedMellomlagring, { step: route });
            navigateTo(route, history);
        },
        [logHendelse, history]
    );

    const isOnWelcomPage = location.pathname === RouteConfig.WELCOMING_PAGE_ROUTE;
    const nextStepRoute = søknadHasBeenSent
        ? undefined
        : mellomlagringMetadata?.lastStepID
        ? getNextStepRoute(mellomlagringMetadata.lastStepID, values)
        : undefined;

    /** Redirect til riktig side */
    useEffect(() => {
        if (mellomlagringMetadata !== undefined) {
            if (mellomlagringMetadata.importertSøknadMetadata !== undefined) {
                setImportertSøknadMetadata(mellomlagringMetadata?.importertSøknadMetadata);
            }
            if (isOnWelcomPage && nextStepRoute !== undefined) {
                sendUserToStep(nextStepRoute);
            }
            if (isOnWelcomPage && nextStepRoute === undefined && !søknadHasBeenSent) {
                sendUserToStep(StepID.OPPLYSNINGER_OM_BARNET);
            }
        }
    }, [
        mellomlagringMetadata,
        isOnWelcomPage,
        nextStepRoute,
        sendUserToStep,
        setImportertSøknadMetadata,
        søknadHasBeenSent,
    ]);

    const userNotLoggedIn = async () => {
        await logUserLoggedOut('Mellomlagring ved navigasjon');
        relocateToLoginPage();
    };

    const navigateToNextStepFrom = async (stepID: StepID) => {
        setTimeout(() => {
            const nextStepRoute = getNextStepRoute(stepID, values);
            if (nextStepRoute) {
                persistSoknad({ formValues: values, stepID })
                    .then(() => {
                        navigateTo(nextStepRoute, history);
                    })
                    .catch((error) => {
                        if (apiUtils.isUnauthorized(error)) {
                            userNotLoggedIn();
                        } else {
                            logApiError(ApiError.mellomlagring, { stepId: stepID });
                            return navigateToErrorPage(history);
                        }
                    });
            }
        });
    };

    const startSoknad = async () => {
        onSøknadStart();
        await logSoknadStartet(SKJEMANAVN);
        await purge();

        const initialFormValues =
            forrigeSøknad && values.brukForrigeSøknad === YesOrNo.YES
                ? { ...forrigeSøknad?.formValues, brukForrigeSøknad: YesOrNo.YES }
                : undefined;

        if (forrigeSøknad && values.brukForrigeSøknad === YesOrNo.YES) {
            setImportertSøknadMetadata(forrigeSøknad?.metaData);
        }

        if (initialFormValues) {
            setValues(initialFormValues);
        }
        await persistSoknad({ formValues: initialFormValues, stepID: StepID.OPPLYSNINGER_OM_BARNET });

        setTimeout(() => {
            setSøknadsdata(getSøknadsdataFromFormValues(initialFormValues || values));
            navigateTo(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`, history);
        });
    };

    const søknadsperiode = values ? getSøknadsperiodeFromFormData(values) : undefined;
    const søknadsdato = dateToday;

    return (
        <>
            {confirmationDialog && (
                <BekreftDialog
                    isOpen={true}
                    bekreftLabel={confirmationDialog.okLabel}
                    avbrytLabel={confirmationDialog.cancelLabel}
                    onBekreft={confirmationDialog.onConfirm}
                    onAvbryt={confirmationDialog.onCancel}
                    onRequestClose={confirmationDialog.onCancel}
                    contentLabel={confirmationDialog.title}>
                    {confirmationDialog.content}
                </BekreftDialog>
            )}
            <Switch>
                <Route
                    path={RouteConfig.WELCOMING_PAGE_ROUTE}
                    render={() => <WelcomingPage onValidSubmit={startSoknad} forrigeSøknad={forrigeSøknad} />}
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
                                        const søknadsdata = getSøknadsdataFromFormValues(values);
                                        setSøknadsdata(søknadsdata);
                                        if (
                                            søknadsdata.arbeid &&
                                            harFraværIPerioden(getArbeidsforhold(søknadsdata.arbeid)) === false
                                        ) {
                                            setConfirmationDialog(
                                                getIngenFraværConfirmationDialog({
                                                    onCancel: () => {
                                                        logBekreftIngenFraværFraJobb(false);
                                                        setConfirmationDialog(undefined);
                                                    },
                                                    onConfirm: () => {
                                                        logBekreftIngenFraværFraJobb(true);
                                                        setConfirmationDialog(undefined);
                                                        navigateToNextStepFrom(StepID.ARBEIDSTID);
                                                    },
                                                })
                                            );
                                        } else {
                                            navigateToNextStepFrom(StepID.ARBEIDSTID);
                                        }
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
                                    onSøknadSent();
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
        </>
    );
};

export default SøknadContent;
