import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsgiverApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidAnsattSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata, dateToISODateOrUndefined } from './arbeidToApiDataHelpers';

export const getArbeidsgiverApiDataFromSøknadsdata = (
    ansattSøknadsdata: ArbeidAnsattSøknadsdata,
    søknadsperiode: DateRange
): ArbeidsgiverApiData => {
    const { arbeidsgiver } = ansattSøknadsdata;

    if (ansattSøknadsdata.erAnsattISøknadsperiode) {
        const { arbeidsgiver, arbeidsforhold } = ansattSøknadsdata;
        return {
            erAnsatt: true,
            type: arbeidsgiver.type,
            navn: arbeidsgiver.navn,
            offentligIdent: arbeidsgiver.offentligIdent,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
            ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
            sluttetFørSøknadsperiode: false,
            arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidsforhold, søknadsperiode),
        };
    }
    return {
        erAnsatt: false,
        type: arbeidsgiver.type,
        navn: arbeidsgiver.navn,
        offentligIdent: arbeidsgiver.offentligIdent,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        ansattFom: dateToISODateOrUndefined(arbeidsgiver.ansattFom),
        ansattTom: dateToISODateOrUndefined(arbeidsgiver.ansattTom),
        sluttetFørSøknadsperiode: true,
    };
};
