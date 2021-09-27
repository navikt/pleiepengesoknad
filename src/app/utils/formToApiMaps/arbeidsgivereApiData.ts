import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '../../types';
import { ArbeidsgiverApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export const getArbeidsgivereApiData = (
    formData: PleiepengesøknadFormData,
    søknadsperiode: DateRange
): Pick<PleiepengesøknadApiData, 'arbeidsgivere'> => {
    const arbeidsforhold: ArbeidsgiverApiData[] = [];
    formData.ansatt_arbeidsforhold.forEach((forhold) => {
        const arbeidsforholdApiData = mapArbeidsforholdToApiData(forhold, søknadsperiode, ArbeidsforholdType.ANSATT);
        if (arbeidsforholdApiData) {
            arbeidsforhold.push({
                navn: forhold.navn,
                organisasjonsnummer: forhold.organisasjonsnummer,
                erAnsatt: forhold.erAnsatt === YesOrNo.YES,
                arbeidsforhold: arbeidsforholdApiData,
            });
        } else {
            throw new Error('Invalid arbeidsforhold');
        }
    });
    return {
        arbeidsgivere: arbeidsforhold,
    };
};
