import { ValidationSummaryError } from 'common/components/validation-error-summary-base/ValidationErrorSummaryBase';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { IntlShape } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';

export const apiVedleggIsInvalid = (vedlegg: string[]): boolean => {
    vedlegg.find((v) => {
        return v === undefined;
    });
    // return vedlegg.length === 0 || vedlegg.find((v) => v === undefined || v === '' || v === null) !== undefined;
    return false;  // KORONA -- disabled
};

export const validateApiValues = (
    values: PleiepengesøknadApiData,
    intl: IntlShape
): ValidationSummaryError[] | undefined => {
    const errors: ValidationSummaryError[] = [];

    if (apiVedleggIsInvalid(values.vedlegg)) {
        errors.push({
            name: 'vedlegg',
            message: intlHelper(intl, 'steg.oppsummering.validering.manglerVedlegg')
        });
    }
    return errors.length > 0 ? errors : undefined;
};
