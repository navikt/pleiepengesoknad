import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import TimeInputBase from '../time-input-base/TimeInputBase';
import { Time } from 'app/types/Time';

interface FormikTimeInputProps<T> {
    name: T;
    label: string;
    helperText?: string;
    maxHours?: number;
    maxMinutes?: number;
}

type Props = FormikValidationProps;

const FormikTimeInput = <T extends {}>(): React.FunctionComponent<Props & FormikTimeInputProps<T>> => ({
    label,
    name,
    validate,
    intl,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
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

export default FormikTimeInput;
