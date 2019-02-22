import { FormikProps } from 'formik';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

export type CustomFormikProps = FormikProps<PleiepengesøknadFormData> & { submitForm: () => Promise<void> };

export type FieldArrayReplaceFn = (index: number, value: any) => void;
export type FieldArrayPushFn = (obj: any) => void;
