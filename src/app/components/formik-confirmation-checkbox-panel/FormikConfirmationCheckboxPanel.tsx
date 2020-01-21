import * as React from 'react';
import { BekreftCheckboksPanel as NAVConfirmationCheckboxPanel } from 'nav-frontend-skjema';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps, FormikValidateFunction } from 'common/formik/FormikProps';

interface FormikConfirmationCheckboxPanelProps<T> {
    label: string;
    name: T;
    validate?: FormikValidateFunction;
    children?: React.ReactNode | React.ReactChildren;
}

type Props<T> = FormikConfirmationCheckboxPanelProps<T> & FormikValidationProps;

function FormikConfirmationCheckboxPanel<T>({ children, label, name, validate }: Props<T>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, submitCount, status, setFieldValue } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <NAVConfirmationCheckboxPanel
                        className="skjemaelement"
                        children={children}
                        checked={field.value === true}
                        label={label}
                        inputProps={{ name: `${name}`, id: `${name}` }}
                        {...field}
                        {...errorMsgProps}
                        onChange={() => {
                            setFieldValue(`${name}`, !field.value);
                        }}
                    />
                );
            }}
        </FormikField>
    );
}

export default FormikConfirmationCheckboxPanel;
