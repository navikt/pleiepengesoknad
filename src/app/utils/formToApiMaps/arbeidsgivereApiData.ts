import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { ArbeidsgiverApiData, SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../ansattUtils';
import { mapArbeidsforholdToApiData } from './mapArbeidsforholdToApiData';
import appSentryLogger from '../../utils/appSentryLogger';

export const getArbeidsgivereISøknadsperiodenApiData = (
    formData: SøknadFormData,
    søknadsperiode: DateRange
): Pick<SøknadApiData, 'arbeidsgivere'> => {
    const arbeidsgivere: ArbeidsgiverApiData[] = [];
    formData.ansatt_arbeidsforhold.forEach((forhold) => {
        if (erAnsattHosArbeidsgiverISøknadsperiode(forhold)) {
            const arbeidsforholdApiData = mapArbeidsforholdToApiData(
                forhold,
                søknadsperiode,
                ArbeidsforholdType.ANSATT
            );
            if (!forhold.navn) {
                appSentryLogger.logError(
                    'Manglende navn på arbeidsgiver hvor en jobber',
                    JSON.stringify({ ...forhold })
                );
            }
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
                appSentryLogger.logError(
                    'Manglende navn på arbeidsgiver hvor en sluttet før søknadsperiode',
                    JSON.stringify({ ...forhold })
                );
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
