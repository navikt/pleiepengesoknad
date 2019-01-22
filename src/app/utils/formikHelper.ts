import { FormikStepProps } from '../components/formik-step/FormikStep';

export const userHasSubmittedValidForm = (oldProps: FormikStepProps, currentProps: FormikStepProps) =>
    oldProps.isSubmitting === true && currentProps.isSubmitting === false && currentProps.isValid === true;
