import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { StepID } from '../søknad/søknadStepsConfig';
import { OmsorgstilbudApiData, SøknadApiData } from '../types/SøknadApiData';
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

    return errors.length > 0 ? errors : undefined;
};
