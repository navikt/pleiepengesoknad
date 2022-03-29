// import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
// import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
// import { SelvstendigApiData } from '../../types/SøknadApiData';
// import { ArbeidSelvstendigSøknadsdata } from '../../types/Søknadsdata';
// import { getArbeidsforholdApiDataFromSøknadsdata } from '../søknadsdataToApiData/arbeidToApiDataHelpers';

// export const getSelvstendigNæringsdrivendeApiData = (
//     arbeidSelvstendigSøknadsdata: ArbeidSelvstendigSøknadsdata | undefined,
//     locale: Locale = 'nb'
// ): SelvstendigApiData => {
//     if (!arbeidSelvstendigSøknadsdata || arbeidSelvstendigSøknadsdata.type === 'erIkkeSN') {
//         return { harInntektSomSelvstendig: false };
//     }

//     const { arbeidsforhold, harFlereVirksomheter, virksomhet } = arbeidSelvstendigSøknadsdata;
//     return {
//         harInntektSomSelvstendig: true,
//         arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(arbeidsforhold),
//         virksomhet: mapVirksomhetToVirksomhetApiData(locale, virksomhet, harFlereVirksomheter),
//     };
// };
