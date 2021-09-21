import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { StepID } from '../config/stepConfig';
import { ArbeidsforholdApi, PleiepengesøknadApiData, SkalJobbe } from '../types/PleiepengesøknadApiData';

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

const skalJobbeSomVanligIsValid = (org: ArbeidsforholdApi) => {
    const { jobberNormaltTimer, skalJobbeProsent } = org;
    return isValidVanligeTimer(jobberNormaltTimer) && skalJobbeProsent === 100;
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

export interface ApiValidationError extends FeiloppsummeringFeil {
    stepId: StepID;
}
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
): ApiValidationError[] | undefined => {
    const errors: ApiValidationError[] = [];

    if (apiVedleggIsInvalid(values.vedlegg)) {
        errors.push({
            skjemaelementId: 'vedlegg',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.manglerVedlegg'),
            stepId: StepID.LEGEERKLÆRING,
        });
    }

    const { organisasjoner = [] } = values.arbeidsgivere || {};
    if (organisasjoner.length > 0) {
        organisasjoner.forEach((arbeidsforhold) => {
            if (isArbeidsforholdApiValuesValid(arbeidsforhold) === false) {
                errors.push({
                    skjemaelementId: 'arbeidsforhold',
                    feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforhold'),
                    stepId: StepID.ARBEIDSSITUASJON,
                });
            }
        });
    }

    if (
        values.frilans &&
        (values.frilans.arbeidsforhold === undefined ||
            (values.frilans?.arbeidsforhold && isArbeidsforholdApiValuesValid(values.frilans.arbeidsforhold) === false))
    ) {
        errors.push({
            skjemaelementId: 'arbeidsforholdFrilans',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdFrilans'),
            stepId: StepID.ARBEIDSSITUASJON,
        });
    }

    if (
        (values.selvstendigArbeidsforhold === undefined && values.selvstendigVirksomheter.length > 0) ||
        (values.selvstendigArbeidsforhold && isArbeidsforholdApiValuesValid(values.selvstendigArbeidsforhold) === false)
    ) {
        errors.push({
            skjemaelementId: 'arbeidsforholdSn',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdSN'),
            stepId: StepID.ARBEIDSSITUASJON,
        });
    }

    if (values.selvstendigVirksomheter.length === 1) {
        const virksomhet = values.selvstendigVirksomheter[0];
        if (isVirksomhetRegnskapsførerTelefonnummerValid(virksomhet) === false) {
            errors.push({
                stepId: StepID.ARBEIDSSITUASJON,
                skjemaelementId: 'virksomhet',
                feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigRegnskapsførerTelefonnummer'),
            });
        }
    }
    return errors.length > 0 ? errors : undefined;
};
