import { ISODuration } from '@navikt/sif-common-utils/lib';

export type NormalarbeidstidApiData = {
    timerPerUkeISnitt: ISODuration;
    erLiktHverUke: true /* TODO - skal tas bort */;
    _erLiktSnittSomForrigeSøknad?: boolean;
};
