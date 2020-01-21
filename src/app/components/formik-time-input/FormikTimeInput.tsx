import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import TimeInputBase from '../time-input-base/TimeInputBase';
import { Time } from 'common/types/Time';
import { showValidationErrors } from 'app/utils/formikUtils';
import { useIntl } from 'react-intl';

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
    ...otherInputProps
}) => {
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
};

export default FormikTimeInput;
