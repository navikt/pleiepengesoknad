import { FormikProps } from 'formik';

export interface ConnectedFormikProps<T> {
    formik: FormikProps<T>;
}
