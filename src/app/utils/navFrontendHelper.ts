import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { FormikErrors } from 'formik';

export const getValidationErrorProps = <T>(
    errors: FormikErrors<T>,
    elementName?: string
): { feil?: SkjemaelementFeil } => {
    if (elementName !== undefined && errors[elementName] !== undefined) {
        return {
            feil: {
                feilmelding: errors[elementName]
            }
        };
    }
    return {};
};
