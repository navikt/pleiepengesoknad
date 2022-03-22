import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { StepID } from '../søknad/søknadStepsConfig';
import { JobberIPeriodeSvar } from '../types';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    NormalarbeidstidApiData,
    OmsorgstilbudApiData,
    SøknadApiData,
} from '../types/SøknadApiData';
import appSentryLogger from '../utils/appSentryLogger';
import { søkerKunHelgedager } from '../utils/formDataUtils';

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

const isValidNormalarbeidstidPerUke = (timer: number | undefined): boolean => {
    return timer !== undefined && timer >= MIN_TIMER_NORMAL_ARBEIDSFORHOLD && timer <= MAX_TIMER_NORMAL_ARBEIDSFORHOLD;
};

export const isArbeidIPeriodeValid = (arbeidIPeriode: ArbeidIPeriodeApiData): boolean => {
    const { jobberIPerioden, erLiktHverUke, fasteDager, enkeltdager } = arbeidIPeriode;
    if (jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return true;
    }
    if (erLiktHverUke === true && fasteDager === undefined) {
        return false;
    }
    if (fasteDager === undefined && enkeltdager === undefined) {
        return false;
    }
    if (fasteDager !== undefined && enkeltdager !== undefined) {
        return false;
    }
    return true;
};

const isNormalarbeidstidValid = (arbeidstimerNormalt: NormalarbeidstidApiData): boolean => {
    if (arbeidstimerNormalt.erLiktHverUke === false) {
        return isValidNormalarbeidstidPerUke(arbeidstimerNormalt.timerPerUke);
    }
    return arbeidstimerNormalt.timerFasteDager !== undefined;
};

export const isArbeidIPeriodeApiValuesValid = (arbeidsforhold: ArbeidsforholdApiData): boolean => {
    if (arbeidsforhold.arbeidIPeriode === undefined) {
        return arbeidsforhold.harFraværIPeriode === false;
    }
    return isArbeidIPeriodeValid(arbeidsforhold.arbeidIPeriode);
};

export const isArbeidsforholdApiDataValid = (arbeidsforhold: ArbeidsforholdApiData) =>
    isNormalarbeidstidValid(arbeidsforhold.normalarbeidstid) && isArbeidIPeriodeApiValuesValid(arbeidsforhold);

export const isOmsorgstilbudApiDataValid = (omsorgstilbud: OmsorgstilbudApiData): boolean => {
    if (omsorgstilbud) {
        const { enkeltdager, ukedager, erLiktHverUke } = omsorgstilbud;
        if (erLiktHverUke && ukedager === undefined) {
            return false;
        }
        if (erLiktHverUke === false && (enkeltdager === undefined || enkeltdager.length === 0)) {
            return false;
        }
    }
    return true;
};

export const validateApiValues = (values: SøknadApiData, intl: IntlShape): ApiValidationError[] | undefined => {
    const errors: ApiValidationError[] = [];

    if (søkerKunHelgedager(values.fraOgMed, values.tilOgMed)) {
        errors.push({
            skjemaelementId: 'tidsrom',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.tidsromKunHelg'),
            stepId: StepID.TIDSROM,
        });
    }
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
            if (!arbeidsgiver.navn || arbeidsgiver.navn === 'null') {
                appSentryLogger.logError(
                    'apiValuesValidation: Manglende navn på organisasjon',
                    `${JSON.stringify(arbeidsgiver)}`
                );
                errors.push({
                    skjemaelementId: 'arbeidsforholdAnsatt',
                    feilmelding: intlHelper(intl, 'steg.oppsummering.validering.manglendeArbeidsgiverNavn', {
                        hvor: `hos ${arbeidsgiver.organisasjonsnummer}`,
                    }),
                    stepId: StepID.ARBEIDSSITUASJON,
                });
            }
            if (arbeidsgiver.arbeidsforhold) {
                if (!arbeidsgiver.navn) {
                    errors.push({
                        skjemaelementId: 'arbeidsforholdAnsatt',
                        feilmelding: intlHelper(intl, 'steg.oppsummering.validering.manglendeArbeidsgiverNavn', {
                            hvor: `hos ${arbeidsgiver.organisasjonsnummer}`,
                        }),
                        stepId: StepID.ARBEIDSSITUASJON,
                    });
                }
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
