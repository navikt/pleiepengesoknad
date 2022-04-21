import { DateRange } from '@navikt/sif-common-formik/lib';
import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { FrilansApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from './arbeidToApiDataHelpers';

export const getFrilansApiDataFromSøknadsdata = (
    arbeidFrilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined,
    søknadsperiode: DateRange
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
                jobberFortsattSomFrilans: true,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(
                    arbeidFrilansSøknadsdata.arbeidsforhold,
                    søknadsperiode
                ),
            };
        case 'avsluttetISøknadsperiode':
            return {
                harInntektSomFrilanser: true,
                jobberFortsattSomFrilans: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(
                    arbeidFrilansSøknadsdata.arbeidsforhold,
                    søknadsperiode
                ),
            };
        case 'avsluttetFørSøknadsperiode':
            return {
                harInntektSomFrilanser: false,
                jobberFortsattSomFrilans: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
            };
    }
};
