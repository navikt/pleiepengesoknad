import { IntlShape } from 'react-intl';
import { ValidationSummaryError } from '@sif-common/core/components/validation-error-summary-base/ValidationErrorSummaryBase';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { ArbeidsforholdApi, PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';

export const apiVedleggIsInvalid = (vedlegg: string[]): boolean => {
    vedlegg.find((v) => {
        return v === undefined;
    });
    return false;
};

const isValidVanligeTimer = (timer: number | undefined): boolean => {
    return timer !== undefined && timer >= MIN_TIMER_NORMAL_ARBEIDSFORHOLD && timer <= MAX_TIMER_NORMAL_ARBEIDSFORHOLD;
};

const skalJobbeSomVanligIsValid = (org: ArbeidsforholdApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 100;
};

const isValidRedusertProsent = (timer: number | undefined): boolean => {
    return timer !== undefined && timer > 0 && timer < 100;
};

const skalJobbeRedusertIsValid = (org: ArbeidsforholdApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && isValidRedusertProsent(skalJobbeProsent);
};

const skalJobbeVetIkkeIsValid = (org: ArbeidsforholdApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 0;
};

const skalIkkeJobbeIsValid = (org: ArbeidsforholdApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 0;
};

export const isArbeidsforholdApiValuesValid = (arbeidsforhold: ArbeidsforholdApi): boolean => {
    const { skalJobbe } = arbeidsforhold;
    switch (skalJobbe) {
        case 'ja':
            return skalJobbeSomVanligIsValid(arbeidsforhold);
        case 'redusert':
            return skalJobbeRedusertIsValid(arbeidsforhold);
        case 'vetIkke':
            return skalJobbeVetIkkeIsValid(arbeidsforhold);
        case 'nei':
            return skalIkkeJobbeIsValid(arbeidsforhold);
        default:
            return false;
    }
};

export const validateApiValues = (
    values: PleiepengesøknadApiData,
    intl: IntlShape
): ValidationSummaryError[] | undefined => {
    const errors: ValidationSummaryError[] = [];

    if (apiVedleggIsInvalid(values.vedlegg)) {
        errors.push({
            name: 'vedlegg',
            message: intlHelper(intl, 'steg.oppsummering.validering.manglerVedlegg'),
        });
    }

    const { organisasjoner = [] } = values.arbeidsgivere || {};
    if (organisasjoner.length > 0) {
        organisasjoner.forEach((arbeidsforhold) => {
            if (isArbeidsforholdApiValuesValid(arbeidsforhold) === false) {
                errors.push({
                    name: 'arbeidsforhold',
                    message: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforhold'),
                });
            }
        });
    }
    return errors.length > 0 ? errors : undefined;
};
