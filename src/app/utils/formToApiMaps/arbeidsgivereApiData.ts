import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '../../types';
import { ArbeidsgiverApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../ansattUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export const getArbeidsgivereISøknadsperiodenApiData = (
    formData: PleiepengesøknadFormData,
    søknadsperiode: DateRange,
    søknadsdato: Date
): Pick<PleiepengesøknadApiData, 'arbeidsgivere'> => {
    const arbeidsgivere: ArbeidsgiverApiData[] = [];
    formData.ansatt_arbeidsforhold.forEach((forhold) => {
        if (erAnsattHosArbeidsgiverISøknadsperiode(forhold)) {
            const arbeidsforholdApiData = mapArbeidsforholdToApiData(
                forhold,
                søknadsperiode,
                ArbeidsforholdType.ANSATT,
                søknadsdato
            );
            if (arbeidsforholdApiData) {
                arbeidsgivere.push({
                    navn: forhold.navn,
                    organisasjonsnummer: forhold.organisasjonsnummer,
                    erAnsatt: forhold.erAnsatt === YesOrNo.YES,
                    sluttetFørSøknadsperiode: forhold.erAnsatt === YesOrNo.NO ? false : undefined,
                    arbeidsforhold: arbeidsforholdApiData,
                });
            } else {
                throw new Error('Invalid arbeidsforhold');
            }
        } else {
            if (forhold.sluttetFørSøknadsperiode === YesOrNo.YES) {
                arbeidsgivere.push({
                    navn: forhold.navn,
                    organisasjonsnummer: forhold.organisasjonsnummer,
                    erAnsatt: false,
                    sluttetFørSøknadsperiode: true,
                });
            }
        }
    });
    return {
        arbeidsgivere,
    };
};
