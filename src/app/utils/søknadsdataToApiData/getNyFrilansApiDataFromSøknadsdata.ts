import { dateToISODate, ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidNyFrilansSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';
import { FrilanserApiData } from '../../types/søknad-api-data/frilansoppdragApiData';
import { getArbeidsforholdApiDataFromSøknadsdata } from './getArbeidsforholdApiDataFromSøknadsdata';
import { ArbeidsgiverType } from '../../types';

export const dateToISODateOrUndefined = (date?: Date): ISODate | undefined => (date ? dateToISODate(date) : undefined);

export const getNyFrilansApiDataFromSøknadsdata = (
    frilansOppdragSøknadsdata: ArbeidNyFrilansSøknadsdata
): FrilanserApiData => {
    const { arbeidsgiver } = frilansOppdragSøknadsdata;

    switch (frilansOppdragSøknadsdata.type) {
        case 'utenArbeidsforhold':
            return {
                type: ArbeidsgiverType.FRILANSOPPDRAG,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
                oppdragType: frilansOppdragSøknadsdata.frilansOppdragKategori,
                styremedlemHeleInntekt: frilansOppdragSøknadsdata.styremedlemHeleInntekt,
                manuellOppføring: true,
            };
        case 'sluttetISøknadsperiode':
            return {
                type: ArbeidsgiverType.FRILANSOPPDRAG,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
                oppdragType: frilansOppdragSøknadsdata.frilansOppdragKategori,
                styremedlemHeleInntekt: frilansOppdragSøknadsdata.styremedlemHeleInntekt,
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(frilansOppdragSøknadsdata.arbeidsforhold),
                manuellOppføring: true,
            };
        case 'pågående':
            return {
                type: ArbeidsgiverType.FRILANSOPPDRAG,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
                oppdragType: frilansOppdragSøknadsdata.frilansOppdragKategori,
                styremedlemHeleInntekt: frilansOppdragSøknadsdata.styremedlemHeleInntekt,
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(frilansOppdragSøknadsdata.arbeidsforhold),
                manuellOppføring: true,
            };
    }
};
