import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import LoadWrapper from '@navikt/sif-common-core/lib/components/load-wrapper/LoadWrapper';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SoknadApplicationType } from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepTypes';
import soknadStepUtils from '@navikt/sif-common-soknad/lib/soknad-step/soknadStepUtils';
import { guid } from '@navikt/sif-common-utils/lib';
import { FormikState } from 'formik';
import mellomlagringEndpoint, { isMellomlagringValid } from '../api/endpoints/mellomlagringEndpoint';
import { sendSøknad } from '../api/endpoints/sendSøknad';
import { SKJEMANAVN } from '../App';
import RouteConfig, { getRouteUrl } from '../config/routeConfig';
import useEffectOnce from '../hooks/useEffectOnce';
import { RegistrertBarn } from '../types';
import { ImportertSøknad } from '../types/ImportertSøknad';
import { Søker } from '../types/Søker';
import { SøknadApiData } from '../types/søknad-api-data/SøknadApiData';
import { initialValues, SøknadFormField, SøknadFormValues } from '../types/SøknadFormValues';
import { SøknadMellomlagring } from '../types/SøknadMellomlagring';
import appSentryLogger from '../utils/appSentryLogger';
import { getSøknadsdataFromFormValues } from '../utils/formValuesToSøknadsdata/getSøknadsdataFromFormValues';
import {
    navigateTo,
    navigateToErrorPage,
    navigateToKvitteringPage,
    relocateToLoginPage,
    relocateToNavFrontpage,
    relocateToSoknad,
} from '../utils/navigationUtils';
import { initialSendSoknadState, SendSøknadStatus as SendSoknadStatus, SøknadContextProvider } from './SøknadContext';
import SoknadFormComponents from './SøknadFormComponents';
import SøknadRoutes from './SøknadRoutes';
import { useSøknadsdataContext } from './SøknadsdataContext';
import { getSøknadStepsConfig, StepID } from './søknadStepsConfig';
import useLogSøknadInfo from '../hooks/useLogSøknadInfo';

interface Props {
    søker: Søker;
    registrerteBarn: RegistrertBarn[];
    mellomlagring?: SøknadMellomlagring;
    forrigeSøknad?: ImportertSøknad;
}

type resetFormFunc = (nextState?: Partial<FormikState<SøknadFormValues>>) => void;

const Søknad: React.FunctionComponent<Props> = ({ søker, registrerteBarn, mellomlagring, forrigeSøknad }) => {
    const history = useHistory();
    const [initializing, setInitializing] = useState(true);
    const [initialFormValues, setInitialFormValues] = useState<SøknadFormValues>({ ...initialValues });
    const [sendSoknadStatus, setSendSoknadStatus] = useState<SendSoknadStatus>(initialSendSoknadState);
    const [søknadId, setSøknadId] = useState<string | undefined>();
    const { setSøknadsdata, setImportertSøknadMetadata } = useSøknadsdataContext();
    const { logStarterSøknadInfo } = useLogSøknadInfo();

    const { logSoknadSent, logSoknadStartet, logSoknadFailed, logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const resetSoknad = async (redirectToFrontpage = true) => {
        await mellomlagringEndpoint.purge();
        setSøknadId(undefined);
        if (redirectToFrontpage) {
            if (location.pathname !== getRouteUrl(RouteConfig.SØKNAD_ROUTE_PREFIX)) {
                relocateToSoknad();
                setInitializing(false);
            } else {
                setInitializing(false);
            }
        } else {
            setInitializing(false);
        }
    };

    const abortSoknad = async () => {
        try {
            await mellomlagringEndpoint.purge();
            await logHendelse(ApplikasjonHendelse.avbryt);
            relocateToSoknad();
        } catch (error: any) {
            const isStringError = typeof error === 'string';
            if (isStringError) {
                appSentryLogger.logError('abortSoknad', error);
            } else if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved abort av søknad');
                relocateToLoginPage();
            } else {
                console.log('Feil ved abort av søknad: ', error);
                navigateToErrorPage(history);
            }
        }
    };

    const startSoknad = async (setValues: (values: SøknadFormValues) => void, values: SøknadFormValues) => {
        try {
            const sId = guid();
            const firstStep = StepID.OPPLYSNINGER_OM_BARNET;
            const initialFormValues =
                forrigeSøknad && values.brukForrigeSøknad === YesOrNo.YES
                    ? { ...forrigeSøknad?.formValues, [SøknadFormField.brukForrigeSøknad]: YesOrNo.YES }
                    : undefined;

            await resetSoknad();
            setSøknadId(sId);
            if (initialFormValues) {
                setInitialFormValues({ ...initialFormValues, [SøknadFormField.harForståttRettigheterOgPlikter]: true });
                setValues(initialFormValues);
                setSøknadsdata(getSøknadsdataFromFormValues(initialFormValues));
            }

            if (forrigeSøknad && values.brukForrigeSøknad === YesOrNo.YES) {
                setImportertSøknadMetadata(forrigeSøknad?.metaData);
            }

            await mellomlagringEndpoint.create();
            await mellomlagringEndpoint.update({
                formValues: initialFormValues || initialValues,
                lastStepID: StepID.OPPLYSNINGER_OM_BARNET,
                søkerInfo: {
                    søker,
                    registrerteBarn,
                },
                søknadId: sId,
                importertSøknadMetadata: forrigeSøknad?.metaData,
            });
            await logSoknadStartet(SKJEMANAVN);
            await logStarterSøknadInfo(forrigeSøknad !== undefined, values.brukForrigeSøknad === YesOrNo.YES);

            setSøknadsdata(getSøknadsdataFromFormValues(initialFormValues || initialValues));
            setTimeout(() => {
                navigateTo(soknadStepUtils.getStepRoute(firstStep, SoknadApplicationType.SOKNAD), history);
            });
        } catch (error: any) {
            const isStringError = typeof error === 'string';
            if (isStringError) {
                appSentryLogger.logError('abortSoknad', error);
            } else if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved start av søknad');
                relocateToLoginPage();
            } else {
                console.log('Feil ved start av søknad: ', error);
                navigateToErrorPage(history);
            }
        }
    };

    const continueSoknadLater = async (sId: string, stepID: StepID, values: SøknadFormValues) => {
        try {
            await mellomlagringEndpoint.update({
                søknadId: sId,
                formValues: values,
                lastStepID: stepID,
                søkerInfo: { søker, registrerteBarn },
                importertSøknadMetadata: undefined,
            });
            await logHendelse(ApplikasjonHendelse.fortsettSenere);
            relocateToNavFrontpage();
        } catch (error: any) {
            const isStringError = typeof error === 'string';
            if (isStringError) {
                appSentryLogger.logError('abortSoknad', error);
            } else if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved continueSoknadLater');
                relocateToLoginPage();
            } else {
                console.log('Feil ved continueSoknadLater: ', error);
                navigateToErrorPage(history);
            }
        }
    };

    const onSoknadSent = async (apiValues: SøknadApiData, resetFormikForm: resetFormFunc) => {
        await mellomlagringEndpoint.purge();
        await logSoknadSent(SKJEMANAVN);
        setSendSoknadStatus({ failures: 0, status: success(apiValues) });
        setSøknadId(undefined);
        setInitialFormValues(initialValues);
        resetFormikForm({ values: initialValues });
        navigateToKvitteringPage(history);
    };

    const send = async (apiValues: SøknadApiData, resetFormikForm: resetFormFunc) => {
        try {
            await sendSøknad(apiValues);
            onSoknadSent(apiValues, resetFormikForm);
        } catch (error: any) {
            const isStringError = typeof error === 'string';
            if (isStringError) {
                appSentryLogger.logError('abortSoknad', error);
            } else if (isUserLoggedOut(error)) {
                logUserLoggedOut('Ved innsending av søknad');
                relocateToLoginPage();
            } else {
                await logSoknadFailed('Ved innsending av søknad');
                if (sendSoknadStatus.failures >= 2) {
                    navigateToErrorPage(history);
                } else {
                    setSendSoknadStatus({
                        failures: sendSoknadStatus.failures + 1,
                        status: failure(error),
                    });
                }
            }
        }
    };

    const triggerSend = (apiValues: SøknadApiData, resetForm: resetFormFunc) => {
        setTimeout(() => {
            setSendSoknadStatus({ ...sendSoknadStatus, status: pending });
            setTimeout(() => {
                send(apiValues, resetForm);
            });
        });
    };

    useEffectOnce(() => {
        if (mellomlagring) {
            const isValid = isMellomlagringValid(mellomlagring, { søker, registrerteBarn });
            if (isValid) {
                if (mellomlagring.metadata?.importertSøknadMetadata !== undefined) {
                    setImportertSøknadMetadata(mellomlagring.metadata.importertSøknadMetadata);
                }
                setInitialFormValues(mellomlagring.formValues);
                setSøknadsdata(getSøknadsdataFromFormValues(mellomlagring.formValues));
                setSøknadId(mellomlagring.metadata.søknadId);

                const currentRoute = history.location.pathname;
                const lastStepRoute = soknadStepUtils.getStepRoute(
                    mellomlagring.metadata.lastStepID,
                    SoknadApplicationType.SOKNAD
                );
                if (currentRoute !== lastStepRoute) {
                    setTimeout(() => {
                        navigateTo(
                            soknadStepUtils.getStepRoute(
                                mellomlagring.metadata.lastStepID,
                                SoknadApplicationType.SOKNAD
                            ),
                            history
                        );
                        setInitializing(false);
                    });
                }
            } else {
                resetSoknad(history.location.pathname !== RouteConfig.SØKNAD_ROUTE_PREFIX);
            }
        }
        setInitializing(false);
    });

    const oppdaterMellomlagring = async (søknadId: string, formValues: SøknadFormValues, lastStepID: StepID) => {
        try {
            await mellomlagringEndpoint.update({
                søknadId,
                formValues,
                lastStepID,
                søkerInfo: {
                    søker,
                    registrerteBarn,
                },
            });
        } catch (error: any) {
            if (isUserLoggedOut(error)) {
                await logUserLoggedOut('ved mellomlagring');
                relocateToLoginPage();
            } else {
                console.error(error);
            }
        }
    };

    const onGotoNextStepFromStep = async (stepID: StepID, values: SøknadFormValues) => {
        const stepConfig = getSøknadStepsConfig(values)[stepID];
        if (søknadId && stepConfig.nextStep) {
            await oppdaterMellomlagring(søknadId, values, stepConfig.nextStep);
        }
        if (stepConfig.nextStepRoute) {
            navigateTo(stepConfig.nextStepRoute, history);
        }
    };

    return (
        <LoadWrapper
            isLoading={initializing}
            contentRenderer={(): React.ReactNode => {
                return (
                    <SoknadFormComponents.FormikWrapper
                        initialValues={initialFormValues}
                        onSubmit={() => null}
                        renderForm={({ values, setValues, resetForm }) => (
                            <SøknadContextProvider
                                value={{
                                    soknadId: søknadId,
                                    soknadStepsConfig: getSøknadStepsConfig(values),
                                    sendSoknadStatus,
                                    resetSoknad: abortSoknad,
                                    continueSoknadLater: søknadId
                                        ? (stepId) => continueSoknadLater(søknadId, stepId, values)
                                        : undefined,
                                    startSoknad: () => startSoknad(setValues, values),
                                    sendSoknad: (values) => triggerSend(values, resetForm),
                                    gotoNextStepFromStep: (stepID: StepID) => {
                                        onGotoNextStepFromStep(stepID, values);
                                    },
                                }}>
                                <SøknadRoutes
                                    søker={søker}
                                    søknadId={søknadId}
                                    registrerteBarn={registrerteBarn}
                                    forrigeSøknad={forrigeSøknad}
                                />
                            </SøknadContextProvider>
                        )}
                    />
                );
            }}
        />
    );
};

export default Søknad;
