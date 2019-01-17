import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import DatepickerBase from '../datepicker-base/DatepickerBase';

interface FormikDatepickerProps<T> {
    name: T;
    validate?: ((value: any) => string | Promise<void> | undefined);
    label: string;
}

const FormikDatepicker = <T extends {}>(): React.FunctionComponent<FormikDatepickerProps<T>> => ({
    name,
    validate,
    label,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            // optional onChange-prop will be overriden
            return (
                <DatepickerBase
                    label={label}
                    {...otherInputProps}
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
