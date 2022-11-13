import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { TimerEllerProsent } from '../../../types';
import {
    ArbeidIPeriodeFormField,
    ArbeidIPeriodeFormValues,
    ArbeidsukerFormValues,
} from '../../../types/ArbeidIPeriodeFormValues';
import {
    ArbeidsforholdFormValues,
    // ArbeidsforholdFrilanserMedOppdragFormValues,
    ///ArbeidsforholdFrilanserFormValues,
    ArbeidsforholdSelvstendigFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import {
    ArbeidSelvstendigSøknadsdata,
    ArbeidsgivereSøknadsdata,
    ArbeidSøknadsdata,
    // FrilansereSøknadsdata,
    NormalarbeidstidSøknadsdata,
    //OppdragsgivereSøknadsdata,
} from '../../../types/søknadsdata/Søknadsdata';
// import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../../utils/selvstendigUtils';
import { getArbeidsukeKey } from '../components/ArbeidstidUkerSpørsmål';
// import { getArbeidsukerIPerioden, skalSvarePåOmEnJobberLiktIPerioden } from './arbeidstidUtils';
import { arbeidIPeriodeSpørsmålConfig } from './arbeidIPeriodeSpørsmålConfig';
import { getArbeidsukerIPerioden } from './arbeidstidUtils';

export const cleanupArbeidsuker = (
    periode: DateRange,
    arbeidsuker: ArbeidsukerFormValues,
    timerEllerProsent: TimerEllerProsent
): ArbeidsukerFormValues => {
    const cleanedArbeidsuker: ArbeidsukerFormValues = {};
    const arbeidsukerIPerioden = getArbeidsukerIPerioden(periode);
    arbeidsukerIPerioden.forEach((periode) => {
        const key = getArbeidsukeKey(periode);
        if (arbeidsuker[key]) {
            const { prosentAvNormalt, snittTimerPerUke } = arbeidsuker[key];
            cleanedArbeidsuker[key] = {
                prosentAvNormalt: timerEllerProsent === TimerEllerProsent.PROSENT ? prosentAvNormalt : undefined,
                snittTimerPerUke: timerEllerProsent === TimerEllerProsent.TIMER ? snittTimerPerUke : undefined,
            };
        }
    });
    return cleanedArbeidsuker;
};

export const cleanupArbeidIPeriode = (
    arbeidsperiode: DateRange,
    arbeidIPerioden: ArbeidIPeriodeFormValues,
    normalarbeidstid: NormalarbeidstidSøknadsdata | undefined
): ArbeidIPeriodeFormValues => {
    const config = arbeidIPeriodeSpørsmålConfig.getVisbility({
        formValues: arbeidIPerioden,
        arbeidsperiode,
    });

    const arbeid: ArbeidIPeriodeFormValues = {
        arbeiderIPerioden: arbeidIPerioden.arbeiderIPerioden,
    };
    if (arbeid.arbeiderIPerioden !== ArbeiderIPeriodenSvar.redusert) {
        return arbeid;
    }
    if (!normalarbeidstid) {
        throw 'cleanupArbeidIPeriode: normalarbeidstid er undefined';
    }

    if (config.isIncluded(ArbeidIPeriodeFormField.erLiktHverUke)) {
        arbeid.erLiktHverUke = arbeidIPerioden.erLiktHverUke;
    }
    if (config.isIncluded(ArbeidIPeriodeFormField.timerEllerProsent)) {
        arbeid.timerEllerProsent = arbeidIPerioden.timerEllerProsent;
    }
    if (arbeid.erLiktHverUke === YesOrNo.YES) {
        return arbeid.timerEllerProsent === TimerEllerProsent.PROSENT
            ? { ...arbeid, prosentAvNormalt: arbeidIPerioden.prosentAvNormalt, arbeidsuker: undefined }
            : { ...arbeid, snittTimerPerUke: arbeidIPerioden.snittTimerPerUke, arbeidsuker: undefined };
    } else {
        return {
            ...arbeid,
            prosentAvNormalt: undefined,
            snittTimerPerUke: undefined,
            arbeidsuker: arbeidIPerioden.arbeidsuker
                ? cleanupArbeidsuker(arbeidsperiode, arbeidIPerioden.arbeidsuker, TimerEllerProsent.TIMER)
                : undefined,
        };
    }
};

export const cleanupArbeidstidAnsatt = (
    søknadsperiode: DateRange,
    ansatt_arbeidsforhold: ArbeidsforholdFormValues[],
    arbeidsgivere: ArbeidsgivereSøknadsdata | undefined
): ArbeidsforholdFormValues[] => {
    if (!arbeidsgivere) {
        throw 'cleanupArbeidstidAnsatt: arbeidsgivere er undefined';
    }
    return ansatt_arbeidsforhold.map((arbeidsforhold) => {
        const arbeidsgiver = arbeidsgivere.get(arbeidsforhold.arbeidsgiver.id);
        if (!arbeidsgiver || arbeidsgiver?.erAnsattISøknadsperiode === false) {
            return arbeidsforhold;
        }
        return {
            ...arbeidsforhold,
            arbeidIPeriode:
                arbeidsforhold.arbeidIPeriode && arbeidsforhold.normalarbeidstid
                    ? cleanupArbeidIPeriode(
                          søknadsperiode,
                          arbeidsforhold.arbeidIPeriode,
                          arbeidsgiver.arbeidsforhold.normalarbeidstid
                      )
                    : undefined,
        };
    });
};
/*
export const cleanupArbeidstidFrilans = (
    frilansArbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues[],
    frilansereSøknadsdata: OppdragsgivereSøknadsdata | FrilansereSøknadsdata | undefined,
    søknadsperiode: DateRange
): ArbeidsforholdFrilanserMedOppdragFormValues[] | undefined => {
    if (!frilansereSøknadsdata) {
        throw 'cleanupArbeidstidFrilansere: oppdragsgivere er undefined';
    }
    return frilansArbeidsforhold.map((arbeidsforhold) => {
        const arbeidsgiver = frilansereSøknadsdata.get(arbeidsforhold.arbeidsgiver.id);
        if (!arbeidsgiver || arbeidsgiver?.erAnsattISøknadsperiode === false) {
            return arbeidsforhold;
        }
        return {
            ...arbeidsforhold,
            arbeidIPeriode:
                arbeidsforhold.arbeidIPeriode && arbeidsforhold.normalarbeidstid
                    ? cleanupArbeidIPeriode(
                          søknadsperiode,
                          arbeidsforhold.arbeidIPeriode,
                          arbeidsgiver.arbeidsforhold.normalarbeidstid
                      )
                    : undefined,
        };
    });
    const periodeSomFrilanser = getPeriodeSomFrilanserInnenforPeriode(søknadsperiode, frilans);
    const erLiktHverUke = skalSvarePåOmEnJobberLiktIPerioden(periodeSomFrilanser)
        ? frilans.arbeidsforhold.arbeidIPeriode?.erLiktHverUke
        : YesOrNo.NO;

    const normalarbeidstid = frilansSøknadsdata.erFrilanser
        ? frilansSøknadsdata.arbeidsforhold.normalarbeidstid
        : undefined;

    return {
        ...frilans.arbeidsforhold,
        arbeidIPeriode:
            periodeSomFrilanser &&
            normalarbeidstid &&
            frilans.arbeidsforhold.arbeidIPeriode &&
            frilans.arbeidsforhold.normalarbeidstid
                ? cleanupArbeidIPeriode(
                      periodeSomFrilanser,
                      { ...frilans.arbeidsforhold.arbeidIPeriode, erLiktHverUke },
                      normalarbeidstid
                  )
                : undefined,
    };
};

/*export const cleanupArbeidstidFrilans = (
    frilans: FrilansFormData,
    frilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined,
    søknadsperiode: DateRange
): ArbeidsforholdFrilanserFormValues | undefined => {
    if (frilans.arbeidsforhold === undefined || !frilansSøknadsdata) {
        return undefined;
    }
    const periodeSomFrilanser = getPeriodeSomFrilanserInnenforPeriode(søknadsperiode, frilans);
    const erLiktHverUke = skalSvarePåOmEnJobberLiktIPerioden(periodeSomFrilanser)
        ? frilans.arbeidsforhold.arbeidIPeriode?.erLiktHverUke
        : YesOrNo.NO;

    const normalarbeidstid = frilansSøknadsdata.erFrilanser
        ? frilansSøknadsdata.arbeidsforhold.normalarbeidstid
        : undefined;

    return {
        ...frilans.arbeidsforhold,
        arbeidIPeriode:
            periodeSomFrilanser &&
            normalarbeidstid &&
            frilans.arbeidsforhold.arbeidIPeriode &&
            frilans.arbeidsforhold.normalarbeidstid
                ? cleanupArbeidIPeriode(
                      periodeSomFrilanser,
                      { ...frilans.arbeidsforhold.arbeidIPeriode, erLiktHverUke },
                      normalarbeidstid
                  )
                : undefined,
    };
};
*/

export const cleanupArbeidstidSelvstendigNæringdrivende = (
    søknadsperiode: DateRange,
    selvstendigSøknadsdata: ArbeidSelvstendigSøknadsdata | undefined,
    selvstendig_virksomhet: Virksomhet | undefined,
    selvstendig_arbeidsforhold: ArbeidsforholdSelvstendigFormValues | undefined
): ArbeidsforholdSelvstendigFormValues | undefined => {
    if (!selvstendig_arbeidsforhold || !selvstendigSøknadsdata) {
        return undefined;
    }
    const periodeSomSelvstendigNæringsdrivende = getPeriodeSomSelvstendigInnenforPeriode(
        søknadsperiode,
        selvstendig_virksomhet
    );
    const normalarbeidstid = selvstendigSøknadsdata.erSN
        ? selvstendigSøknadsdata.arbeidsforhold.normalarbeidstid
        : undefined;
    return {
        ...selvstendig_arbeidsforhold,
        arbeidIPeriode:
            selvstendig_arbeidsforhold?.arbeidIPeriode &&
            periodeSomSelvstendigNæringsdrivende &&
            selvstendig_arbeidsforhold.normalarbeidstid
                ? cleanupArbeidIPeriode(søknadsperiode, selvstendig_arbeidsforhold?.arbeidIPeriode, normalarbeidstid)
                : undefined,
    };
};

export const cleanupArbeidstidStep = (
    formData: SøknadFormValues,
    arbeidSøknadsdata: ArbeidSøknadsdata,
    søknadsperiode: DateRange
): SøknadFormValues => {
    const values: SøknadFormValues = { ...formData };

    //TODO NYFRILANS OG MED OOPDRAG
    values.ansatt_arbeidsforhold = arbeidSøknadsdata.arbeidsgivere
        ? cleanupArbeidstidAnsatt(søknadsperiode, values.ansatt_arbeidsforhold, arbeidSøknadsdata.arbeidsgivere)
        : values.ansatt_arbeidsforhold;
    values.selvstendig.arbeidsforhold = cleanupArbeidstidSelvstendigNæringdrivende(
        søknadsperiode,
        arbeidSøknadsdata.selvstendig,
        values.selvstendig.virksomhet,
        values.selvstendig.arbeidsforhold
    );

    return values;
};
