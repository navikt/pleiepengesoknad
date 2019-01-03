import * as React from 'react';
import { BekreftCheckboksPanel as NAVConfirmationCheckboxPanel } from 'nav-frontend-skjema';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import SkjemaGruppe from 'nav-frontend-skjema/lib/skjema-gruppe';

interface InputProps {
    label: string;
    name: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
    children?: React.ReactNode | React.ReactChildren;
}

const ConfirmationCheckboxPanel = ({ name, label, validate, children }: InputProps) => (
    <FormikField validate={validate} name={name}>
        {({ field, form }: FormikFieldProps) => {
            return (
                <SkjemaGruppe {...getValidationErrorProps(form.errors, field.name)}>
                    <NAVConfirmationCheckboxPanel
                        children={children}
                        checked={field.value === true}
                        label={label}
                        {...field}
                        onChange={() => {
                            form.setFieldValue(name, !field.value);
                        }}
                    />
                </SkjemaGruppe>
            );
        }}
    </FormikField>
);

export default ConfirmationCheckboxPanel;
