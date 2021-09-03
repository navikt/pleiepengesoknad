import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib';
import { ArbeidsforholdType, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

type SelvstendigArbeidsforholdApiDataPart = Pick<
    PleiepengesøknadApiData,
    'selvstendigArbeidsforhold' | 'selvstendigVirksomheter' | 'harHattInntektSomSelvstendigNæringsdrivende'
>;

export const mapSelvstendigNæringsdrivendeToApiData = (
    {
        selvstendig_arbeidsforhold,
        selvstendig_harHattInntektSomSN,
        selvstendig_harFlereVirksomheter,
        selvstendig_virksomhet,
    }: PleiepengesøknadFormData,
    locale: Locale
): SelvstendigArbeidsforholdApiDataPart => {
    const harHattInntektSomSelvstendigNæringsdrivende = selvstendig_harHattInntektSomSN === YesOrNo.YES;

    if (harHattInntektSomSelvstendigNæringsdrivende === false) {
        return {
            harHattInntektSomSelvstendigNæringsdrivende,
            selvstendigVirksomheter: [],
        };
    }

    if (!selvstendig_virksomhet) {
        throw new Error('mapSelvstendigNæringsdrivendeToApiData - virksomhet ikke registrert');
    }

    if (!selvstendig_arbeidsforhold) {
        throw new Error('mapSelvstendigNæringsdrivendeToApiData - selvstendig_arbeidsforhold er undefined');
    }

    const selvstendigArbeidsforhold = mapArbeidsforholdToApiData(
        selvstendig_arbeidsforhold,
        ArbeidsforholdType.SELVSTENDIG
    );

    return {
        harHattInntektSomSelvstendigNæringsdrivende,
        selvstendigArbeidsforhold,
        selvstendigVirksomheter: [
            mapVirksomhetToVirksomhetApiData(
                locale,
                selvstendig_virksomhet,
                selvstendig_harFlereVirksomheter === YesOrNo.YES
            ),
        ],
    };
};
