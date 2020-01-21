import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import TimeInputBase from '../../form-components/time-input-base/TimeInputBase';
import { Time } from 'common/types/Time';
import { showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps } from 'common/formik/FormikProps';

interface FormikTimeInputProps<T> {
    name: T;
    label: string;
    helperText?: string;
    maxHours?: number;
    maxMinutes?: number;
}

type Props<T> = FormikValidationProps & FormikTimeInputProps<T>;

function FormikTimeInput<T>({ label, name, validate, ...otherInputProps }: Props<T>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount, setFieldValue } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <TimeInputBase
                        label={label}
                        {...otherInputProps}
                        {...errorMsgProps}
                        {...field}
                        time={field.value || undefined}
                        onChange={(time: Time) => {
                            setFieldValue(field.name, time);
                        }}
                    />
                );
            }}
        </FormikField>
    );
}

export default FormikTimeInput;
