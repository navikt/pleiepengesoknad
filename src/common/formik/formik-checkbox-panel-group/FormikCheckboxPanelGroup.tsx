import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import CheckboxPanelGroupBase, {
    CheckboxPanelExpandedContentRenderer
} from 'common/form-components/checkbox-panel-group-base/CheckboxPanelGroupBase';
import { removeElementFromArray } from 'common/utils/listUtils';
import { isCheckboxChecked, showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidateFunction, FormikValidationProps } from 'common/formik/FormikProps';

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

function FormikCheckboxPanelGroup<T>({
    name,
    validate,
    legend,
    checkboxes,
    singleColumn,
    helperText,
    valueKey
}: FormikCheckboxPanelGroupProps<T> & FormikValidationProps) {
    const intl = useIntl();
    return (
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
}

export default FormikCheckboxPanelGroup;
