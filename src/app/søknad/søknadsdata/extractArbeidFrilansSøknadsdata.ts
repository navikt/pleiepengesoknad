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
): ArbeidFrilansSøknadsdata | undefined => {
    const { frilans, frilansoppdrag } = formData;
    const erFrilanser = frilans.harHattInntektSomFrilanser === YesOrNo.YES || frilansoppdrag.length > 0;

    /** Er ikke frilanser */
    if (!erFrilanser) {
        return undefined;
    }

    const startdato = datepickerUtils.getDateFromDateString(frilans.startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans.sluttdato);
    const erFortsattFrilanser = frilans.jobberFortsattSomFrilans === YesOrNo.YES;
    const arbeidsforhold = frilans.arbeidsforhold
        ? extractArbeidsforholdSøknadsdata(frilans.arbeidsforhold, søknadsperiode)
        : undefined;

    /** Avsluttet frilansforhold før søknadsperiode */
    if (!arbeidsforhold && startdato && sluttdato) {
        return {
            type: 'utenforSøknadsperiode',
            erFrilanserISøknadsperiode: false,
            startdato,
            sluttdato,
        };
    }
    /** Avsluttet frilansforhold */
    if (startdato && sluttdato && (erFortsattFrilanser === false || arbeidsforhold === undefined)) {
        /** Sluttet før søknadsperiode */
        if (arbeidsforhold === undefined) {
            return {
                type: 'utenforSøknadsperiode',
                erFrilanserISøknadsperiode: false,
                startdato,
                sluttdato,
            };
        }
        /** Sluttet i søknadsperiode */
        return {
            type: 'avsluttet',
            erFrilanserISøknadsperiode: true,
            erFortsattFrilanser: false,
            startdato,
            sluttdato,
            aktivPeriode: getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato),
            arbeidsforhold,
        };
    }
    /** Er fortsatt frilanser */
    if (startdato && arbeidsforhold && erFortsattFrilanser) {
        return {
            type: 'pågående',
            erFrilanserISøknadsperiode: true,
            erFortsattFrilanser,
            startdato,
            aktivPeriode: getPeriodeSomFrilanserInnenforSøknadsperiode(søknadsperiode, startdato, sluttdato),
            arbeidsforhold,
        };
    }
    /** Noe gikk galt */
    return undefined;
};
