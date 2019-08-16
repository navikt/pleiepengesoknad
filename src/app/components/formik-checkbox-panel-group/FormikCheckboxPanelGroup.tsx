import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import CheckboxPanelGroupBase, {
    CheckboxPanelExpandedContentRenderer
} from '../checkbox-panel-group-base/CheckboxPanelGroupBase';
import { removeElementFromArray } from '../../utils/listUtils';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { isCheckboxChecked } from 'app/utils/formikUtils';

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

const FormikCheckboxPanelGroup = <T extends {}>(): React.FunctionComponent<
    FormikCheckboxPanelGroupProps<T> & FormikValidationProps
> => ({ name, validate, legend, checkboxes, singleColumn: columns, helperText, intl, valueKey }) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <CheckboxPanelGroupBase
                    legend={legend}
                    checkboxes={checkboxes.map(({ value, ...otherProps }) => ({
                        checked: isCheckboxChecked(field.value, value, valueKey),
                        onChange: () => {
                            if (isCheckboxChecked(field.value, value, valueKey)) {
                                setFieldValue(`${name}`, removeElementFromArray(value, field.value, valueKey));
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
                    singleColumn={columns}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikCheckboxPanelGroup;
