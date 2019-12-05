import { ValidationSummaryError } from '../components/validation-error-summary-base/ValidationErrorSummaryBase';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { InjectedIntl } from 'react-intl';
import intlHelper from '../utils/intlUtils';

export const validateApiValues = (
    values: PleiepengesøknadApiData,
    intl: InjectedIntl
): ValidationSummaryError[] | undefined => {
    const errors: ValidationSummaryError[] = [];

    if (values.vedlegg.length === 0 || values.vedlegg.find((v) => v === undefined || v === '')) {
        errors.push({
            name: 'vedlegg',
            message: intlHelper(intl, 'steg.oppsummering.validering.manglerVedlegg')
        });
    }
    return errors.length > 0 ? errors : undefined;
};
