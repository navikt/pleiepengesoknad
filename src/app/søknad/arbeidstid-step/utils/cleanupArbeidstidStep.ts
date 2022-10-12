import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormValues } from '../../../types/ArbeidIPeriodeFormValues';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserFormValues,
    ArbeidsforholdSelvstendigFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import {
    ArbeidFrilansSøknadsdata,
    ArbeidSelvstendigSøknadsdata,
    ArbeidsgivereSøknadsdata,
    ArbeidSøknadsdata,
    NormalarbeidstidSøknadsdata,
} from '../../../types/søknadsdata/Søknadsdata';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../../utils/selvstendigUtils';

export const cleanupArbeidIPeriode = (
    arbeidIPerioden: ArbeidIPeriodeFormValues,
    normalarbeidstid: NormalarbeidstidSøknadsdata | undefined
): ArbeidIPeriodeFormValues => {
    const arbeid: ArbeidIPeriodeFormValues = {
        arbeiderIPerioden: arbeidIPerioden.arbeiderIPerioden,
        erLiktHverUke: arbeidIPerioden.erLiktHverUke,
    };

    if (!normalarbeidstid) {
        throw 'cleanupArbeidIPeriode: normalarbeidstid er undefined';
    }

    if (arbeid.arbeiderIPerioden !== ArbeiderIPeriodenSvar.redusert) {
        return arbeid;
    }

    const { timerEllerProsent, prosentAvNormalt, snittTimerPerUke, arbeidsuker, erLiktHverUke } = arbeidIPerioden;
    arbeid.timerEllerProsent = timerEllerProsent;
    if (erLiktHverUke === YesOrNo.YES) {
        return timerEllerProsent === TimerEllerProsent.PROSENT
            ? { ...arbeid, timerEllerProsent, prosentAvNormalt, arbeidsuker: undefined }
            : { ...arbeid, timerEllerProsent, snittTimerPerUke, arbeidsuker: undefined };
    } else {
        return { ...arbeid, prosentAvNormalt: undefined, snittTimerPerUke: undefined, arbeidsuker };
    }
};

export const cleanupArbeidstidAnsatt = (
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
                    ? cleanupArbeidIPeriode(arbeidsforhold.arbeidIPeriode, arbeidsgiver.arbeidsforhold.normalarbeidstid)
                    : undefined,
        };
    });
};

export const cleanupArbeidstidFrilans = (
    frilans: FrilansFormData,
    frilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined,
    søknadsperiode: DateRange
): ArbeidsforholdFrilanserFormValues | undefined => {
    if (frilans.arbeidsforhold === undefined || !frilansSøknadsdata) {
        return undefined;
    }
    const periodeSomFrilanser = getPeriodeSomFrilanserInnenforPeriode(søknadsperiode, frilans);
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
                ? cleanupArbeidIPeriode(frilans.arbeidsforhold.arbeidIPeriode, normalarbeidstid)
                : undefined,
    };
};

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
                ? cleanupArbeidIPeriode(selvstendig_arbeidsforhold?.arbeidIPeriode, normalarbeidstid)
                : undefined,
    };
};

export const cleanupArbeidstidStep = (
    formData: SøknadFormValues,
    arbeidSøknadsdata: ArbeidSøknadsdata,
    søknadsperiode: DateRange
): SøknadFormValues => {
    const values: SøknadFormValues = { ...formData };

    values.ansatt_arbeidsforhold = arbeidSøknadsdata.arbeidsgivere
        ? cleanupArbeidstidAnsatt(values.ansatt_arbeidsforhold, arbeidSøknadsdata.arbeidsgivere)
        : values.ansatt_arbeidsforhold;
    values.frilans.arbeidsforhold = cleanupArbeidstidFrilans(values.frilans, arbeidSøknadsdata.frilans, søknadsperiode);
    values.selvstendig.arbeidsforhold = cleanupArbeidstidSelvstendigNæringdrivende(
        søknadsperiode,
        arbeidSøknadsdata.selvstendig,
        values.selvstendig.virksomhet,
        values.selvstendig.arbeidsforhold
    );

    return values;
};
