import * as React from 'react';
import ValidationErrorSummaryBase, {
    ValidationSummaryError
} from '../validation-error-summary-base/ValidationErrorSummaryBase';
import { connect } from 'formik';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { Field } from '../../types/PleiepengesøknadFormData';
import intlHelper from '../../utils/intlUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { renderFieldValidationError, isFieldValidationError } from '../../validation/fieldValidationRenderUtils';
import { flattenFieldArrayErrors } from 'app/utils/formikUtils';

interface FormikValidationErrorSummaryProps {
    className?: string;
}

type Props = FormikValidationErrorSummaryProps & ConnectedFormikProps<Field> & InjectedIntlProps;

const FormikValidationErrorSummary: React.FunctionComponent<Props> = ({
    formik: { errors, submitCount, ...otherFormik },
    intl,
    className
}) => {
    if (errors) {
        const numberOfErrors = Object.keys(errors).length;
        const errorMessages: ValidationSummaryError[] = [];

        if (numberOfErrors > 0 && submitCount > 0) {
            const allErrors = flattenFieldArrayErrors(errors);
            Object.keys(allErrors).forEach((key) => {
                const error = allErrors[key];
                const message = isFieldValidationError(error) ? renderFieldValidationError(intl, error) : error;
                if (message && typeof message === 'string') {
                    errorMessages.push({
                        name: key,
                        message
                    });
                }
            });

            if (errorMessages.length === 0) {
                return null;
            }
            return (
                <ValidationErrorSummaryBase
                    className={className}
                    errors={errorMessages}
                    title={intlHelper(intl, 'formikValidationErrorSummary.tittel')}
                />
            );
        }
    }

    return null;
};

export default connect<FormikValidationErrorSummaryProps, Field>(injectIntl(FormikValidationErrorSummary));
