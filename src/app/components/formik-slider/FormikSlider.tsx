import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import SliderBase, { SliderBasePublicProps } from '../slider-base/SliderBase';
import { FormikValidateFunction, FormikValidationProps } from 'app/types/FormikProps';
import { showValidationErrors } from 'app/utils/formikUtils';

interface FormikSliderProps<T> {
    name: T;
    validate?: FormikValidateFunction;
    helperText?: string | React.ReactNode;
    maxLength?: number;
}

const FormikSlider = <T extends {}>(): React.FunctionComponent<FormikSliderProps<T> &
    SliderBasePublicProps &
    FormikValidationProps> => ({ label, name, validate, intl, ...otherInputProps }) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = showValidationErrors(status, submitCount)
                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                : {};
            return (
                <SliderBase
                    label={label}
                    {...otherInputProps}
                    {...errorMsgProps}
                    {...field}
                    value={field.value || ''}
                />
            );
        }}
    </FormikField>
);

export default FormikSlider;
