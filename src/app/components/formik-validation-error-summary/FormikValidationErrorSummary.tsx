import * as React from 'react';
import ValidationErrorSummaryBase, {
    ValidationSummaryError
} from '../../../common/components/validation-error-summary-base/ValidationErrorSummaryBase';
import { connect } from 'formik';
import { ConnectedFormikProps } from '../../../common/types/ConnectedFormikProps';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { flattenFieldArrayErrors, showValidationErrors } from 'common/formik/formikUtils';
import { isFieldValidationError, renderFieldValidationError } from 'common/validation/fieldValidationRenderUtils';

interface FormikValidationErrorSummaryProps {
    className?: string;
}

type Props = FormikValidationErrorSummaryProps & ConnectedFormikProps<AppFormField>;

const FormikValidationErrorSummary: React.FunctionComponent<Props> = ({ formik, className }) => {
    if (formik === undefined) {
        return null;
    }
    const intl = useIntl();
    const { errors, submitCount, status } = formik;
    if (errors) {
        const numberOfErrors = Object.keys(errors).length;
        const errorMessages: ValidationSummaryError[] = [];

        if (numberOfErrors > 0 && showValidationErrors(status, submitCount)) {
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

export default connect<FormikValidationErrorSummaryProps, AppFormField>(FormikValidationErrorSummary);
