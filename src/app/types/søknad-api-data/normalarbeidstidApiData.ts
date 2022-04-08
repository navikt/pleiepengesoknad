import { TimerFasteDagerApiData } from './SøknadApiData';

type NormalarbeidstidSnittPerUkeApiData = {
    erLiktHverUke: false;
    timerPerUkeISnitt: number;
};
type NormalarbeidstidFasteDagerPerUkeApiData = {
    erLiktHverUke: true;
    timerFasteDager: TimerFasteDagerApiData;
};

export type NormalarbeidstidApiData = NormalarbeidstidSnittPerUkeApiData | NormalarbeidstidFasteDagerPerUkeApiData;
