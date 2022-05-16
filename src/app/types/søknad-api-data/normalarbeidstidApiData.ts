import { ISODuration } from '@navikt/sif-common-utils/lib';
import { TimerFasteDagerApiData } from './SøknadApiData';

export type NormalarbeidstidSnittPerUkeApiData = {
    erLiktHverUke: false;
    timerPerUkeISnitt: ISODuration;
    _arbeiderHelg: boolean;
};

export type NormalarbeidstidFasteDagerPerUkeApiData = {
    erLiktHverUke: true;
    timerFasteDager: TimerFasteDagerApiData;
};

export type NormalarbeidstidApiData = NormalarbeidstidSnittPerUkeApiData | NormalarbeidstidFasteDagerPerUkeApiData;
