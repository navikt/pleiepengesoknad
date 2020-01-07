import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { SkjemaGruppe } from 'nav-frontend-skjema';

import './formikInputGroup.less';
import { showValidationErrors } from 'app/utils/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';

interface Props<T> {
    label: string;
    name: T;
    validate?: FormikValidateFunction;
    children: React.ReactNode;
}

const FormikInputGroup = <T extends {}>(): React.FunctionComponent<Props<T> & FormikValidationProps> => ({
    name,
    label,
    children,
    validate,
    intl
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <div className="formikInputGroupWrapper" id={field.name} tabIndex={errorMsgProps.feil ? -1 : undefined}>
                    <SkjemaGruppe title={label} feil={errorMsgProps.feil}>
                        {children}
                    </SkjemaGruppe>
                </div>
            );
        }}
    </FormikField>
);

export default FormikInputGroup;
