import * as React from 'react';
import { Formik } from 'formik';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { PleiepengesøknadFormikProps } from '../../types/PleiepengesøknadFormikProps';
import { MellomlagringData } from '../../types/storage';

interface FormikWrapperProps {
    contentRenderer: (formikProps: PleiepengesøknadFormikProps) => JSX.Element;
    mellomlagring: MellomlagringData;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer, mellomlagring }) => (
    <Formik
        initialValues={mellomlagring.formData || initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setStatus, setTouched }: FormikBag) => {
            setSubmitting(false);
            setTouched({});
        }}>
        {contentRenderer}
    </Formik>
);

export default FormikWrapper;
