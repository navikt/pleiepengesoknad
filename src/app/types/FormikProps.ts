import { FormikProps } from 'formik';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

export type CustomFormikProps = FormikProps<PleiepengesøknadFormData> & { submitForm: () => Promise<void> };
