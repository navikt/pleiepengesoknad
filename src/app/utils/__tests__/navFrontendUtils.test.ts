import { FormikErrors } from 'formik';
import { getValidationErrorProps } from '../navFrontendUtils';

interface SomeFields {
    field1: string;
    field2: number;
}

let errors: FormikErrors<SomeFields>;

describe('navFrontendUtils', () => {
    describe('getValidationErrorProps', () => {
        beforeEach(() => {
            errors = {
                field1: 'Error for field 1',
                field2: 'Error for field 2'
            };
        });

        it('should return validation errors on format compatible with nav-frontend input components', () => {
            const field1Errors = getValidationErrorProps(errors, 'field1');
            const field2Errors = getValidationErrorProps(errors, 'field2');
            expect(field1Errors).toEqual({ feil: { feilmelding: errors.field1 } });
            expect(field2Errors).toEqual({ feil: { feilmelding: errors.field2 } });
        });

        it('should return an empty object if there is no errors on the specified field name', () => {
            expect(getValidationErrorProps(errors, 'nonExistentField')).toEqual({});
        });
    });
});
