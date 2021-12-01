import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { ArbeidsforholdType } from '../../types';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type SelvstendigArbeidsforholdApiDataPart = Pick<
    SøknadApiData,
    'selvstendigNæringsdrivende' | '_harHattInntektSomSelvstendigNæringsdrivende'
>;

export const getSelvstendigNæringsdrivendeApiData = (
    {
        selvstendig_arbeidsforhold,
        selvstendig_harHattInntektSomSN,
        selvstendig_harFlereVirksomheter,
        selvstendig_virksomhet,
    }: SøknadFormData,
    søknadsperiode: DateRange,
    søknadsdato: Date,
    locale: Locale
): SelvstendigArbeidsforholdApiDataPart => {
    const _harHattInntektSomSelvstendigNæringsdrivende = selvstendig_harHattInntektSomSN === YesOrNo.YES;

    if (
        _harHattInntektSomSelvstendigNæringsdrivende === false ||
        !selvstendig_virksomhet ||
        !selvstendig_arbeidsforhold
    ) {
        return {
            _harHattInntektSomSelvstendigNæringsdrivende,
        };
    }

    return {
        _harHattInntektSomSelvstendigNæringsdrivende,
        selvstendigNæringsdrivende: {
            arbeidsforhold: mapArbeidsforholdToApiData(
                selvstendig_arbeidsforhold,
                søknadsperiode,
                ArbeidsforholdType.SELVSTENDIG,
                søknadsdato
            ),
            virksomhet: mapVirksomhetToVirksomhetApiData(
                locale,
                selvstendig_virksomhet,
                selvstendig_harFlereVirksomheter === YesOrNo.YES
            ),
        },
    };
};
