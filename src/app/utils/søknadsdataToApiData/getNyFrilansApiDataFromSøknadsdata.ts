import { dateToISODate, ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidNyFrilansSøknadsdata } from '../../types/søknadsdata/arbeidNyFrilansSøknadsdata';
import { FrilanserApiData } from '../../types/søknad-api-data/frilansOppdragApiData';
import { getArbeidsforholdApiDataFromSøknadsdata } from './getArbeidsforholdApiDataFromSøknadsdata';

export const dateToISODateOrUndefined = (date?: Date): ISODate | undefined => (date ? dateToISODate(date) : undefined);

export const getNyFrilansApiDataFromSøknadsdata = (
    frilansOppdragSøknadsdata: ArbeidNyFrilansSøknadsdata
): FrilanserApiData => {
    const { arbeidsgiver } = frilansOppdragSøknadsdata;

    switch (frilansOppdragSøknadsdata.type) {
        case 'utenArbeidsforhold':
            return {
                type: arbeidsgiver.type,
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
                type: arbeidsgiver.type,
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
                type: arbeidsgiver.type,
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
