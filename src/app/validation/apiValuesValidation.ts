import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { StepID } from '../søknad/søknadStepsConfig';
import { OmsorgstilbudApiData, SøknadApiData, TimerFasteDagerApiData } from '../types/søknad-api-data/SøknadApiData';
import { søkerKunHelgedager } from '../utils/formDataUtils';
import { durationToDecimalDuration, ISODurationToDuration, summarizeDurations } from '@navikt/sif-common-utils/lib';

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

const isUkedagerValid = (ukedager?: TimerFasteDagerApiData) => {
    if (ukedager === undefined) {
        return false;
    }
    const ukedagerArray = [
        ukedager.mandag ? ISODurationToDuration(ukedager.mandag) : undefined,
        ukedager.tirsdag ? ISODurationToDuration(ukedager.tirsdag) : undefined,
        ukedager.onsdag ? ISODurationToDuration(ukedager.onsdag) : undefined,
        ukedager.torsdag ? ISODurationToDuration(ukedager.torsdag) : undefined,
        ukedager.fredag ? ISODurationToDuration(ukedager.fredag) : undefined,
    ];

    const hoursInTotal = durationToDecimalDuration(summarizeDurations(ukedagerArray));

    if (hoursInTotal === 0 || hoursInTotal > 37.5) {
        return false;
    }
    return true;
};

export const isOmsorgstilbudApiDataValid = (omsorgstilbud: OmsorgstilbudApiData): boolean => {
    if (omsorgstilbud) {
        const { enkeltdager, ukedager, erLiktHverUke } = omsorgstilbud;

        if (erLiktHverUke && isUkedagerValid(ukedager) !== true) {
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

    if (values.nattevåk && values.nattevåk.tilleggsinformasjon && values.nattevåk.tilleggsinformasjon.length > 1000) {
        errors.push({
            skjemaelementId: 'omsorgstilbud',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.omsorgstilbud.nattevåkBeskrivelseForLang'),
            stepId: StepID.OMSORGSTILBUD,
        });
    }

    if (
        values.beredskap &&
        values.beredskap.tilleggsinformasjon &&
        values.beredskap.tilleggsinformasjon.length > 1000
    ) {
        errors.push({
            skjemaelementId: 'omsorgstilbud',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.omsorgstilbud.beredskapBeskrivelseForLang'),
            stepId: StepID.OMSORGSTILBUD,
        });
    }

    return errors.length > 0 ? errors : undefined;
};
