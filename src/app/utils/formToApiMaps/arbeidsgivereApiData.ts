import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '../../types';
import { ArbeidsgiverApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { ArbeidsforholdSluttetNårSvar, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';

export const getArbeidsgivereISøknadsperiodenApiData = (
    formData: PleiepengesøknadFormData,
    søknadsperiode: DateRange,
    søknadsdato: Date
): Pick<PleiepengesøknadApiData, 'arbeidsgivere'> => {
    const arbeidsgivere: ArbeidsgiverApiData[] = [];
    formData.ansatt_arbeidsforhold.forEach((forhold) => {
        if (
            forhold.erAnsatt === YesOrNo.YES ||
            (forhold.erAnsatt === YesOrNo.NO && forhold.sluttetNår === ArbeidsforholdSluttetNårSvar.iSøknadsperiode)
        ) {
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
                    sluttetNår:
                        forhold.erAnsatt === YesOrNo.NO ? ArbeidsforholdSluttetNårSvar.iSøknadsperiode : undefined,
                    arbeidsforhold: arbeidsforholdApiData,
                });
            } else {
                throw new Error('Invalid arbeidsforhold');
            }
        } else {
            if (forhold.sluttetNår === ArbeidsforholdSluttetNårSvar.førSøknadsperiode) {
                arbeidsgivere.push({
                    navn: forhold.navn,
                    organisasjonsnummer: forhold.organisasjonsnummer,
                    erAnsatt: false,
                    sluttetNår: ArbeidsforholdSluttetNårSvar.førSøknadsperiode,
                });
            }
        }
    });
    return {
        arbeidsgivere,
    };
};
