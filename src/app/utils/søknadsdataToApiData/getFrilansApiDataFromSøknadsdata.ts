import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { FrilansApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from './arbeidToApiDataHelpers';

export const getFrilansApiDataFromSøknadsdata = (
    arbeidFrilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined
): FrilansApiData => {
    if (!arbeidFrilansSøknadsdata || arbeidFrilansSøknadsdata.type === 'erIkkeFrilanser') {
        return {
            harInntektSomFrilanser: false,
        };
    }
    switch (arbeidFrilansSøknadsdata.type) {
        case 'pågående':
            return {
                harInntektSomFrilanser: true,
                erFortsattFrilanser: true,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidFrilansSøknadsdata.arbeidsforhold),
            };
        case 'avsluttetISøknadsperiode':
            return {
                harInntektSomFrilanser: true,
                erFortsattFrilanser: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidFrilansSøknadsdata.arbeidsforhold),
            };
        case 'avsluttetFørSøknadsperiode':
            return {
                harInntektSomFrilanser: false,
                erFortsattFrilanser: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
            };
    }
};
