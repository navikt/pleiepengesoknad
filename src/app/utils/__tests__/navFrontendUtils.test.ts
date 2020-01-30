import { FormikErrors } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { CommonFieldValidationErrors } from 'common/validation/commonFieldValidations';

interface SomeFields {
    field1: string;
    field2: number;
    field3: string;
}

let errors: FormikErrors<SomeFields>;

const intl: any = {
    formatMessage: ({ defaultMessage }: { defaultMessage: any }) => defaultMessage
};

describe('navFrontendUtils', () => {
    describe('getValidationErrorPropsWithIntl', () => {
        beforeEach(() => {
            errors = {
                field1: CommonFieldValidationErrors.påkrevd,
                field2: CommonFieldValidationErrors.påkrevd,
                field3: CommonFieldValidationErrors.påkrevd
            };
        });

        it('should return validation errors on format compatible with nav-frontend input components', () => {
            const field1Errors = getValidationErrorPropsWithIntl(intl, errors, 'field1');
            const field2Errors = getValidationErrorPropsWithIntl(intl, errors, 'field2');
            const field3Errors = getValidationErrorPropsWithIntl(intl, errors, 'field3');
            expect(field1Errors).toEqual({ feil: { feilmelding: errors.field1 } });
            expect(field2Errors).toEqual({ feil: { feilmelding: errors.field2 } });
            expect(field3Errors).toEqual({ feil: { feilmelding: errors.field3 } });
        });

        it('should return an empty object if there is no errors on the specified field name', () => {
            expect(getValidationErrorPropsWithIntl(intl, errors, 'nonExistentField')).toEqual({});
        });
    });
});
