import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { SøknadApiData } from '../../types/SøknadApiData';
import { ArbeidSelvstendigSøknadsdata } from '../../types/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from '../søknadsdataToApiData/arbeidToApiDataHelpers';

type SelvstendigArbeidsforholdApiDataPart = Pick<
    SøknadApiData,
    'selvstendigNæringsdrivende' | '_harHattInntektSomSelvstendigNæringsdrivende'
>;

export const getSelvstendigNæringsdrivendeApiData = (
    arbeidSelvstendigSøknadsdata: ArbeidSelvstendigSøknadsdata | undefined,
    locale: Locale = 'nb'
): SelvstendigArbeidsforholdApiDataPart => {
    if (!arbeidSelvstendigSøknadsdata || arbeidSelvstendigSøknadsdata.type === 'erIkkeSN') {
        return { _harHattInntektSomSelvstendigNæringsdrivende: false };
    }

    const { arbeidsforhold, harFlereVirksomheter, virksomhet } = arbeidSelvstendigSøknadsdata;
    return {
        _harHattInntektSomSelvstendigNæringsdrivende: true,
        selvstendigNæringsdrivende: {
            arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidsforhold),
            virksomhet: mapVirksomhetToVirksomhetApiData(locale, virksomhet, harFlereVirksomheter),
        },
    };
};
