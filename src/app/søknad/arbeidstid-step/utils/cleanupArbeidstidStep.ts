import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { getDurationsInDateRange } from '@navikt/sif-common-utils';
import { TimerEllerProsent } from '../../../types';
import { ArbeiderIPeriodenSvar, ArbeidIPeriodeFormData } from '../../../types/ArbeidIPeriodeFormData';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFrilanserFormData,
    ArbeidsforholdSelvstendigFormData,
    NormalarbeidstidFormData,
} from '../../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { SøknadFormData } from '../../../types/SøknadFormData';
import {
    removeDurationWeekdaysNotInDurationWeekdays,
    removeDurationWeekdaysWithNoDuration,
} from '../../../utils/durationWeekdaysUtils';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../../utils/selvstendigUtils';

export const cleanupArbeidIPeriode = (
    arbeidIPerioden: ArbeidIPeriodeFormData,
    normalarbeidstid: NormalarbeidstidFormData,
    periode: DateRange
): ArbeidIPeriodeFormData => {
    const arbeid: ArbeidIPeriodeFormData = {
        arbeiderIPerioden: arbeidIPerioden.arbeiderIPerioden,
    };

    if (arbeid.arbeiderIPerioden !== ArbeiderIPeriodenSvar.redusert) {
        return arbeid;
    }

    const { erLiktHverUke, enkeltdager, timerEllerProsent, fasteDager, prosentAvNormalt, timerPerUke } =
        arbeidIPerioden;

    /** Bruker har variert normalarbeidstid og får ikke spørsmål om det er likt hver uke  */
    if (erLiktHverUke === undefined) {
        arbeid.erLiktHverUke = erLiktHverUke;
        arbeid.timerEllerProsent = timerEllerProsent;
        return timerEllerProsent === TimerEllerProsent.PROSENT
            ? { ...arbeid, timerEllerProsent, prosentAvNormalt }
            : { ...arbeid, timerEllerProsent, timerPerUke };
    }

    /** Bruker har fast normarlarbeidstid */
    if (erLiktHverUke === YesOrNo.YES) {
        arbeid.erLiktHverUke = erLiktHverUke;
        arbeid.fasteDager =
            normalarbeidstid.timerFasteUkedager && fasteDager
                ? removeDurationWeekdaysWithNoDuration(
                      removeDurationWeekdaysNotInDurationWeekdays(fasteDager, normalarbeidstid.timerFasteUkedager)
                  )
                : undefined;
        return arbeid;
    }
    return {
        ...arbeid,
        erLiktHverUke,
        enkeltdager: enkeltdager ? getDurationsInDateRange(enkeltdager, periode) : undefined,
    };
};

export const cleanupArbeidstidAnsatt = (
    ansatt_arbeidsforhold: ArbeidsforholdFormData[],
    søknadsperiode: DateRange
): ArbeidsforholdFormData[] => {
    return ansatt_arbeidsforhold.map((arbeidsforhold) => {
        return {
            ...arbeidsforhold,
            arbeidIPeriode:
                arbeidsforhold.arbeidIPeriode && arbeidsforhold.normalarbeidstid
                    ? cleanupArbeidIPeriode(
                          arbeidsforhold.arbeidIPeriode,
                          arbeidsforhold.normalarbeidstid,
                          søknadsperiode
                      )
                    : undefined,
        };
    });
};

export const cleanupArbeidstidFrilans = (
    frilans: FrilansFormData,
    søknadsperiode: DateRange
): ArbeidsforholdFrilanserFormData | undefined => {
    if (frilans.arbeidsforhold === undefined) {
        return undefined;
    }
    const periodeSomFrilanser = getPeriodeSomFrilanserInnenforPeriode(søknadsperiode, frilans);
    return {
        ...frilans.arbeidsforhold,
        arbeidIPeriode:
            periodeSomFrilanser && frilans.arbeidsforhold.arbeidIPeriode && frilans.arbeidsforhold.normalarbeidstid
                ? cleanupArbeidIPeriode(
                      frilans.arbeidsforhold.arbeidIPeriode,
                      frilans.arbeidsforhold.normalarbeidstid,
                      periodeSomFrilanser
                  )
                : undefined,
    };
};

export const cleanupArbeidstidSelvstendigNæringdrivende = (
    søknadsperiode: DateRange,
    selvstendig_virksomhet: Virksomhet | undefined,
    selvstendig_arbeidsforhold: ArbeidsforholdSelvstendigFormData | undefined
): ArbeidsforholdSelvstendigFormData | undefined => {
    if (!selvstendig_arbeidsforhold) {
        return undefined;
    }
    const periodeSomSelvstendigNæringsdrivende = getPeriodeSomSelvstendigInnenforPeriode(
        søknadsperiode,
        selvstendig_virksomhet
    );
    return {
        ...selvstendig_arbeidsforhold,
        arbeidIPeriode:
            selvstendig_arbeidsforhold?.arbeidIPeriode &&
            periodeSomSelvstendigNæringsdrivende &&
            selvstendig_arbeidsforhold.normalarbeidstid
                ? cleanupArbeidIPeriode(
                      selvstendig_arbeidsforhold?.arbeidIPeriode,
                      selvstendig_arbeidsforhold.normalarbeidstid,
                      periodeSomSelvstendigNæringsdrivende
                  )
                : undefined,
    };
};

export const cleanupArbeidstidStep = (formData: SøknadFormData, søknadsperiode: DateRange): SøknadFormData => {
    const values: SøknadFormData = { ...formData };

    values.ansatt_arbeidsforhold = cleanupArbeidstidAnsatt(values.ansatt_arbeidsforhold, søknadsperiode);
    values.frilans.arbeidsforhold = cleanupArbeidstidFrilans(values.frilans, søknadsperiode);
    values.selvstendig.arbeidsforhold = cleanupArbeidstidSelvstendigNæringdrivende(
        søknadsperiode,
        values.selvstendig.virksomhet,
        values.selvstendig.arbeidsforhold
    );

    return values;
};
