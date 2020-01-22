import { FormikProps } from 'formik';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

export type PleiepengesøknadFormikProps = FormikProps<PleiepengesøknadFormData> & { submitForm: () => Promise<void> };
