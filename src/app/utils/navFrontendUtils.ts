import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { FormikErrors } from 'formik';
import { isFieldValidationError, renderFieldValidationError } from 'app/validation/fieldValidationRenderUtils';
import { InjectedIntl } from 'react-intl';

export const getValidationErrorPropsWithIntl = <T>(
    intl: InjectedIntl,
    errors: FormikErrors<T>,
    elementName: string
): { feil?: SkjemaelementFeil } | undefined => {
    if (errors[elementName] !== undefined) {
        const error = errors[elementName];
        const feilmelding = isFieldValidationError(error) ? renderFieldValidationError(intl, error) : error;
        return {
            feil: {
                feilmelding
            }
        };
    }
    return undefined;
};
