import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendUtils';
import DatepickerBase from '../datepicker-base/DatepickerBase';
import { Avgrensninger as DateLimitations } from 'nav-datovelger';

export interface FormikDatepickerProps<T> {
    name: T;
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
    dateLimitations?: DateLimitations;
}

const FormikDatepicker = <T extends {}>(): React.FunctionComponent<FormikDatepickerProps<T>> => ({
    name,
    validate,
    label,
    dateLimitations
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <DatepickerBase
                    label={label}
                    value={field.value}
                    dateLimitations={dateLimitations}
                    {...errorMsgProps}
                    {...field}
                    onChange={(date: Date) => {
                        setFieldValue(field.name, date);
                    }}
                />
            );
        }}
    </FormikField>
);

export default FormikDatepicker;
