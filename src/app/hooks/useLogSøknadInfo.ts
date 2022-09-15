export enum LogSøknadInfoType {
    'arbeidPeriodeRegistrert' = 'arbeidPeriodeRegistrert',
    'arbeidEnkeltdagRegistrert' = 'arbeidEnkeltdagRegistrert',
    'bekrefterIngenFraværFraArbeid' = 'bekrefterIngenFraværFraArbeid',
    'avkrefterIngenFraværFraArbeid' = 'avkrefterIngenFraværFraArbeid',
    'senderInnSøknadMedIngenFravær' = 'senderInnSøknadMedIngenFravær',
    'starterMedForrigeSøknad' = 'starterMedForrigeSøknad',
    'starterUtenForrigeSøknad' = 'starterUtenForrigeSøknad',
    'starterUtenValgOmBrukForrigeSøknad' = 'starterUtenValgOmBrukForrigeSøknad',
}

import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';

function useLogSøknadInfo() {
    const { logInfo } = useAmplitudeInstance();

    const logArbeidPeriodeRegistrert = (data: { verdi: 'prosent' | 'ukeplan'; prosent?: string }) => {
        logInfo({
            hendelse: LogSøknadInfoType.arbeidPeriodeRegistrert,
            ...data,
        });
    };

    const logArbeidEnkeltdagRegistrert = (data: { antallDager: number }) => {
        logInfo({
            hendelse: LogSøknadInfoType.arbeidEnkeltdagRegistrert,
            ...data,
        });
    };

    const logBekreftIngenFraværFraJobb = (bekrefterIngenFravær: boolean) => {
        logInfo({
            hendelse: bekrefterIngenFravær
                ? LogSøknadInfoType.bekrefterIngenFraværFraArbeid
                : LogSøknadInfoType.avkrefterIngenFraværFraArbeid,
        });
    };
    const logSenderInnSøknadMedIngenFravær = () => {
        logInfo({
            hendelse: LogSøknadInfoType.senderInnSøknadMedIngenFravær,
        });
    };

    const logStarterSøknadInfo: (harForrigeSøknad: boolean, brukerForrigeSøknad: boolean) => Promise<unknown> = (
        harforrigeSøknad,
        brukerForrigeSøknad
    ) => {
        if (harforrigeSøknad) {
            return logInfo({
                hendelse: brukerForrigeSøknad
                    ? LogSøknadInfoType.starterMedForrigeSøknad
                    : LogSøknadInfoType.starterUtenForrigeSøknad,
            });
        }
        return logInfo({
            hendelse: LogSøknadInfoType.starterUtenValgOmBrukForrigeSøknad,
        });
    };

    return {
        logArbeidPeriodeRegistrert,
        logArbeidEnkeltdagRegistrert,
        logBekreftIngenFraværFraJobb,
        logSenderInnSøknadMedIngenFravær,
        logStarterSøknadInfo,
    };
}

export default useLogSøknadInfo;
