import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import dayjs from 'dayjs';
import { JobberIPeriodeSvar } from '../../../types';
import {
    ArbeidIPeriode,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';

import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getArbeidsperiodeFrilans } from '../../../utils/frilanserUtils';
import { visSpørsmålOmTidErLikHverUke } from '../../../utils/tidsbrukUtils';

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

const cleanupArbeidIPeriode = (periode: DateRange, arbeidIPerioden: ArbeidIPeriode): ArbeidIPeriode => {
    const arbeid: ArbeidIPeriode = {
        jobberIPerioden: arbeidIPerioden.jobberIPerioden,
    };
    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return arbeid;
    }
    arbeid.jobberSomVanlig = arbeidIPerioden.jobberSomVanlig;
    if (arbeid.jobberSomVanlig === YesOrNo.YES) {
        return arbeid;
    }

    arbeid.erLiktHverUke = visSpørsmålOmTidErLikHverUke(periode) ? arbeidIPerioden.erLiktHverUke : undefined;
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.YES) {
        arbeid.fasteDager = arbeidIPerioden.fasteDager;
        return arbeid;
    }
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.NO || arbeidIPerioden.erLiktHverUke === undefined) {
        arbeid.enkeltdager = arbeidIPerioden.enkeltdager;
        return arbeid;
    }
    return arbeidIPerioden;
};

const cleanupArbeidsforhold = (
    arbeidsforhold: Arbeidsforhold,
    periode: DateRange,
    erHistorisk: boolean
): Arbeidsforhold => {
    if (erHistorisk && arbeidsforhold.historisk) {
        return {
            ...arbeidsforhold,
            historisk: cleanupArbeidIPeriode(periode, arbeidsforhold.historisk),
        };
    }
    if (erHistorisk === false && arbeidsforhold.planlagt) {
        return {
            ...arbeidsforhold,
            planlagt: cleanupArbeidIPeriode(periode, arbeidsforhold.planlagt),
        };
    }
    return arbeidsforhold;
};

const cleanupArbeidsforholdFrilanser = (
    frilans_arbeidsforhold: ArbeidsforholdSNF,
    erHistorisk: boolean,
    periode: DateRange,
    frilans_startdato?: string,
    frilans_sluttdato?: string,
    frilans_jobberFortsattSomFrilans?: YesOrNo
): ArbeidsforholdSNF => {
    const friPeriode = getArbeidsperiodeFrilans(periode, {
        frilans_sluttdato,
        frilans_startdato,
        frilans_jobberFortsattSomFrilans,
    });

    const arbeidsforhold: ArbeidsforholdSNF = cleanupArbeidsforhold(
        frilans_arbeidsforhold,
        friPeriode || periode,
        erHistorisk
    ) as ArbeidsforholdSNF;

    if (friPeriode === undefined && erHistorisk) {
        arbeidsforhold.historisk = undefined;
    }
    if (friPeriode === undefined && erHistorisk === false) {
        arbeidsforhold.planlagt = undefined;
    }

    // const startdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    // const sluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);
    // if (erHistorisk === false && sluttdato && dayjs(sluttdato).isBefore(periode.from, 'day')) {
    //     arbeidsforhold.planlagt = undefined;
    // }
    // if (erHistorisk && startdato && dayjs(startdato).isAfter(periode.to, 'day')) {
    //     arbeidsforhold.historisk = undefined;
    // }

    return arbeidsforhold;
};

export const cleanupArbeidIPeriodeStepData = (
    formData: PleiepengesøknadFormData,
    periode: DateRange,
    erHistorisk: boolean
): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formData };
    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(
        (arbeidsforhold) => cleanupArbeidsforhold(arbeidsforhold, periode, erHistorisk) as ArbeidsforholdAnsatt
    );
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? cleanupArbeidsforholdFrilanser(
              values.frilans_arbeidsforhold,
              erHistorisk,
              periode,
              formData.frilans_startdato,
              formData.frilans_sluttdato
          )
        : undefined;

    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? (cleanupArbeidsforhold(values.selvstendig_arbeidsforhold, periode, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    return values;
};
