import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import CheckboxPanelGroupBase from '../checkbox-panel-group-base/CheckboxPanelGroupBase';
import { removeElementFromArray } from '../../utils/listHelper';

interface FormikCheckboxPanelProps {
    label: string;
    value: any;
    key?: string;
    disabled?: boolean;
}

interface FormikCheckboxPanelGroupProps<T> {
    legend: string;
    name: T;
    checkboxes: FormikCheckboxPanelProps[];
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const FormikCheckboxPanelGroup = <T extends {}>(): React.FunctionComponent<FormikCheckboxPanelGroupProps<T>> => ({
    name,
    validate,
    legend,
    checkboxes
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <CheckboxPanelGroupBase
                    legend={legend}
                    checkboxes={checkboxes.map(({ value, ...otherProps }) => ({
                        checked: field.value.includes(value),
                        onChange: () => {
                            if (field.value.includes(value)) {
                                setFieldValue(`${name}`, removeElementFromArray(value, field.value));
                            } else {
                                field.value.push(value);
                                setFieldValue(`${name}`, field.value);
                            }
                        },
                        name: `${name}`,
                        value,
                        ...otherProps
                    }))}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikCheckboxPanelGroup;
