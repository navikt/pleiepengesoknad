import React, { useCallback, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import { apiStringDateToDate, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { useFormikContext } from 'formik';
import { persist } from '../../api/api';
import { SKJEMANAVN } from '../../App';
import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { ArbeidsforholdAnsattApi, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { Søkerdata } from '../../types/Søkerdata';
import { apiUtils } from '../../utils/apiUtils';
import { navigateTo, navigateToErrorPage, relocateToLoginPage } from '../../utils/navigationUtils';
import { getNextStepRoute, getSøknadRoute, isAvailable } from '../../utils/routeUtils';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import GeneralErrorPage from '../pages/general-error-page/GeneralErrorPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import ArbeidsforholdIPeriodeStep from '../steps/arbeidsforhold-i-periode-step/ArbeidsforholdIPeriodeStep';
import ArbeidsforholdStep from '../steps/arbeidsforhold-step/ArbeidsforholdStep';
import BeredskapStep from '../steps/beredskap-step/BeredskapStep';
import LegeerklæringStep from '../steps/legeerklæring-step/LegeerklæringStep';
import MedlemsskapStep from '../steps/medlemskap-step/MedlemsskapStep';
import NattevåkStep from '../steps/nattevåk-step/NattevåkStep';
import OpplysningerOmBarnetStep from '../steps/opplysninger-om-barnet-step/OpplysningerOmBarnetStep';
import SummaryStep from '../steps/summary-step/SummaryStep';
import OpplysningerOmTidsromStep from '../steps/tidsrom-step/OpplysningerOmTidsromStep';
import OmsorgstilbudStep from '../steps/omsorgstilbud-step/OmsorgstilbudStep';
import { getSøknadsperiodeFromFormData } from '../../utils/formDataUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../utils/omsorgstilbudUtils';

interface PleiepengesøknadContentProps {
    lastStepID?: StepID;
    harMellomlagring: boolean;
}

export interface KvitteringInfo {
    fom: Date;
    tom: Date;
    søkernavn: string;
    arbeidsforhold: ArbeidsforholdAnsattApi[];
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
                        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
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
    const periodeFørSøknadsdato = søknadsperiode ? getHistoriskPeriode(søknadsperiode, dateToday) : undefined;
    const periodeFraOgMedSøknadsdato = søknadsperiode ? getPlanlagtPeriode(søknadsperiode, dateToday) : undefined;

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

            {isAvailable(StepID.ARBEIDSFORHOLD, values) && (
                <Route
                    path={getSøknadRoute(StepID.ARBEIDSFORHOLD)}
                    render={() => (
                        <ArbeidsforholdStep onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEIDSFORHOLD)} />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEID_HISTORISK, values) && periodeFørSøknadsdato && (
                <Route
                    path={getSøknadRoute(StepID.ARBEID_HISTORISK)}
                    render={() => (
                        <ArbeidsforholdIPeriodeStep
                            periode={periodeFørSøknadsdato}
                            erHistorisk={true}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEID_HISTORISK)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.ARBEID_PLANLAGT, values) && periodeFraOgMedSøknadsdato && (
                <Route
                    path={getSøknadRoute(StepID.ARBEID_PLANLAGT)}
                    render={() => (
                        <ArbeidsforholdIPeriodeStep
                            periode={periodeFraOgMedSøknadsdato}
                            erHistorisk={false}
                            onValidSubmit={() => navigateToNextStepFrom(StepID.ARBEID_PLANLAGT)}
                        />
                    )}
                />
            )}

            {isAvailable(StepID.OMSORGSTILBUD, values) && (
                <Route
                    path={getSøknadRoute(StepID.OMSORGSTILBUD)}
                    render={() => {
                        return <OmsorgstilbudStep onValidSubmit={() => navigateToNextStepFrom(StepID.OMSORGSTILBUD)} />;
                    }}
                />
            )}

            {isAvailable(StepID.NATTEVÅK, values) && (
                <Route
                    path={getSøknadRoute(StepID.NATTEVÅK)}
                    render={() => {
                        return <NattevåkStep onValidSubmit={() => navigateToNextStepFrom(StepID.NATTEVÅK)} />;
                    }}
                />
            )}

            {isAvailable(StepID.BEREDSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.BEREDSKAP)}
                    render={() => {
                        return <BeredskapStep onValidSubmit={() => navigateToNextStepFrom(StepID.BEREDSKAP)} />;
                    }}
                />
            )}

            {isAvailable(StepID.MEDLEMSKAP, values) && (
                <Route
                    path={getSøknadRoute(StepID.MEDLEMSKAP)}
                    render={() => <MedlemsskapStep onValidSubmit={() => navigateToNextStepFrom(StepID.MEDLEMSKAP)} />}
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
