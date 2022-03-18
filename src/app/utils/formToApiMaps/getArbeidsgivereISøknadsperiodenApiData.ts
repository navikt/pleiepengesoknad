import { dateToISODate } from '@navikt/sif-common-utils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
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
        const { arbeidsgiver } = forhold;
        const arbeidsgiverInfo: Omit<ArbeidsgiverApiData, 'erAnsatt' | 'sluttetFørSøknadsperiode' | 'arbeidsforhold'> =
            {
                type: arbeidsgiver.type,
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                offentligIdent: arbeidsgiver.offentligIdent,
                ansattFom: arbeidsgiver.ansattFom ? dateToISODate(arbeidsgiver.ansattFom) : undefined,
                ansattTom: arbeidsgiver.ansattTom ? dateToISODate(arbeidsgiver.ansattTom) : undefined,
            };
        if (erAnsattHosArbeidsgiverISøknadsperiode(forhold)) {
            const arbeidsforholdApiData = mapArbeidsforholdToApiData(forhold, søknadsperiode);
            if (arbeidsforholdApiData) {
                arbeidsgivere.push({
                    ...arbeidsgiverInfo,
                    erAnsatt: forhold.erAnsatt === YesOrNo.YES,
                    sluttetFørSøknadsperiode: forhold.erAnsatt === YesOrNo.NO ? false : undefined,
                    arbeidsforhold: arbeidsforholdApiData,
                });
            } else {
                throw new Error('Invalid arbeidsforhold');
            }
        } else {
            if (forhold.sluttetFørSøknadsperiode === YesOrNo.YES) {
                if (!arbeidsgiverInfo.navn) {
                    appSentryLogger.logError(
                        'Manglende navn på arbeidsgiver hvor en sluttet før søknadsperiode',
                        JSON.stringify({ ...forhold })
                    );
                }
                arbeidsgivere.push({
                    ...arbeidsgiverInfo,
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
