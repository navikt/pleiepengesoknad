import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { IntlShape } from 'react-intl';
import { ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';

export const getArbeidsformOgTidSetning = (
    intl: IntlShape,
    arbeidsforhold: ArbeidsforholdApiData,
    erAktivt?: boolean
) => {
    return intlHelper(
        intl,
        erAktivt
            ? `oppsummering.arbeidssituasjon.tid.${arbeidsforhold.arbeidsform}`
            : `oppsummering.arbeidssituasjon.avsluttet.tid.${arbeidsforhold.arbeidsform}`,
        { timer: arbeidsforhold.jobberNormaltTimer }
    );
};