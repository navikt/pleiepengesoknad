import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '../../../../types';
import { IntlShape } from 'react-intl';
import { ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';

export const getArbeidsformOgTidSetning = (
    intl: IntlShape,
    arbeidsforhold: ArbeidsforholdApiData,
    erAnsatt?: boolean
): string | undefined => {
    const isAbeidstaker = arbeidsforhold._type === ArbeidsforholdType.ANSATT;
    if ((!isAbeidstaker && !arbeidsforhold.arbeidsform) || !arbeidsforhold.jobberNormaltTimer) {
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
