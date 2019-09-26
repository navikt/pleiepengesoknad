import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { FormikErrors, getIn } from 'formik';
import { isFieldValidationError, renderFieldValidationError } from 'app/validation/fieldValidationRenderUtils';
import { IntlShape } from 'react-intl';
import { isArray } from 'util';

const isNotEmpty = (obj: any): boolean => {
    if (typeof obj === 'string') {
        return true;
    }
    if (typeof obj === 'object') {
        return JSON.stringify(obj) !== JSON.stringify({});
    }
    return false;
};

export const getValidationErrorPropsWithIntl = <T>(
    intl: IntlShape,
    errors: FormikErrors<T>,
    elementName: string
): { feil?: SkjemaelementFeil } => {
    const error = getIn(errors, elementName);
    if (error !== undefined && isNotEmpty(error) && !isArray(error)) {
        const feilmelding: string = isFieldValidationError(error) ? renderFieldValidationError(intl, error) : error;
        return {
            feil: {
                feilmelding
            }
        };
    }
    return {};
};
