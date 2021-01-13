import { useEffect, useRef } from 'react';
import { getEnvironmentVariable } from '@navikt/sif-common-core/lib/utils/envUtils';
import amplitude, { AmplitudeClient } from 'amplitude-js';
import constate from 'constate';
import { APPLICATION_KEY } from '../App';

export enum AmplitudeEvents {
    'sidevisning' = 'sidevisning',
    'applikasjonStartet' = 'applikasjon-startet',
    'søknadSendt' = 'skjema fullført',
    'søknadFeilet' = 'skjemainnsending feilet',
    'applikasjonInfo' = 'applikasjon-info',
    'applikasjonHendelse' = 'applikasjon-hendelse',
}

export enum ApplikasjonHendelse {
    'brukerSendesTilLoggInn' = 'brukerSendesTilLoggInn',
    'avbryt' = 'avbryt',
    'fortsettSenere' = 'fortsettSenere',
}

const SKJEMANAVN = 'Melding om deling av dager';

interface InnsynUserProperties {
    antallSaker: number;
}

export const [AmplitudeProvider, useAmplitudeInstance] = constate(() => {
    const instance = useRef<AmplitudeClient | undefined>();
    const isActive = getEnvironmentVariable('USE_AMPLITUDE') === 'true';

    useEffect(() => {
        if (amplitude && isActive) {
            instance.current = amplitude.getInstance();
            instance.current.init('default', '', {
                apiEndpoint: 'amplitude.nav.no/collect-auto',
                saveEvents: false,
                includeUtm: true,
                includeReferrer: true,
                platform: window.location.toString(),
            });
        }
    }, [isActive]);

    async function logEvent(eventName: string, eventProperties?: any) {
        const eventProps = { ...eventProperties, app: APPLICATION_KEY, applikasjon: APPLICATION_KEY };
        if (getEnvironmentVariable('APP_VERSION') === 'dev') {
            console.log({ eventName, eventProperties: eventProps });
            return Promise.resolve();
        }
        if (instance.current) {
            return instance.current.logEvent(eventName, eventProps);
        }
    }

    function setUserProperties(properties: InnsynUserProperties) {
        if (isActive && instance.current) {
            instance.current.setUserProperties(properties);
        }
    }

    async function logSidevisning(pageKey: string) {
        return logEvent(AmplitudeEvents.sidevisning, {
            pageKey,
            team: 'sykdom-i-familien',
        });
    }

    async function logSoknadSent() {
        return logEvent(AmplitudeEvents.søknadSendt, {
            skjemanavn: SKJEMANAVN,
            skjemaId: APPLICATION_KEY,
        });
    }

    async function logSoknadFailed() {
        return logEvent(AmplitudeEvents.søknadFeilet, {
            skjemanavn: SKJEMANAVN,
            skjemaId: APPLICATION_KEY,
        });
    }

    async function logHendelse(hendelse: ApplikasjonHendelse, details?: any) {
        return logEvent(AmplitudeEvents.applikasjonHendelse, {
            hendelse,
            details,
        });
    }

    return { logEvent, logSidevisning, setUserProperties, logSoknadSent, logSoknadFailed, logHendelse };
});
