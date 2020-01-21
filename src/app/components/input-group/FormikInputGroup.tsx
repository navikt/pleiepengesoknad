import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { FormikValidateFunction, FormikValidationProps } from 'common/formik/FormikProps';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { showValidationErrors } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';

import './formikInputGroup.less';

interface OwnProps<T> {
    label: string;
    name: T;
    validate?: FormikValidateFunction;
    children: React.ReactNode;
}

type Props<T> = OwnProps<T> & FormikValidationProps;

function FormikInputGroup<T>({ name, label, children, validate }: Props<T>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <div
                        className="formikInputGroupWrapper"
                        id={field.name}
                        tabIndex={errorMsgProps.feil ? -1 : undefined}>
                        <SkjemaGruppe title={label} feil={errorMsgProps.feil}>
                            {children}
                        </SkjemaGruppe>
                    </div>
                );
            }}
        </FormikField>
    );
}
export default FormikInputGroup;
