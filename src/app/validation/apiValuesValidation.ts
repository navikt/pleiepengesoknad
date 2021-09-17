import { IntlShape } from 'react-intl';
import { ValidationSummaryError } from '@navikt/sif-common-core/lib/components/validation-error-summary-base/ValidationErrorSummaryBase';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { ArbeidsforholdAnsattApi, PleiepengesøknadApiData, SkalJobbe } from '../types/PleiepengesøknadApiData';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';

export const apiVedleggIsInvalid = (vedlegg: string[]): boolean => {
    vedlegg.find((v) => {
        return v === undefined;
    });
    return false;
};

const isValidVanligeTimer = (timer: number | undefined): boolean => {
    return timer !== undefined && timer >= MIN_TIMER_NORMAL_ARBEIDSFORHOLD && timer <= MAX_TIMER_NORMAL_ARBEIDSFORHOLD;
};

const isValidRedusertProsent = (timer: number | undefined): boolean => {
    return timer !== undefined && timer > 0 && timer < 100;
};

const skalJobbeSomVanligIsValid = (org: ArbeidsforholdAnsattApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 100;
};

const skalJobbeRedusertIsValid = (org: ArbeidsforholdAnsattApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && isValidRedusertProsent(skalJobbeProsent);
};

const skalJobbeVetIkkeIsValid = (org: ArbeidsforholdAnsattApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 0;
};

const skalIkkeJobbeIsValid = (org: ArbeidsforholdAnsattApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 0;
};

export const isArbeidsforholdApiValuesValid = (arbeidsforhold: ArbeidsforholdAnsattApi): boolean => {
    const { skalJobbe } = arbeidsforhold;
    switch (skalJobbe) {
        case SkalJobbe.JA:
            return skalJobbeSomVanligIsValid(arbeidsforhold);
        case SkalJobbe.REDUSERT:
            return skalJobbeRedusertIsValid(arbeidsforhold);
        case SkalJobbe.VET_IKKE:
            return skalJobbeVetIkkeIsValid(arbeidsforhold);
        case SkalJobbe.NEI:
            return skalIkkeJobbeIsValid(arbeidsforhold);
        default:
            return false;
    }
};

export const isVirksomhetRegnskapsførerTelefonnummerValid = (virksomhet: VirksomhetApiData) => {
    const { regnskapsfører } = virksomhet;
    if (regnskapsfører) {
        return /^[\w+\s()]+$/.test(regnskapsfører.telefon);
    }
    return true;
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

    if (values.selvstendigVirksomheter.length === 1) {
        const virksomhet = values.selvstendigVirksomheter[0];
        if (isVirksomhetRegnskapsførerTelefonnummerValid(virksomhet) === false) {
            errors.push({
                name: 'virksomhet',
                message: intlHelper(intl, 'steg.oppsummering.validering.ugyldigRegnskapsførerTelefonnummer'),
            });
        }
    }
    return errors.length > 0 ? errors : undefined;
};
