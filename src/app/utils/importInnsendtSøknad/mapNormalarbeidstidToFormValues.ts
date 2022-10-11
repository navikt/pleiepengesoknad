import { ISODurationToDecimalDuration } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidApiData } from '../../types/søknad-api-data/normalarbeidstidApiData';

export const mapNormalarbeidstidApiDataToFormValues = (
    normalarbeidstid?: NormalarbeidstidApiData
): NormalarbeidstidFormData | undefined => {
    if (!normalarbeidstid) {
        return undefined;
    }
    return {
        timerPerUke: `${ISODurationToDecimalDuration(normalarbeidstid.timerPerUkeISnitt)}`.replace('.', ','),
    };
};
