import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { SøknadFormData } from '../../types/SøknadFormData';
import { ArbeidFrilansSøknadsdata } from '../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from './extractArbeidsforholdSøknadsdata';

const getPeriodeSomFrilanserInnenforSøknadsperiode = (
    søknadsperiode: DateRange,
    startdato: Date,
    sluttdato?: Date
): DateRange => {
    const fromDate: Date = dayjs.max([dayjs(søknadsperiode.from), dayjs(startdato)]).toDate();
    const toDate: Date = sluttdato
        ? dayjs.min([dayjs(søknadsperiode.to), dayjs(sluttdato)]).toDate()
        : søknadsperiode.to;

    return {
        from: fromDate,
        to: toDate,
    };
};

export const extractArbeidFrilansSøknadsdata = (
    formData: SøknadFormData,
    søknadsperiode: DateRange
): ArbeidFrilansSøknadsdata => {
    const { frilans, frilansoppdrag } = formData;
    const erFrilanser = frilans.harHattInntektSomFrilanser === YesOrNo.YES || frilansoppdrag.length > 0;

    /** Er ikke frilanser */
    if (!erFrilanser) {
        return {
            type: 'erIkkeFrilanser',
            erFrilanser: false,
        };
    }

    const startdato = datepickerUtils.getDateFromDateString(frilans.startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans.sluttdato);
    const erFortsattFrilanser = frilans.jobberFortsattSomFrilans === YesOrNo.YES;
    const arbeidsforhold = frilans.arbeidsforhold
        ? extractArbeidsforholdSøknadsdata(frilans.arbeidsforhold, søknadsperiode)
        : undefined;

    /** Er ikke lenger frilanser */
    if (startdato && sluttdato && !erFortsattFrilanser) {
        /** Sluttet før søknadsperiode */
        if (!arbeidsforhold) {
            return {
                type: 'avsluttetFørSøknadsperiode',
                erFrilanser: true,
                harInntektISøknadsperiode: false,
                erFortsattFrilanser: false,
                startdato,
                sluttdato,
            };
        }
        /** Sluttet i søknadsperiode */
        return {
            type: 'avsluttetISøknadsperiode',
            erFrilanser: true,
            aktivPeriode: getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato),
            harInntektISøknadsperiode: true,
            erFortsattFrilanser: false,
            startdato,
            sluttdato,
            arbeidsforhold,
        };
    }

    if (erFortsattFrilanser && arbeidsforhold && startdato) {
        /** Er fortsatt frilanser */
        return {
            type: 'pågående',
            erFrilanser: true,
            harInntektISøknadsperiode: true,
            erFortsattFrilanser: true,
            startdato,
            aktivPeriode: getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato),
            arbeidsforhold,
        };
    }
    throw 'extractArbeidFrilansSøknadsdata: ugyldig tilstand';
};
