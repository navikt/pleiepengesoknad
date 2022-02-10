import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getDurationsInDateRange } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../types';
import {
    ArbeidIPeriode,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    SøknadFormData,
} from '../../../types/SøknadFormData';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../../utils/frilanserUtils';

dayjs.extend(minMax);

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

export const cleanupArbeidsforhold = (arbeidsforhold: Arbeidsforhold, periode: DateRange): Arbeidsforhold => {
    if (arbeidsforhold.arbeidIPeriode) {
        return {
            ...arbeidsforhold,
            arbeidIPeriode: cleanupArbeidIPeriode(periode, arbeidsforhold.arbeidIPeriode),
        };
    }
    return arbeidsforhold;
};

const cleanupArbeidsforholdFrilanser = (
    frilans_arbeidsforhold: ArbeidsforholdSNF,
    periode: DateRange,
    frilans_startdato?: string,
    frilans_sluttdato?: string,
    frilans_jobberFortsattSomFrilans?: YesOrNo
): ArbeidsforholdSNF => {
    const frilansPeriodeISøknadsperiode = getPeriodeSomFrilanserInnenforPeriode(periode, {
        frilans_sluttdato,
        frilans_startdato,
        frilans_jobberFortsattSomFrilans,
    });

    const arbeidsforhold: ArbeidsforholdSNF = cleanupArbeidsforhold(
        frilans_arbeidsforhold,
        frilansPeriodeISøknadsperiode || periode
    ) as ArbeidsforholdSNF;

    /** Frilanser er ikke frilanser i søknadsperioden før dagens dato */
    if (frilansPeriodeISøknadsperiode === undefined) {
        arbeidsforhold.arbeidIPeriode = {
            jobberIPerioden: JobberIPeriodeSvar.NEI,
        };
    }
    return arbeidsforhold;
};

export const cleanupArbeidIPeriodeStep = (formData: SøknadFormData, periode: DateRange): SøknadFormData => {
    const values: SøknadFormData = { ...formData };
    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(
        (arbeidsforhold) => cleanupArbeidsforhold(arbeidsforhold, periode) as ArbeidsforholdAnsatt
    );
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? cleanupArbeidsforholdFrilanser(
              values.frilans_arbeidsforhold,
              periode,
              formData.frilans_startdato,
              formData.frilans_sluttdato
          )
        : undefined;

    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? (cleanupArbeidsforhold(values.selvstendig_arbeidsforhold, periode) as ArbeidsforholdSNF)
        : undefined;
    return values;
};
