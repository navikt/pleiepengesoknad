import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import {
    getDurationsInDateRange,
    removeDurationWeekdaysNotInDurationWeekdays,
    removeDurationWeekdaysWithNoDuration,
} from '@navikt/sif-common-utils';
import { TimerEllerProsent } from '../../../types';
import { ArbeiderIPeriodenSvar, ArbeidIPeriodeFormData } from '../../../types/ArbeidIPeriodeFormData';
import {
    ArbeidsforholdFormData,
    ArbeidsforholdFrilanserFormData,
    ArbeidsforholdSelvstendigFormData,
} from '../../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { SøknadFormData } from '../../../types/SøknadFormData';
import {
    ArbeidFrilansSøknadsdata,
    ArbeidSelvstendigSøknadsdata,
    ArbeidsgivereSøknadsdata,
    ArbeidSøknadsdata,
    NormalarbeidstidSøknadsdata,
} from '../../../types/Søknadsdata';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../../utils/selvstendigUtils';

export const cleanupArbeidIPeriode = (
    arbeidIPerioden: ArbeidIPeriodeFormData,
    normalarbeidstid: NormalarbeidstidSøknadsdata | undefined,
    periode: DateRange
): ArbeidIPeriodeFormData => {
    const arbeid: ArbeidIPeriodeFormData = {
        arbeiderIPerioden: arbeidIPerioden.arbeiderIPerioden,
    };

    if (!normalarbeidstid) {
        throw 'cleanupArbeidIPeriode: normalarbeidstid er undefined';
    }

    if (arbeid.arbeiderIPerioden !== ArbeiderIPeriodenSvar.redusert) {
        return arbeid;
    }

    const { erLiktHverUke, enkeltdager, timerEllerProsent, fasteDager, prosentAvNormalt, timerPerUke } =
        arbeidIPerioden;

    if (normalarbeidstid.erFasteUkedager) {
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
    } else {
        arbeid.erLiktHverUke = erLiktHverUke;
        arbeid.timerEllerProsent = timerEllerProsent;
        return timerEllerProsent === TimerEllerProsent.PROSENT
            ? { ...arbeid, timerEllerProsent, prosentAvNormalt }
            : { ...arbeid, timerEllerProsent, timerPerUke };
    }
};

const getNormalarbeidstidForArbeidsgiverISøknadsdata = (
    arbeidsgivere: ArbeidsgivereSøknadsdata,
    arbeidsgiverId: string
): NormalarbeidstidSøknadsdata | undefined => {
    const arbeidsgiverSøknadsdata = arbeidsgivere.get(arbeidsgiverId);
    if (arbeidsgiverSøknadsdata?.erAnsattISøknadsperiode) {
        return arbeidsgiverSøknadsdata.arbeidsforhold.normalarbeidstid;
    }
    return undefined;
};

export const cleanupArbeidstidAnsatt = (
    ansatt_arbeidsforhold: ArbeidsforholdFormData[],
    arbeidsgivere: ArbeidsgivereSøknadsdata | undefined,
    søknadsperiode: DateRange
): ArbeidsforholdFormData[] => {
    if (!arbeidsgivere) {
        throw 'cleanupArbeidstidAnsatt: arbeidsgivere er undefined';
    }
    return ansatt_arbeidsforhold.map((arbeidsforhold) => {
        const normalarbeidstid = getNormalarbeidstidForArbeidsgiverISøknadsdata(
            arbeidsgivere,
            arbeidsforhold.arbeidsgiver.id
        );
        if (!normalarbeidstid) {
            throw 'cleanupArbeidstidAnsatt: kunne ikke finne normalarbeidstid for arbeidsgiver';
        }
        return {
            ...arbeidsforhold,
            arbeidIPeriode:
                arbeidsforhold.arbeidIPeriode && arbeidsforhold.normalarbeidstid
                    ? cleanupArbeidIPeriode(arbeidsforhold.arbeidIPeriode, normalarbeidstid, søknadsperiode)
                    : undefined,
        };
    });
};

export const cleanupArbeidstidFrilans = (
    frilans: FrilansFormData,
    frilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined,
    søknadsperiode: DateRange
): ArbeidsforholdFrilanserFormData | undefined => {
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
                ? cleanupArbeidIPeriode(frilans.arbeidsforhold.arbeidIPeriode, normalarbeidstid, periodeSomFrilanser)
                : undefined,
    };
};

export const cleanupArbeidstidSelvstendigNæringdrivende = (
    søknadsperiode: DateRange,
    selvstendigSøknadsdata: ArbeidSelvstendigSøknadsdata | undefined,
    selvstendig_virksomhet: Virksomhet | undefined,
    selvstendig_arbeidsforhold: ArbeidsforholdSelvstendigFormData | undefined
): ArbeidsforholdSelvstendigFormData | undefined => {
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
                ? cleanupArbeidIPeriode(
                      selvstendig_arbeidsforhold?.arbeidIPeriode,
                      normalarbeidstid,
                      periodeSomSelvstendigNæringsdrivende
                  )
                : undefined,
    };
};

export const cleanupArbeidstidStep = (
    formData: SøknadFormData,
    arbeidSøknadsdata: ArbeidSøknadsdata,
    søknadsperiode: DateRange
): SøknadFormData => {
    const values: SøknadFormData = { ...formData };

    values.ansatt_arbeidsforhold = cleanupArbeidstidAnsatt(
        values.ansatt_arbeidsforhold,
        arbeidSøknadsdata.arbeidsgivere,
        søknadsperiode
    );
    values.frilans.arbeidsforhold = cleanupArbeidstidFrilans(values.frilans, arbeidSøknadsdata.frilans, søknadsperiode);
    values.selvstendig.arbeidsforhold = cleanupArbeidstidSelvstendigNæringdrivende(
        søknadsperiode,
        arbeidSøknadsdata.selvstendig,
        values.selvstendig.virksomhet,
        values.selvstendig.arbeidsforhold
    );

    return values;
};
