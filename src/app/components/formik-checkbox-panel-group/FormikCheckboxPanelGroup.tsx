import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import CheckboxPanelGroupBase from '../checkbox-panel-group-base/CheckboxPanelGroupBase';
import { removeElementFromArray } from '../../utils/listUtils';
import { FormikValidateFunction, FormikIntlValidationProps } from 'app/types/FormikProps';

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
    validate?: FormikValidateFunction;
    helperText?: string;
}

const FormikCheckboxPanelGroup = <T extends {}>(): React.FunctionComponent<
    FormikCheckboxPanelGroupProps<T> & FormikIntlValidationProps
> => ({ name, validate, legend, checkboxes, helperText, intl }) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
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
                    helperText={helperText}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikCheckboxPanelGroup;
