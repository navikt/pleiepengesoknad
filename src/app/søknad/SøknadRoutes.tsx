import React from 'react';
import { useIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router';
import { isFailure, isInitial, isPending, isSuccess } from '@devexperts/remote-data-ts';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { DateRange } from '@navikt/sif-common-formik/lib';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import SoknadErrorMessages, {
    LastAvailableStepInfo,
} from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { dateToday } from '@navikt/sif-common-utils/lib';
import { useFormikContext } from 'formik';
import RouteConfig from '../config/routeConfig';
import ConfirmationPage from '../pages/confirmation-page/ConfirmationPage';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';
import { RegistrertBarn, Søker } from '../types';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { getAvailableSteps } from '../utils/routeUtils';
import ArbeidssituasjonStep from './arbeidssituasjon-step/ArbeidssituasjonStep';
import ArbeidstidStep from './arbeidstid-step/ArbeidstidStep';
import OpplysningerOmBarnetStep from './opplysninger-om-barnet-step/OpplysningerOmBarnetStep';
import { useSøknadContext } from './SøknadContext';
import { StepID } from './søknadStepsConfig';
import TidsromStep from './tidsrom-step/TidsromStep';
import OmsorgstilbudStep from './omsorgstilbud-step/OmsorgstilbudStep';
import NattevåkOgBeredskapStep from './nattevåk-og-beredskap-step/NattevåkOgBeredskapStep';
import MedlemsskapStep from './medlemskap-step/MedlemsskapStep';
import LegeerklæringStep from './legeerklæring-step/LegeerklæringStep';
import OppsummeringStep from './oppsummering-step/OppsummeringStep';
import { ImportertSøknad } from '../types/ImportertSøknad';

interface Props {
    søker: Søker;
    registrerteBarn: RegistrertBarn[];
    søknadId?: string;
    forrigeSøknad?: ImportertSøknad;
}

const renderSoknadStep = (
    søker: Søker,
    søknadsperiode: DateRange | undefined,
    søknadsdato: Date,
    registrerteBarn: RegistrertBarn[],
    stepID: StepID,
    søknadId: string
): React.ReactNode => {
    switch (stepID) {
        case StepID.OPPLYSNINGER_OM_BARNET:
            return <OpplysningerOmBarnetStep />;
        case StepID.TIDSROM:
            return <TidsromStep />;
        case StepID.ARBEIDSSITUASJON:
            if (!søknadsperiode) {
                return <div>Manglende søknadsperiode</div>;
            }
            return <ArbeidssituasjonStep søknadsdato={søknadsdato} søknadsperiode={søknadsperiode} />;
        case StepID.ARBEIDSTID:
            if (!søknadsperiode) {
                return <div>Manglende søknadsperiode</div>;
            }
            return (
                <ArbeidstidStep søkerInfo={{ søker, registrerteBarn }} søknadId={søknadId} periode={søknadsperiode} />
            );
        case StepID.OMSORGSTILBUD:
            if (!søknadsperiode) {
                return <div>Manglende søknadsperiode</div>;
            }
            return (
                <OmsorgstilbudStep
                    søknadsperiode={søknadsperiode}
                    søkerInfo={{ søker, registrerteBarn }}
                    søknadId={søknadId}
                />
            );
        case StepID.NATTEVÅK_OG_BEREDSKAP:
            return <NattevåkOgBeredskapStep søkerInfo={{ søker, registrerteBarn }} søknadId={søknadId} />;
        case StepID.MEDLEMSKAP:
            return <MedlemsskapStep søknadsdato={søknadsdato} />;
        case StepID.LEGEERKLÆRING:
            return <LegeerklæringStep søkerInfo={{ søker, registrerteBarn }} søknadId={søknadId} />;
        case StepID.SUMMARY:
            return <OppsummeringStep søknadsdato={søknadsdato} />;
    }
    return null;
};

const SøknadRoutes: React.FC<Props> = ({ søker, søknadId, registrerteBarn, forrigeSøknad }) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormValues>();
    const availableSteps = getAvailableSteps(values);
    const { soknadStepsConfig, sendSoknadStatus } = useSøknadContext();

    const søknadsperiode = values ? getSøknadsperiodeFromFormData(values) : undefined;
    const søknadsdato = dateToday;

    const lastAvailableStep = availableSteps.slice(-1)[0];

    const lastAvailableStepInfo: LastAvailableStepInfo | undefined = lastAvailableStep
        ? {
              route: soknadStepsConfig[lastAvailableStep].route,
              title: soknadStepUtils.getStepTexts(intl, soknadStepsConfig[lastAvailableStep]).stepTitle,
          }
        : undefined;

    return (
        <Switch>
            {isSuccess(sendSoknadStatus.status) && (
                <Route path={RouteConfig.SØKNAD_SENDT_ROUTE} exact={true}>
                    <LoadWrapper
                        isLoading={isPending(sendSoknadStatus.status) || isInitial(sendSoknadStatus.status)}
                        contentRenderer={() => {
                            if (isSuccess(sendSoknadStatus.status)) {
                                return <ConfirmationPage />;
                            }
                            if (isFailure(sendSoknadStatus.status)) {
                                return <ErrorPage />;
                            }
                            return <div>Det oppstod en feil</div>;
                        }}
                    />
                </Route>
            )}

            <Route path={RouteConfig.SØKNAD_ROUTE_PREFIX} exact={true}>
                <WelcomingPage forrigeSøknad={forrigeSøknad} />
            </Route>

            {søknadId === undefined && <Redirect key="redirectToWelcome" to={RouteConfig.SØKNAD_ROUTE_PREFIX} />}
            {søknadId &&
                availableSteps.map((step) => {
                    const path = soknadStepsConfig[step]?.route;

                    if (!path) {
                        return null;
                    }
                    return (
                        <Route
                            key={step}
                            path={soknadStepsConfig[step].route}
                            exact={true}
                            render={() => {
                                return renderSoknadStep(
                                    søker,
                                    søknadsperiode,
                                    søknadsdato,
                                    registrerteBarn,
                                    step,
                                    søknadId
                                );
                            }}
                        />
                    );
                })}
            <Route path="*">
                <ErrorPage
                    contentRenderer={() => {
                        return <SoknadErrorMessages.MissingSoknadDataError lastAvailableStep={lastAvailableStepInfo} />;
                    }}
                />
            </Route>
        </Switch>
    );
};

export default SøknadRoutes;
