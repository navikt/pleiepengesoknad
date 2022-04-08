import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { SelvstendigApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidSelvstendigSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from './arbeidToApiDataHelpers';

export const getSelvstendigApiDataFromSøknadsdata = (
    arbeidSelvstendigSøknadsdata?: ArbeidSelvstendigSøknadsdata,
    locale: Locale = 'nb'
): SelvstendigApiData => {
    if (!arbeidSelvstendigSøknadsdata) {
        return { harInntektSomSelvstendig: false };
    }
    switch (arbeidSelvstendigSøknadsdata.type) {
        case 'erIkkeSN':
            return {
                harInntektSomSelvstendig: false,
            };
        case 'erSN':
            const { arbeidsforhold, harFlereVirksomheter, virksomhet } = arbeidSelvstendigSøknadsdata;
            return {
                harInntektSomSelvstendig: true,
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidsforhold),
                virksomhet: mapVirksomhetToVirksomhetApiData(locale, virksomhet, harFlereVirksomheter),
            };
    }
};
