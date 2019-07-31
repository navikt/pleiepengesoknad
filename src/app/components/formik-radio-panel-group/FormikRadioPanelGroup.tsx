import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import RadioPanelGroupBase from '../radio-panel-group-base/RadioPanelGroupBase';
import { FormikValidateFunction, FormikIntlValidationProps } from 'app/types/FormikProps';

interface FormikRadioPanelProps {
    label: React.ReactNode;
    value: string;
    key?: string;
    disabled?: boolean;
}

interface FormikRadioPanelGroupProps<T> {
    legend: string;
    name: T;
    radios: FormikRadioPanelProps[];
    validate?: FormikValidateFunction;
    helperText?: string;
}

const FormikRadioPanelGroup = <T extends {}>(): React.FunctionComponent<
    FormikRadioPanelGroupProps<T> & FormikIntlValidationProps
> => ({ name, validate, legend, radios, helperText, intl }) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <RadioPanelGroupBase
                    legend={legend}
                    radios={radios.map(({ value, ...otherProps }) => ({
                        checked: field.value === value,
                        onChange: () => setFieldValue(field.name, value),
                        name: `${name}`,
                        value,
                        ...otherProps
                    }))}
                    helperText={helperText}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikRadioPanelGroup;
