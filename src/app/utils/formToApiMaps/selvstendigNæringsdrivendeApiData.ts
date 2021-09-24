import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { ArbeidsforholdType } from '../../types';
import { PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type SelvstendigArbeidsforholdApiDataPart = Pick<
    PleiepengesøknadApiData,
    'selvstendigNæringsdrivende' | 'harHattInntektSomSelvstendigNæringsdrivende'
>;

export const getSelvstendigNæringsdrivendeApiData = (
    {
        selvstendig_arbeidsforhold,
        selvstendig_harHattInntektSomSN,
        selvstendig_harFlereVirksomheter,
        selvstendig_virksomhet,
    }: PleiepengesøknadFormData,
    søknadsperiode: DateRange,
    locale: Locale
): SelvstendigArbeidsforholdApiDataPart => {
    const harHattInntektSomSelvstendigNæringsdrivende = selvstendig_harHattInntektSomSN === YesOrNo.YES;

    if (harHattInntektSomSelvstendigNæringsdrivende === false) {
        return {
            harHattInntektSomSelvstendigNæringsdrivende,
        };
    }

    if (!selvstendig_virksomhet) {
        throw new Error('mapSelvstendigNæringsdrivendeToApiData - virksomhet ikke registrert');
    }

    if (!selvstendig_arbeidsforhold) {
        throw new Error('mapSelvstendigNæringsdrivendeToApiData - selvstendig_arbeidsforhold er undefined');
    }

    return {
        harHattInntektSomSelvstendigNæringsdrivende,
        selvstendigNæringsdrivende: {
            arbeidsforhold: mapArbeidsforholdToApiData(
                selvstendig_arbeidsforhold,
                søknadsperiode,
                ArbeidsforholdType.SELVSTENDIG
            ),
            virksomhet: mapVirksomhetToVirksomhetApiData(
                locale,
                selvstendig_virksomhet,
                selvstendig_harFlereVirksomheter === YesOrNo.YES
            ),
        },
    };
};
