import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { StepID } from '../config/stepConfig';
import { JobberIPeriodeSvar } from '../types';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    isArbeidsgiverISøknadsperiodeApiData,
    OmsorgstilbudApiData,
    PleiepengesøknadApiData,
} from '../types/PleiepengesøknadApiData';

export const apiVedleggIsInvalid = (vedlegg: string[]): boolean => {
    vedlegg.find((v) => {
        return v === undefined;
    });
    return false;
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

const isValidNormalarbeidstid = (timer: number | undefined): boolean => {
    return timer !== undefined && timer >= MIN_TIMER_NORMAL_ARBEIDSFORHOLD && timer <= MAX_TIMER_NORMAL_ARBEIDSFORHOLD;
};

export const isArbeidIPeriodeValid = (arbeidIPeriode: ArbeidIPeriodeApiData): boolean => {
    const { jobberIPerioden, fasteDager, enkeltdager, jobberSomVanlig } = arbeidIPeriode;
    if (jobberIPerioden === JobberIPeriodeSvar.NEI || jobberIPerioden === JobberIPeriodeSvar.VET_IKKE) {
        return true;
    }
    if (jobberSomVanlig === true) {
        return true;
    }
    if (fasteDager === undefined && enkeltdager === undefined) {
        return false;
    }
    if (fasteDager !== undefined && enkeltdager !== undefined) {
        return false;
    }
    return true;
};

const isArbeidsformOgNormalarbeidstidValid = (arbeidsforhold: ArbeidsforholdApiData): boolean => {
    const { jobberNormaltTimer, arbeidsform } = arbeidsforhold;
    if (!arbeidsform || !jobberNormaltTimer) {
        return false;
    }
    return isValidNormalarbeidstid(jobberNormaltTimer);
};

export const isArbeidsforholdValid = (arbeidsforhold: ArbeidsforholdApiData): boolean => {
    return isArbeidsformOgNormalarbeidstidValid(arbeidsforhold);
};

export const isArbeidIPeriodeApiValuesValid = (arbeidsforhold: ArbeidsforholdApiData): boolean => {
    if (arbeidsforhold.historiskArbeid === undefined && arbeidsforhold.planlagtArbeid === undefined) {
        return false;
    }
    const historiskIsValid = arbeidsforhold.historiskArbeid
        ? isArbeidIPeriodeValid(arbeidsforhold.historiskArbeid)
        : true;
    const planlagtIsValid = arbeidsforhold.historiskArbeid
        ? isArbeidIPeriodeValid(arbeidsforhold.historiskArbeid)
        : true;
    return historiskIsValid === true && planlagtIsValid == true;
};

export const isArbeidsforholdApiDataValid = (arbeidsforhold: ArbeidsforholdApiData) =>
    isArbeidsformOgNormalarbeidstidValid(arbeidsforhold) && isArbeidIPeriodeApiValuesValid(arbeidsforhold);

export const isOmsorgstilbudApiDataValid = (omsorgstilbud: OmsorgstilbudApiData): boolean => {
    if (omsorgstilbud.historisk) {
        if (Object.keys(omsorgstilbud.historisk.enkeltdager).length === 0) {
            return false;
        }
    }
    if (omsorgstilbud.planlagt) {
        const { enkeltdager, ukedager, erLiktHverUke } = omsorgstilbud.planlagt;
        if (erLiktHverUke && ukedager === undefined) {
            return false;
        }
        if (erLiktHverUke !== true && (enkeltdager === undefined || enkeltdager?.length === 0)) {
            return false;
        }
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

    if (values.omsorgstilbud && isOmsorgstilbudApiDataValid(values.omsorgstilbud) === false) {
        errors.push({
            skjemaelementId: 'omsorgstilbud',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.omsorgstilbud.ugyldig'),
            stepId: StepID.OMSORGSTILBUD,
        });
    }

    const virksomhet = values.selvstendigNæringsdrivende?.virksomhet;
    if (virksomhet) {
        if (isVirksomhetRegnskapsførerTelefonnummerValid(virksomhet) === false) {
            errors.push({
                skjemaelementId: 'virksomhet',
                feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigRegnskapsførerTelefonnummer'),
                stepId: StepID.ARBEIDSSITUASJON,
            });
        }
    }

    if (values.arbeidsgivere && values.arbeidsgivere.length > 0) {
        values.arbeidsgivere.forEach((arbeidsgiver) => {
            if (isArbeidsgiverISøknadsperiodeApiData(arbeidsgiver)) {
                const isValid = isArbeidsforholdApiDataValid(arbeidsgiver.arbeidsforhold);
                if (!isValid) {
                    errors.push({
                        skjemaelementId: 'arbeidsforholdAnsatt',
                        feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdAnsatt', {
                            hvor: `hos ${arbeidsgiver.navn}`,
                        }),
                        stepId: StepID.ARBEIDSSITUASJON,
                    });
                }
            }
        });
    }

    if (values.frilans?.arbeidsforhold) {
        const isValid = isArbeidsforholdApiDataValid(values.frilans.arbeidsforhold);
        if (!isValid) {
            errors.push({
                skjemaelementId: 'arbeidsforholdFrilans',
                feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdFrilans'),
                stepId: StepID.ARBEIDSSITUASJON,
            });
        }
    }

    if (values.selvstendigNæringsdrivende) {
        const isValid = isArbeidsforholdApiDataValid(values.selvstendigNæringsdrivende.arbeidsforhold);
        if (!isValid) {
            errors.push({
                skjemaelementId: 'arbeidsforholdSn',
                feilmelding: intlHelper(intl, 'steg.oppsummering.validering.ugyldigArbeidsforholdSN'),
                stepId: StepID.ARBEIDSSITUASJON,
            });
        }
    }
    return errors.length > 0 ? errors : undefined;
};
