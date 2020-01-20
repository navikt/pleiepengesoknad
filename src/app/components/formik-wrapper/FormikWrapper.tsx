import * as React from 'react';
import { Formik } from 'formik';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { FormikBag } from '../../types/FormikBag';
import { CustomFormikProps } from '../../types/FormikProps';

interface FormikWrapperProps {
    contentRenderer: (formikProps: CustomFormikProps) => JSX.Element;
    mellomlagring: PleiepengesøknadFormData;
}

const FormikWrapper: React.FunctionComponent<FormikWrapperProps> = ({ contentRenderer, mellomlagring }) => (
    <Formik
        initialValues={mellomlagring || initialValues}
        onSubmit={(values: PleiepengesøknadFormData, { setSubmitting, setStatus, setTouched }: FormikBag) => {
            setSubmitting(false);
            setTouched({});
        }}>
        {contentRenderer}
    </Formik>
);

export default FormikWrapper;
