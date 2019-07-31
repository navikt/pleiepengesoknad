import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import { Checkbox, CheckboxProps } from 'nav-frontend-skjema';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';

interface FormikCheckboxProps<T> {
    validate?: FormikValidateFunction;
    afterOnChange?: (newValue: boolean) => void;
    name: T;
}

const FormikCheckbox = <T extends {}>(): React.FunctionComponent<
    CheckboxProps & FormikCheckboxProps<T> & FormikValidationProps
> => ({ name, label, validate, afterOnChange, intl, ...otherInputProps }) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, setFieldValue, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <Checkbox
                    label={label}
                    name={name}
                    {...otherInputProps}
                    {...errorMsgProps}
                    {...field}
                    checked={field.value === true}
                    onChange={() => {
                        const newValue = !field.value;
                        setFieldValue(field.name, newValue);
                        if (afterOnChange) {
                            afterOnChange(newValue);
                        }
                    }}
                />
            );
        }}
    </FormikField>
);

export default FormikCheckbox;
