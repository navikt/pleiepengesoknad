import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../types';
import {
    ArbeidIPeriode,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    SøknadFormData,
} from '../../types/SøknadFormData';
import { getPeriodeSomFrilanserInneforPeriode } from '../../utils/frilanserUtils';
// import { skalViseSpørsmålOmProsentEllerLiktHverUke, } from '../../utils/tidsbrukUtils';

dayjs.extend(minMax);

const cleanupArbeidIPeriode = (periode: DateRange, arbeidIPerioden: ArbeidIPeriode): ArbeidIPeriode => {
    const arbeid: ArbeidIPeriode = {
        jobberIPerioden: arbeidIPerioden.jobberIPerioden,
    };

    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return arbeid;
    }

    const { erLiktHverUke, enkeltdager, timerEllerProsent, fasteDager, skalJobbeProsent } = arbeidIPerioden;

    if (erLiktHverUke === YesOrNo.YES) {
        arbeid.erLiktHverUke = erLiktHverUke;
        arbeid.timerEllerProsent = timerEllerProsent;
        return timerEllerProsent === TimerEllerProsent.PROSENT
            ? { ...arbeid, skalJobbeProsent }
            : { ...arbeid, fasteDager };
    }

    return { ...arbeid, erLiktHverUke, enkeltdager };
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
    const frilansPeriodeISøknadsperiode = getPeriodeSomFrilanserInneforPeriode(periode, {
        frilans_sluttdato,
        frilans_startdato,
        frilans_jobberFortsattSomFrilans,
    });

    const arbeidsforhold: ArbeidsforholdSNF = cleanupArbeidsforhold(
        frilans_arbeidsforhold,
        frilansPeriodeISøknadsperiode || periode,
        erHistorisk
    ) as ArbeidsforholdSNF;

    /** Frilanser er ikke frilanser i søknadsperioden før dagens dato */
    if (frilansPeriodeISøknadsperiode === undefined && erHistorisk) {
        arbeidsforhold.historisk = {
            jobberIPerioden: JobberIPeriodeSvar.NEI,
        };
    }
    /** Frilanser er ikke frilanser i søknadsperioden fom dagens dato */
    if (frilansPeriodeISøknadsperiode === undefined && erHistorisk === false) {
        arbeidsforhold.planlagt = {
            jobberIPerioden: JobberIPeriodeSvar.NEI,
        };
    }
    return arbeidsforhold;
};

export const cleanupArbeidIPeriodeStep = (
    formData: SøknadFormData,
    periode: DateRange,
    erHistorisk: boolean
): SøknadFormData => {
    const values: SøknadFormData = { ...formData };
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
