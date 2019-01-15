import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';

interface FormikRadioPanelProps {
    label: string;
    value: string;
    disabled?: boolean;
}

interface FormikRadioPanelGroupProps {
    legend: string;
    name: string;
    radios: FormikRadioPanelProps[];
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const FormikRadioPanelGroup = ({ name, validate, legend, radios }: FormikRadioPanelGroupProps) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <RadioPanelGroup
                    legend={legend}
                    radios={radios.map(({ value, ...otherProps }) => ({
                        checked: field.value === value,
                        onChange: () => setFieldValue(field.name, value),
                        name,
                        value,
                        ...otherProps
                    }))}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikRadioPanelGroup;
