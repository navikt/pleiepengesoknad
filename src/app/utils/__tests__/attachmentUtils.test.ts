import { fileExtensionIsValid, getAttachmentFromFile, VALID_EXTENSIONS } from '../attachmentUtils';

describe('attachmentUtils', () => {
    describe('fileExtensionIsValid', () => {
        it('should only accept file extensions specified by VALID_EXTENSIONS', () => {
            for (const ext of VALID_EXTENSIONS) {
                expect(fileExtensionIsValid(ext)).toBe(true);
            }
            expect(fileExtensionIsValid('asdf')).toBe(false);
        });
    });

    describe('getAttachmentFromFile', () => {
        it('should return an Attachment-object containing specified File and Attachment-specific properties', () => {
            const fileMock = new File([''], 'filename', { type: 'text/png' });
            const { pending, file, uploaded, url } = getAttachmentFromFile(fileMock);
            expect(file).toEqual(fileMock);
            expect(pending).toBe(false);
            expect(uploaded).toBe(false);
            expect(url).toBeUndefined();
        });
    });
});
