import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import RadioPanelGroupBase, {
    RadioPanelGroupStyle
} from 'common/form-components/radio-panel-group-base/RadioPanelGroupBase';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';
import { useIntl } from 'react-intl';

interface FormikRadioPanelProps {
    label: React.ReactNode;
    value: string;
    key: string;
    disabled?: boolean;
}

interface FormikRadioPanelGroupProps<T> {
    legend: string;
    name: T;
    radios: FormikRadioPanelProps[];
    validate?: FormikValidateFunction;
    helperText?: string;
    expandedContentRenderer?: () => React.ReactNode;
    singleColumn?: boolean;
    style?: RadioPanelGroupStyle;
}

const FormikRadioPanelGroup = <T extends {}>(): React.FunctionComponent<FormikRadioPanelGroupProps<T> &
    FormikValidationProps> => ({
    name,
    validate,
    legend,
    radios,
    helperText,
    style,
    singleColumn,
    expandedContentRenderer
}) => {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount, setFieldValue } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
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
                        expandedContentRenderer={expandedContentRenderer}
                        style={style}
                        singleColumn={singleColumn}
                        {...errorMsgProps}
                    />
                );
            }}
        </FormikField>
    );
};

export default FormikRadioPanelGroup;
