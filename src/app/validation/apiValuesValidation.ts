import { IntlShape } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { FeiloppsummeringFeil } from 'nav-frontend-skjema';
import { StepID } from '../config/stepConfig';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';

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
    return errors.length > 0 ? errors : undefined;
};
