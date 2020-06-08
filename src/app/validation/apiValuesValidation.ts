import { IntlShape } from 'react-intl';
import { ValidationSummaryError } from 'common/components/validation-error-summary-base/ValidationErrorSummaryBase';
import intlHelper from 'common/utils/intlUtils';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';

export const apiVedleggIsInvalid = (vedlegg: string[]): boolean => {
    vedlegg.find((v) => {
        return v === undefined;
    });
    return false;
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
    return errors.length > 0 ? errors : undefined;
};
