import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendUtils';
import SliderBase, { SliderBasePublicProps } from '../slider-base/SliderBase';

interface FormikSliderProps<T> {
    name: T;
    validate?: ((value: any) => string | Promise<void> | undefined);
    helperText?: string;
    maxLength?: number;
}

const FormikSlider = <T extends {}>(): React.FunctionComponent<FormikSliderProps<T> & SliderBasePublicProps> => ({
    label,
    name,
    validate,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return <SliderBase label={label} {...otherInputProps} {...errorMsgProps} {...field} />;
        }}
    </FormikField>
);

export default FormikSlider;
