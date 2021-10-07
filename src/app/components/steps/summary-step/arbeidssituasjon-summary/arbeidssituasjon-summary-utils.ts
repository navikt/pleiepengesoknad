import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';

export const getArbeidsformOgTidSetning = (
    intl: IntlShape,
    arbeidsforhold: ArbeidsforholdApiData,
    erAnsatt?: boolean
): string | undefined => {
    if (!arbeidsforhold.arbeidsform || !arbeidsforhold.jobberNormaltTimer) {
        return undefined;
    }
    return intlHelper(
        intl,
        erAnsatt
            ? `oppsummering.arbeidssituasjon.tid.${arbeidsforhold.arbeidsform}`
            : `oppsummering.arbeidssituasjon.avsluttet.tid.${arbeidsforhold.arbeidsform}`,
        { timer: arbeidsforhold.jobberNormaltTimer }
    );
};
