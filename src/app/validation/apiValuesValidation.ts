import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { StepID } from '../søknad/søknadStepsConfig';
import { OmsorgstilbudApiData, SøknadApiData, TimerFasteDagerApiData } from '../types/søknad-api-data/SøknadApiData';
import { søkerKunHelgedager } from '../utils/formDataUtils';
import { durationToDecimalDuration, ISODurationToDuration, summarizeDurations } from '@navikt/sif-common-utils/lib';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { getAttachmentsApiDataFromSøknadsdata } from '../utils/søknadsdataToApiData/getAttachmentsApiDataFromSøknadsdata';
import _ from 'lodash';

export const apiVedleggIsInvalid = (apiVedlegg: string[], vedleggFormData: Attachment[]) => {
    apiVedlegg.find((v) => {
        return v === undefined;
    });
    const apiVedleggFromFormdata = vedleggFormData ? getAttachmentsApiDataFromSøknadsdata(vedleggFormData) : [];
    return !_.isEqual(apiVedleggFromFormdata.sort(), apiVedlegg.sort());
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

export const validateApiValues = (
    values: SøknadApiData,
    formValues: SøknadFormValues,
    intl: IntlShape
): ApiValidationError[] | undefined => {
    const errors: ApiValidationError[] = [];

    if (apiVedleggIsInvalid(values.vedlegg, formValues.legeerklæring)) {
        errors.push({
            skjemaelementId: 'vedlegg',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.manglerVedlegg'),
            stepId: StepID.LEGEERKLÆRING,
        });
    }

    if (apiVedleggIsInvalid(values.fødselsattestVedleggUrls, formValues.fødselsattest)) {
        errors.push({
            skjemaelementId: 'fødselsattest',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.fødselsattest'),
            stepId: StepID.OPPLYSNINGER_OM_BARNET,
        });
    }

    if (søkerKunHelgedager(values.fraOgMed, values.tilOgMed)) {
        errors.push({
            skjemaelementId: 'tidsrom',
            feilmelding: intlHelper(intl, 'steg.oppsummering.validering.tidsromKunHelg'),
            stepId: StepID.TIDSROM,
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
