import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { SelvstendigApiData } from '../../types/SøknadApiData';
import { ArbeidSelvstendigSøknadsdata } from '../../types/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from './arbeidToApiDataHelpers';

export const getSelvstendigApiDataFromSøknadsdata = (
    arbeidSelvstendigSøknadsdata: ArbeidSelvstendigSøknadsdata,
    locale: Locale = 'nb'
): SelvstendigApiData | undefined => {
    switch (arbeidSelvstendigSøknadsdata.type) {
        case 'erIkkeSN':
            return undefined;
        case 'erSN':
            const { arbeidsforhold, harFlereVirksomheter, virksomhet } = arbeidSelvstendigSøknadsdata;
            return {
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidsforhold),
                virksomhet: mapVirksomhetToVirksomhetApiData(locale, virksomhet, harFlereVirksomheter),
            };
    }
};
