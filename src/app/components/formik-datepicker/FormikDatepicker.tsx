import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import DatepickerBase from '../datepicker-base/DatepickerBase';

export interface FormikDatepickerProps<T> {
    name: T;
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const FormikDatepicker = <T extends {}>(): React.FunctionComponent<FormikDatepickerProps<T>> => ({
    name,
    validate,
    label
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <DatepickerBase
                    label={label}
                    value={field.value}
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
