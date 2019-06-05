import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendUtils';
import RadioPanelGroupBase from '../radio-panel-group-base/RadioPanelGroupBase';

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
    validate?: (value: any) => string | Promise<void> | undefined;
    helperText?: string;
}

const FormikRadioPanelGroup = <T extends {}>(): React.FunctionComponent<FormikRadioPanelGroupProps<T>> => ({
    name,
    validate,
    legend,
    radios,
    helperText
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
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
