import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { SelvstendigFormData } from '../../types/SelvstendigFormData';
import { SøknadApiData } from '../../types/SøknadApiData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type SelvstendigArbeidsforholdApiDataPart = Pick<
    SøknadApiData,
    'selvstendigNæringsdrivende' | '_harHattInntektSomSelvstendigNæringsdrivende'
>;

export const getSelvstendigNæringsdrivendeApiData = (
    { arbeidsforhold, harHattInntektSomSN, harFlereVirksomheter, virksomhet }: SelvstendigFormData,
    søknadsperiode: DateRange,
    locale: Locale
): SelvstendigArbeidsforholdApiDataPart => {
    const _harHattInntektSomSelvstendigNæringsdrivende = harHattInntektSomSN === YesOrNo.YES;

    if (_harHattInntektSomSelvstendigNæringsdrivende === false || !virksomhet || !arbeidsforhold) {
        return {
            _harHattInntektSomSelvstendigNæringsdrivende,
        };
    }

    return {
        _harHattInntektSomSelvstendigNæringsdrivende,
        selvstendigNæringsdrivende: {
            arbeidsforhold: mapArbeidsforholdToApiData(arbeidsforhold, søknadsperiode),
            virksomhet: mapVirksomhetToVirksomhetApiData(locale, virksomhet, harFlereVirksomheter === YesOrNo.YES),
        },
    };
};
