import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { FormikErrors, getIn } from 'formik';
import { isFieldValidationError, renderFieldValidationError } from 'common/validation/fieldValidationRenderUtils';
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
    if (
        error !== undefined &&
        isNotEmpty(error) &&
        !isArray(error) &&
        (isFieldValidationError(error) || typeof error === 'string')
        // Ekstra sjekk for å ikke ta med treff på forelder-node der
        // fields har objektstruktur, og en feil i barn-node
        // treffes av foreldernode (getIn finner begge)
    ) {
        const feilmelding: string = isFieldValidationError(error) ? renderFieldValidationError(intl, error) : error;
        if (typeof feilmelding === 'string') {
            return {
                feil: {
                    feilmelding: typeof feilmelding === 'string' ? feilmelding : 'invalid error object'
                }
            };
        }
    }
    return {};
};
