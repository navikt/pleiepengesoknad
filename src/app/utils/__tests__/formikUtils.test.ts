import { userHasSubmittedValidForm } from '../formikUtils';

describe('formikUtils', () => {
    describe('userHasSubmittedValidForm', () => {
        it('should return true if user has submitted a valid form', () => {
            const oldProps = { isSubmitting: true, isValid: false };
            const nextProps = { isSubmitting: false, isValid: true };
            expect(userHasSubmittedValidForm(oldProps, nextProps)).toBe(true);
        });

        it('should return false if user has submitted an invalid form', () => {
            const oldProps = { isSubmitting: true, isValid: false };
            const nextProps = { isSubmitting: false, isValid: false };
            expect(userHasSubmittedValidForm(oldProps, nextProps)).toBe(false);
        });
    });
});
