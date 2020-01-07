import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import InputBase, { InputBaseProps } from 'common/form-components/input-base/InputBase';
import { NavFrontendInputProps } from 'nav-frontend-skjema';
import { FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';

interface FormikInputProps<T> extends InputBaseProps {
    name: T;
}

type Props = NavFrontendInputProps & FormikValidationProps;

const FormikInput = <T extends {}>(): React.FunctionComponent<Props & FormikInputProps<T>> => ({
    label,
    name,
    validate,
    intl,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <InputBase
                    label={label}
                    {...otherInputProps}
                    {...errorMsgProps}
                    {...field}
                    value={field.value === undefined ? '' : field.value}
                />
            );
        }}
    </FormikField>
);

export default FormikInput;
