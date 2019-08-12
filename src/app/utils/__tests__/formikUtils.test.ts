import { userHasSubmittedValidForm, isCheckboxChecked } from '../formikUtils';

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

        it('should compare on keyProp if keyProp is provided for a checkboxgroup', () => {
            const item1 = { key: 1, value: 2 };
            const item2 = { key: 2, value: 2 };
            const fieldValues = [item1];
            expect(isCheckboxChecked(fieldValues, item1, 'key')).toBeTruthy();
            expect(isCheckboxChecked(fieldValues, item2, 'key')).toBeFalsy();
        });

        it('should see if whole object is within selected items if keyProp is not provided', () => {
            const item1 = { key: 1, value: 2 };
            const item2 = { key: 2, value: 2 };
            const fieldValues = [item1];
            expect(isCheckboxChecked(fieldValues, item1)).toBeTruthy();
            expect(isCheckboxChecked(fieldValues, item2)).toBeFalsy();
        });
    });
});
