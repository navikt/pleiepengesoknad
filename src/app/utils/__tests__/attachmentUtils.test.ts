import { fileExtensionIsValid, getPendingAttachmentFromFile, VALID_EXTENSIONS } from '../attachmentUtils';

describe('attachmentUtils', () => {
    describe('fileExtensionIsValid', () => {
        it('should only accept file extensions specified by VALID_EXTENSIONS', () => {
            for (const ext of VALID_EXTENSIONS) {
                expect(fileExtensionIsValid(ext)).toBe(true);
            }
            expect(fileExtensionIsValid('asdf')).toBe(false);
        });
    });

    describe('getPendingAttachmentFromFile', () => {
        it('should return a pending Attachment-object containing specified File and Attachment-specific properties', () => {
            const fileMock = new File([''], 'filename', { type: 'text/png' });
            const { pending, file, uploaded, url } = getPendingAttachmentFromFile(fileMock);
            expect(file).toEqual(fileMock);
            expect(pending).toBe(true);
            expect(uploaded).toBe(false);
            expect(url).toBeUndefined();
        });
    });
});
