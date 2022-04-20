import { ISODuration } from '@navikt/sif-common-utils/lib';
import { TimerFasteDagerApiData } from './SøknadApiData';

type NormalarbeidstidSnittPerUkeApiData = {
    erLiktHverUke: false;
    timerPerUkeISnitt: ISODuration;
};

type NormalarbeidstidFasteDagerPerUkeApiData = {
    erLiktHverUke: true;
    timerFasteDager: TimerFasteDagerApiData;
};

export type NormalarbeidstidApiData = NormalarbeidstidSnittPerUkeApiData | NormalarbeidstidFasteDagerPerUkeApiData;
