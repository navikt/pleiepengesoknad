import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { JobberIPeriodeSvar } from '../../types';
import { ArbeidIPeriode } from '../../types/ArbeidIPeriode';
import { Arbeidsforhold, ArbeidsforholdFrilanser, Normalarbeidstid } from '../../types/Arbeidsforhold';
import { ArbeidIPeriodeApiData, ArbeidstimerNormaltApiData, ArbeidsforholdApiData } from '../../types/SøknadApiData';
import { getFasteDagerApiData } from './tidsbrukApiUtils';

export const mapArbeidIPeriodeToApiData = ({
    // søknadsperiode,
    // arbeidsperiode,
    arbeidIPeriode,
    arbeidstimerNormalt,
}: {
    søknadsperiode: DateRange;
    arbeidsperiode?: Partial<DateRange>;
    arbeidIPeriode: ArbeidIPeriode;
    arbeidstimerNormalt: ArbeidstimerNormaltApiData;
}): ArbeidIPeriodeApiData => {
    const apiData: ArbeidIPeriodeApiData = {
        jobberIPerioden: arbeidIPeriode.jobberIPerioden,
    };
    if (arbeidIPeriode.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return apiData;
    }
    if (arbeidstimerNormalt.timerISnittPerUke) {
        arbeidstimerNormalt.timerISnittPerUke;
    }
    if (arbeidstimerNormalt.timerFastPerUkedag) {
        arbeidstimerNormalt.timerFastPerUkedag;
    }
    return apiData;
    // if (arbeidIPeriode.timerEllerProsent === TimerEllerProsent.PROSENT) {
    //     const jobberProsentNumber = getNumberFromNumberInputValue(arbeidIPeriode.jobberProsent);
    //     if (jobberProsentNumber === undefined) {
    //         throw new Error('mapArbeidIPeriodeToApiData - jobberProsentNumber undefined');
    //     }
    //     if (jobberNormaltTimerUkedager)
    //         const jobberTimerSnittNumber = getNumberFromNumberInputValue(jobberNormaltTimerPerUke);
    //     return {
    //         ...apiData,
    //         erLiktHverUke: true,
    //         fasteDager: lagFasteDagerUtFraProsentIPeriode(jobberNormaltTimerPerUke, jobberProsentNumber),
    //         jobberProsent: jobberProsentNumber,
    //     };
    // }

    // const normalTimerISODuration = durationToISODuration(decimalDurationToDuration(jobberNormaltTimerUkedager / 5));
    // const erLiktHverUke = isYesOrNoAnswered(arbeidIPeriode.erLiktHverUke)
    //     ? arbeidIPeriode.erLiktHverUke === YesOrNo.YES
    //     : undefined;
    // const enkeltdager =
    //     arbeidIPeriode.enkeltdager && !erLiktHverUke
    //         ? getArbeidstidEnkeltdagerIPeriodeApiData(
    //               arbeidIPeriode.enkeltdager,
    //               søknadsperiode,
    //               normalTimerISODuration
    //           )
    //         : undefined;

    // return {
    //     ...apiData,
    //     erLiktHverUke,
    //     enkeltdager: arbeidsperiode
    //         ? fjernArbeidstimerUtenforPeriodeOgHelgedager(arbeidsperiode, enkeltdager)
    //         : enkeltdager,
    //     fasteDager:
    //         arbeidIPeriode.fasteDager && erLiktHverUke
    //             ? getFasteArbeidsdagerApiData(arbeidIPeriode.fasteDager, normalTimerISODuration)
    //             : undefined,
    // };
};

const mapJobberNormaltTimer = ({
    timerPerUke,
    fasteDager,
    erLiktHverUke,
}: Normalarbeidstid): ArbeidstimerNormaltApiData | undefined => {
    if (erLiktHverUke === YesOrNo.YES) {
        const snitt = getNumberFromNumberInputValue(timerPerUke);
        return snitt !== undefined ? { erLiktHverUke: true, timerISnittPerUke: snitt } : undefined;
    }
    if (erLiktHverUke === YesOrNo.NO && fasteDager) {
        return {
            erLiktHverUke: false,
            timerFastPerUkedag: getFasteDagerApiData(fasteDager),
        };
    }
    return undefined;
};

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser,
    søknadsperiode: DateRange,
    /** Periode hvor en er aktiv, f.eks. noen som starter sluttet i søknadsperioden */
    arbeidsperiode?: Partial<DateRange>
): ArbeidsforholdApiData => {
    const harFraværIPeriode: boolean = arbeidsforhold.harFraværIPeriode === YesOrNo.YES;
    const arbeidstimerNormalt = arbeidsforhold.normalarbeidstid
        ? mapJobberNormaltTimer(arbeidsforhold.normalarbeidstid)
        : undefined;

    if (arbeidstimerNormalt === undefined) {
        throw new Error('mapArbeidIPeriodeToApiData - arbeidNormaltid is undefined');
    }

    const arbeidIPeriode =
        arbeidsforhold.arbeidIPeriode !== undefined && harFraværIPeriode
            ? mapArbeidIPeriodeToApiData({
                  søknadsperiode,
                  arbeidsperiode,
                  arbeidIPeriode: arbeidsforhold.arbeidIPeriode,
                  arbeidstimerNormalt,
              })
            : undefined;
    return {
        harFraværIPeriode,
        arbeidstimerNormalt,
        arbeidIPeriode,
    };
};
