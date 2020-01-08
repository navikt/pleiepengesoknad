import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import CheckboxPanelGroupBase, {
    CheckboxPanelExpandedContentRenderer
} from 'common/form-components/checkbox-panel-group-base/CheckboxPanelGroupBase';
import { removeElementFromArray } from 'common/utils/listUtils';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { isCheckboxChecked, showValidationErrors } from 'app/utils/formikUtils';

interface FormikCheckboxPanelProps {
    label: string;
    value: any;
    key?: string;
    disabled?: boolean;
    expandedContentRenderer?: CheckboxPanelExpandedContentRenderer;
}

interface FormikCheckboxPanelGroupProps<T> {
    legend: string;
    name: T;
    checkboxes: FormikCheckboxPanelProps[];
    validate?: FormikValidateFunction;
    helperText?: string;
    valueKey?: string;
    singleColumn?: boolean;
}

const FormikCheckboxPanelGroup = <T extends {}>(): React.FunctionComponent<FormikCheckboxPanelGroupProps<T> &
    FormikValidationProps> => ({ name, validate, legend, checkboxes, singleColumn, helperText, intl, valueKey }) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, status, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <CheckboxPanelGroupBase
                    legend={legend}
                    checkboxes={checkboxes.map(({ value, ...otherProps }) => ({
                        checked: isCheckboxChecked(field.value, value, valueKey),
                        onChange: (evt) => {
                            if (isCheckboxChecked(field.value, value, valueKey)) {
                                setFieldValue(`${name}`, removeElementFromArray(value, field.value, valueKey));
                            } else {
                                if (field.value) {
                                    field.value.push(value);
                                } else {
                                    field.value = [value];
                                }
                                setFieldValue(`${name}`, field.value);
                            }
                        },
                        name: `${name}`,
                        value,
                        ...otherProps
                    }))}
                    helperText={helperText}
                    singleColumn={singleColumn}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikCheckboxPanelGroup;
