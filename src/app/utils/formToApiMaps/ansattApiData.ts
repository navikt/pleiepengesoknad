import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '../../types';
import { ArbeidsforholdAnsattApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export const getAnsattApiData = (
    formData: PleiepengesøknadFormData,
    søknadsperiode: DateRange
): ArbeidsforholdAnsattApiData[] => {
    const arbeidsforhold: ArbeidsforholdAnsattApiData[] = [];
    formData.ansatt_arbeidsforhold.forEach((forhold) => {
        const arbeidsforholdApiData = mapArbeidsforholdToApiData(forhold, søknadsperiode, ArbeidsforholdType.ANSATT);
        if (arbeidsforholdApiData) {
            arbeidsforhold.push({
                ...arbeidsforholdApiData,
                _type: ArbeidsforholdType.ANSATT,
                navn: forhold.navn,
                organisasjonsnummer: forhold.organisasjonsnummer,
                erAktivtArbeidsforhold: forhold.erAnsatt === YesOrNo.YES,
            });
        } else {
            throw new Error('Invalid arbeidsforhold');
        }
    });
    return arbeidsforhold;
};
