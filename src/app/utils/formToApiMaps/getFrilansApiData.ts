import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { FrilansApiData, SøknadApiData } from '../../types/SøknadApiData';
import { FrilansFormDataPart } from '../../types/SøknadFormData';
import { erFrilanserITidsrom } from '../frilanserUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export type FrilansApiDataPart = Pick<SøknadApiData, 'frilans' | '_harHattInntektSomFrilanser'>;

// const mapArbeidsforholdFrilansoppdrag = (
//     arbeidsforhold: Arbeidsforhold[],
//     søknadsperiode: DateRange
// ): ArbeidsgiverApiData[] => {
//     const oppdragApiData: ArbeidsgiverApiData[] = [];

//     arbeidsforhold.forEach((forhold) => {
//         const { arbeidsgiver } = forhold;
//         const arbeidsgiverInfo: ArbeidsgiverInfoApiData = {
//             type: arbeidsgiver.type,
//             navn: arbeidsgiver.navn,
//             organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
//             offentligIdent: arbeidsgiver.offentligIdent,
//             ansattFom: arbeidsgiver.ansattFom ? dateToISODate(arbeidsgiver.ansattFom) : undefined,
//             ansattTom: arbeidsgiver.ansattTom ? dateToISODate(arbeidsgiver.ansattTom) : undefined,
//         };
//         if (erAnsattHosArbeidsgiverISøknadsperiode(forhold)) {
//             const arbeidsforholdApiData = mapArbeidsforholdToApiData(
//                 forhold,
//                 søknadsperiode,
//                 ArbeidsforholdType.ANSATT
//             );
//             if (arbeidsforholdApiData) {
//                 oppdragApiData.push({
//                     ...arbeidsgiverInfo,
//                     erAnsatt: forhold.erAnsatt === YesOrNo.YES,
//                     sluttetFørSøknadsperiode: forhold.erAnsatt === YesOrNo.NO ? false : undefined,
//                     arbeidsforhold: arbeidsforholdApiData,
//                 });
//             } else {
//                 throw new Error('Invalid arbeidsforhold');
//             }
//         } else {
//             if (forhold.sluttetFørSøknadsperiode === YesOrNo.YES) {
//                 oppdragApiData.push({
//                     ...arbeidsgiverInfo,
//                     erAnsatt: false,
//                     sluttetFørSøknadsperiode: true,
//                 });
//             }
//         }
//     });
//     return oppdragApiData;
// };

export const getFrilansApiData = (formData: FrilansFormDataPart, søknadsperiode: DateRange): FrilansApiDataPart => {
    const { harHattInntektSomFrilanser, jobberFortsattSomFrilans, startdato, sluttdato } = formData;
    const _harHattInntektSomFrilanser = harHattInntektSomFrilanser === YesOrNo.YES;
    const from = datepickerUtils.getDateFromDateString(startdato);
    const to = datepickerUtils.getDateFromDateString(sluttdato);

    if (
        _harHattInntektSomFrilanser === false ||
        startdato === undefined ||
        from === undefined ||
        erFrilanserITidsrom(søknadsperiode, { frilansStartdato: from, frilansSluttdato: to }) === false
    ) {
        return {
            _harHattInntektSomFrilanser: false,
        };
    }

    const arbeidsforholdApiData = formData.arbeidsforhold
        ? mapArbeidsforholdToApiData(formData.arbeidsforhold, søknadsperiode)
        : undefined;

    const frilansApiData: FrilansApiData = {
        startdato: startdato,
        jobberFortsattSomFrilans: jobberFortsattSomFrilans === YesOrNo.YES,
        sluttdato: sluttdato,
        arbeidsforhold: arbeidsforholdApiData,
    };

    return {
        _harHattInntektSomFrilanser,
        frilans: frilansApiData,
    };
};
