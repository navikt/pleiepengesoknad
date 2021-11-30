import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';

export const getTidSetning = (
    intl: IntlShape,
    arbeidsforhold: ArbeidsforholdApiData,
    erAnsatt?: boolean
): string | undefined => {
    if (!arbeidsforhold.jobberNormaltTimer) {
        return undefined;
    }

    return intlHelper(
        intl,
        erAnsatt ? `oppsummering.arbeidssituasjon.tid` : `oppsummering.arbeidssituasjon.avsluttet.tid`,
        { timer: arbeidsforhold.jobberNormaltTimer }
    );
};
