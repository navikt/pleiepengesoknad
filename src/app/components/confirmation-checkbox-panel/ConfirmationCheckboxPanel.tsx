import * as React from 'react';
import { BekreftCheckboksPanel as NAVConfirmationCheckboxPanel } from 'nav-frontend-skjema';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';

interface InputProps {
    label: string;
    name: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
    children?: React.ReactNode | React.ReactChildren;
}

const ConfirmationCheckboxPanel = ({ name, label, validate, children }: InputProps) => (
    <FormikField validate={validate} name={name}>
        {({ field, form }: FormikFieldProps) => (
            <NAVConfirmationCheckboxPanel
                children={children}
                checked={field.value === true}
                label={label}
                {...field}
                onChange={() => {
                    form.setFieldValue(name, !field.value);
                }}
            />
        )}
    </FormikField>
);

export default ConfirmationCheckboxPanel;
