export enum LogSøknadInfoType {
    'arbeidPeriodeRegistrert' = 'arbeidPeriodeRegistrert',
    'arbeidEnkeltdagRegistrert' = 'arbeidEnkeltdagRegistrert',
}

import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';

function useLogSøknadInfo() {
    const { logInfo } = useAmplitudeInstance();

    const logArbeidPeriodeRegistrert = (data: {
        verdi: 'prosent' | 'ukeplan';
        erHistorisk: boolean;
        prosent?: string;
    }) => {
        logInfo({
            hendelse: LogSøknadInfoType.arbeidPeriodeRegistrert,
            ...data,
        });
    };

    const logArbeidEnkeltdagRegistrert = (data: { antallDager: number; erHistorisk: boolean }) => {
        logInfo({
            hendelse: LogSøknadInfoType.arbeidPeriodeRegistrert,
            ...data,
        });
    };

    return { logArbeidPeriodeRegistrert, logArbeidEnkeltdagRegistrert };
}

export default useLogSøknadInfo;
