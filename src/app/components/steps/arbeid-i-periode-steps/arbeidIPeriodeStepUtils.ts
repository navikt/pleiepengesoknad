import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
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

dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

const cleanupArbeidIPeriode = (arbeidIPerioden: ArbeidIPeriode): ArbeidIPeriode => {
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

    arbeid.erLiktHverUke = arbeidIPerioden.erLiktHverUke;
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.YES) {
        arbeid.fasteDager = arbeidIPerioden.fasteDager;
        return arbeid;
    }
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.NO) {
        arbeid.enkeltdager = arbeidIPerioden.enkeltdager;
        return arbeid;
    }
    return arbeidIPerioden;
};

const cleanupArbeidsforhold = (arbeidsforhold: Arbeidsforhold, erHistorisk: boolean): Arbeidsforhold => {
    if (erHistorisk && arbeidsforhold.historisk) {
        return {
            ...arbeidsforhold,
            historisk: cleanupArbeidIPeriode(arbeidsforhold.historisk),
        };
    }
    if (erHistorisk === false && arbeidsforhold.planlagt) {
        return {
            ...arbeidsforhold,
            planlagt: cleanupArbeidIPeriode(arbeidsforhold.planlagt),
        };
    }
    return arbeidsforhold;
};

export const cleanupArbeidIPeriodeStepData = (
    formData: PleiepengesøknadFormData,
    erHistorisk: boolean
): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formData };
    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(
        (arbeidsforhold) => cleanupArbeidsforhold(arbeidsforhold, erHistorisk) as ArbeidsforholdAnsatt
    );
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? (cleanupArbeidsforhold(values.frilans_arbeidsforhold, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? (cleanupArbeidsforhold(values.selvstendig_arbeidsforhold, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    return values;
};

/**
 *
 * @param periode
 * @param frilans_startdato
 * @param frilans_sluttdato
 * @param frilans_jobberFortsattSomFrilans
 * @returns DateRange
 *
 * Avkort periode med evt start og sluttdato som frilanser.
 * Returnerer undefined dersom start og/eller slutt som frilanser
 * gjør at bruker ikke var frilanser i perioden
 */

export const getArbeidsperiodeFrilans = (
    periode: DateRange,
    frilans_startdato: string | undefined,
    frilans_sluttdato: string | undefined,
    frilans_jobberFortsattSomFrilans: YesOrNo | undefined
): DateRange | undefined => {
    const erFortsattFrilanser = frilans_jobberFortsattSomFrilans === YesOrNo.YES;
    const startdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (erFortsattFrilanser && frilans_sluttdato !== undefined) {
        throw new Error('getArbeidsperiodeFrilans - Jobber fortsatt som frilanser, men sluttdato er satt');
    }
    if (!erFortsattFrilanser && !sluttdato) {
        throw new Error('getArbeidsperiodeFrilans - Er ikke frilanser, men sluttdato er ikke satt');
    }

    if (dayjs(startdato).isAfter(periode.to, 'day')) {
        return undefined;
    }
    if (dayjs(sluttdato).isBefore(periode.from, 'day')) {
        return undefined;
    }

    const fromDate: Date = dayjs.max([dayjs(periode.from), dayjs(startdato)]).toDate();
    const toDate: Date = dayjs.min([dayjs(periode.to), dayjs(sluttdato)]).toDate();

    return {
        from: fromDate,
        to: toDate,
    };
};
