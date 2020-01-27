import * as React from 'react';
import { Formik } from 'formik';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { PleiepengesøknadFormikProps } from '../../types/PleiepengesøknadFormikProps';

interface FormikWrapperProps {
    contentRenderer: (formikProps: PleiepengesøknadFormikProps) => JSX.Element;
    formdata: PleiepengesøknadFormData;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer, formdata }) => (
    <Formik
        initialValues={formdata || initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setStatus, setTouched }: FormikBag) => {
            setSubmitting(false);
            setTouched({});
        }}>
        {contentRenderer}
    </Formik>
);

export default FormikWrapper;
