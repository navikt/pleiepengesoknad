import * as React from 'react';
import { Formik } from 'formik';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { CustomFormikProps as FormikProps } from '../../types/FormikProps';

interface FormikWrapperProps {
    contentRenderer: (formikProps: FormikProps) => JSX.Element;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer }) => (
    <Formik
        initialValues={initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setFormikState, setTouched }: FormikBag) => {
            setSubmitting(false);
            setFormikState({ submitCount: 0 });
            setTouched({});
        }}
        render={contentRenderer}
    />
);

export default FormikWrapper;
