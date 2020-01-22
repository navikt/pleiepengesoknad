import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { CheckboksPanel, CheckboksPanelProps } from 'nav-frontend-skjema';
import { FormikValidateFunction, FormikValidationProps } from 'common/formik/FormikProps';
import { showValidationErrors } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';

interface FormikCheckboxProps<T> {
    validate?: FormikValidateFunction;
    afterOnChange?: (newValue: boolean) => void;
    name: T;
}

const FormikCheckboxPanel = <T extends {}>(): React.FunctionComponent<CheckboksPanelProps &
    FormikCheckboxProps<T> &
    FormikValidationProps> => ({ name, label, validate, afterOnChange, ...otherInputProps }) => {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, setFieldValue, submitCount } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <CheckboksPanel
                        label={label}
                        inputProps={name}
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
};

export default FormikCheckboxPanel;
