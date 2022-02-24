// import { FrilansFormDataPart } from './../../../types/SøknadFormData';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getDurationsInDateRange } from '@navikt/sif-common-utils';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../types';
import { ArbeidIPeriode, Arbeidsforhold, SøknadFormData } from '../../../types/SøknadFormData';
// import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';

export const cleanupArbeidIPeriode = (periode: DateRange, arbeidIPerioden: ArbeidIPeriode): ArbeidIPeriode => {
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

export const cleanupArbeidsforhold = (arbeidsforhold: Arbeidsforhold, søknadsperiode: DateRange): Arbeidsforhold => {
    if (arbeidsforhold.arbeidIPeriode) {
        return {
            ...arbeidsforhold,
            arbeidIPeriode: cleanupArbeidIPeriode(søknadsperiode, arbeidsforhold.arbeidIPeriode),
        };
    }
    return arbeidsforhold;
};

export const cleanupArbeidstidStep = (formData: SøknadFormData, søknadsperiode: DateRange): SøknadFormData => {
    const values: SøknadFormData = { ...formData };
    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map((arbeidsforhold) =>
        cleanupArbeidsforhold(arbeidsforhold, søknadsperiode)
    );

    values.frilans.arbeidsforhold = values.frilans.arbeidsforhold?.arbeidIPeriode
        ? {
              ...values.frilans.arbeidsforhold,
              arbeidIPeriode: cleanupArbeidIPeriode(søknadsperiode, values.frilans.arbeidsforhold.arbeidIPeriode),
          }
        : undefined;

    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? cleanupArbeidsforhold(values.selvstendig_arbeidsforhold, søknadsperiode)
        : undefined;

    return values;
};
