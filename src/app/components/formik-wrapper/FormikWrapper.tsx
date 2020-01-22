import * as React from 'react';
import { Formik } from 'formik';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { PleiepengesøknadFormikProps } from '../../types/PleiepengesøknadFormikProps';

interface FormikWrapperProps {
    contentRenderer: (formikProps: PleiepengesøknadFormikProps) => JSX.Element;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer }) => (
    <Formik
        initialValues={initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setStatus, setTouched }: FormikBag) => {
            setSubmitting(false);
            setTouched({});
        }}>
        {contentRenderer}
    </Formik>
);

export default FormikWrapper;
