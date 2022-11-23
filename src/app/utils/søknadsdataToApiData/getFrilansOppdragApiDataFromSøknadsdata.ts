import { dateToISODate, ISODate } from '@navikt/sif-common-utils/lib';
import { FrilanserApiData, FrilansoppdragIPeriodenApi } from '../../types/søknad-api-data/frilansoppdragApiDat';
import { ArbeidFrilansOppdragSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from './getArbeidsforholdApiDataFromSøknadsdata';

export const dateToISODateOrUndefined = (date?: Date): ISODate | undefined => (date ? dateToISODate(date) : undefined);

export const getFrilansOppdragApiDataFromSøknadsdata = (
    frilansOppdragSøknadsdata: ArbeidFrilansOppdragSøknadsdata
): FrilanserApiData => {
    const { arbeidsgiver } = frilansOppdragSøknadsdata;

    switch (frilansOppdragSøknadsdata.type) {
        case 'sluttetFørSøknadsperiode':
            return {
                type: arbeidsgiver.type,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
                harOppdragIPerioden: FrilansoppdragIPeriodenApi.NEI,
                manuellOppføring: false,
            };
        case 'utenArbeidsforhold':
            return {
                type: arbeidsgiver.type,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
                harOppdragIPerioden: frilansOppdragSøknadsdata.harOppdragIPerioden,
                oppdragType: frilansOppdragSøknadsdata.frilansoppdragKategori,
                styremedlemHeleInntekt: frilansOppdragSøknadsdata.styremedlemHeleInntekt,
                manuellOppføring: false,
            };
        case 'sluttetISøknadsperiode':
            return {
                type: arbeidsgiver.type,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(frilansOppdragSøknadsdata.aktivPeriode.to),
                harOppdragIPerioden: frilansOppdragSøknadsdata.harOppdragIPerioden,
                oppdragType: frilansOppdragSøknadsdata.frilansoppdragKategori,
                styremedlemHeleInntekt: frilansOppdragSøknadsdata.styremedlemHeleInntekt,
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(frilansOppdragSøknadsdata.arbeidsforhold),
                manuellOppføring: false,
            };
        case 'pågående':
            return {
                type: arbeidsgiver.type,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
                ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
                harOppdragIPerioden: frilansOppdragSøknadsdata.harOppdragIPerioden,
                oppdragType: frilansOppdragSøknadsdata.frilansoppdragKategori,
                styremedlemHeleInntekt: frilansOppdragSøknadsdata.styremedlemHeleInntekt,
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(frilansOppdragSøknadsdata.arbeidsforhold),
                manuellOppføring: false,
            };
    }
};
