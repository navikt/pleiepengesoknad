import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { getDurationsInDateRange } from '@navikt/sif-common-utils';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../types';
import {
    ArbeidIPeriode,
    Arbeidsforhold,
    ArbeidsforholdSelvstendig,
    ArbeidsforholdFrilanser,
    FrilansFormDataPart,
    SøknadFormData,
} from '../../../types/SøknadFormData';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../../utils/selvstendigUtils';

export const cleanupArbeidIPeriode = (arbeidIPerioden: ArbeidIPeriode, periode: DateRange): ArbeidIPeriode => {
    const arbeid: ArbeidIPeriode = {
        jobberIPerioden: arbeidIPerioden.jobberIPerioden,
    };

    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return arbeid;
    }

    const { erLiktHverUke, enkeltdager, timerEllerProsent, fasteDager, jobberProsent } = arbeidIPerioden;

    if (erLiktHverUke === YesOrNo.YES) {
        arbeid.erLiktHverUke = erLiktHverUke;
        arbeid.timerEllerProsent = timerEllerProsent;
        return timerEllerProsent === TimerEllerProsent.PROSENT
            ? { ...arbeid, jobberProsent }
            : { ...arbeid, fasteDager };
    }

    return {
        ...arbeid,
        erLiktHverUke,
        enkeltdager: enkeltdager ? getDurationsInDateRange(enkeltdager, periode) : undefined,
    };
};

export const cleanupArbeidstidAnsatt = (
    ansatt_arbeidsforhold: Arbeidsforhold[],
    søknadsperiode: DateRange
): Arbeidsforhold[] => {
    return ansatt_arbeidsforhold.map((arbeidsforhold) => ({
        ...arbeidsforhold,
        arbeidIPeriode: arbeidsforhold.arbeidIPeriode
            ? cleanupArbeidIPeriode(arbeidsforhold.arbeidIPeriode, søknadsperiode)
            : undefined,
    }));
};

export const cleanupArbeidstidFrilans = (
    frilans: FrilansFormDataPart,
    søknadsperiode: DateRange
): ArbeidsforholdFrilanser => {
    const periodeSomFrilanser = getPeriodeSomFrilanserInnenforPeriode(søknadsperiode, frilans);
    return {
        ...frilans.arbeidsforhold,
        arbeidIPeriode:
            periodeSomFrilanser && frilans.arbeidsforhold?.arbeidIPeriode
                ? cleanupArbeidIPeriode(frilans.arbeidsforhold?.arbeidIPeriode, periodeSomFrilanser)
                : undefined,
    };
};

export const cleanupArbeidstidSelvstendigNæringdrivende = (
    søknadsperiode: DateRange,
    selvstendig_virksomhet?: Virksomhet | undefined,
    selvstendig_arbeidsforhold?: ArbeidsforholdSelvstendig
): ArbeidsforholdSelvstendig => {
    const periodeSomSelvstendigNæringsdrivende = getPeriodeSomSelvstendigInnenforPeriode(
        søknadsperiode,
        selvstendig_virksomhet
    );
    return {
        ...selvstendig_arbeidsforhold,
        arbeidIPeriode:
            selvstendig_arbeidsforhold?.arbeidIPeriode && periodeSomSelvstendigNæringsdrivende
                ? cleanupArbeidIPeriode(
                      selvstendig_arbeidsforhold?.arbeidIPeriode,
                      periodeSomSelvstendigNæringsdrivende
                  )
                : undefined,
    };
};

export const cleanupArbeidstidStep = (formData: SøknadFormData, søknadsperiode: DateRange): SøknadFormData => {
    const values: SøknadFormData = { ...formData };

    values.ansatt_arbeidsforhold = cleanupArbeidstidAnsatt(values.ansatt_arbeidsforhold, søknadsperiode);
    values.frilans.arbeidsforhold = cleanupArbeidstidFrilans(values.frilans, søknadsperiode);
    values.selvstendig_arbeidsforhold = cleanupArbeidstidSelvstendigNæringdrivende(
        søknadsperiode,
        values.selvstendig_virksomhet,
        values.selvstendig_arbeidsforhold
    );

    return values;
};
