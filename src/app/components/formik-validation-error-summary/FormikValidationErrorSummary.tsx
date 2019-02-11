import * as React from 'react';
import ValidationErrorSummaryBase, {
    ValidationSummaryError
} from '../validation-error-summary-base/ValidationErrorSummaryBase';
import { connect } from 'formik';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { Field } from '../../types/PleiepengesøknadFormData';

interface FormikValidationErrorSummaryProps {
    className?: string;
}

type Props = FormikValidationErrorSummaryProps & ConnectedFormikProps<Field>;

const FormikValidationErrorSummary: React.FunctionComponent<Props> = ({
    formik: { errors, submitCount },
    className
}) => {
    if (errors) {
        const numberOfErrors = Object.keys(errors).length;
        const errorMessages: ValidationSummaryError[] = [];

        if (numberOfErrors > 0 && submitCount > 0) {
            Object.keys(errors).forEach((key) => {
                errorMessages.push({
                    name: key,
                    message: errors[key]
                });
            });

            return <ValidationErrorSummaryBase className={className} errors={errorMessages} title="Her er det feil:" />;
        }
    }

    return null;
};

export default connect<FormikValidationErrorSummaryProps, Field>(FormikValidationErrorSummary);
