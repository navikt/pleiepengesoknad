import {
    attachmentUploadHasFailed,
    containsAnyUploadedAttachments,
    fileExtensionIsValid,
    getAttachmentFromFile,
    getPendingAttachmentFromFile,
    VALID_EXTENSIONS
} from '../attachmentUtils';

const fileMock = new File([''], 'filename', { type: 'text/png' });

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
        it('should return a pending Attachment-object containing specified File and Attachment-specific properties', () => {
            const { pending, file, uploaded, url } = getAttachmentFromFile(fileMock);
            expect(file).toEqual(fileMock);
            expect(pending).toBe(false);
            expect(uploaded).toBe(false);
            expect(url).toBeUndefined();
        });
    });

    describe('getPendingAttachmentFromFile', () => {
        it('should return a pending Attachment-object containing specified File and Attachment-specific properties', () => {
            const { pending, file, uploaded, url } = getPendingAttachmentFromFile(fileMock);
            expect(file).toEqual(fileMock);
            expect(pending).toBe(true);
            expect(uploaded).toBe(false);
            expect(url).toBeUndefined();
        });
    });

    describe('attachmentUploadHasFailed', () => {
        let attachment: Attachment;

        beforeEach(() => {
            attachment = getAttachmentFromFile(fileMock);
        });

        it('should return true if attachment is neither pending nor uploaded', () => {
            attachment.pending = false;
            expect(attachmentUploadHasFailed(attachment)).toBe(true);
        });

        it('should return false if pending is true', () => {
            attachment.pending = true;
            expect(attachmentUploadHasFailed(attachment)).toBe(false);
        });
    });

    describe('containsAnyUploadedAttachments', () => {
        let uploadedAttachment: Attachment;
        let failedAttachment: Attachment;

        beforeEach(() => {
            uploadedAttachment = getAttachmentFromFile(fileMock);
            uploadedAttachment.uploaded = true;
            failedAttachment = getAttachmentFromFile(fileMock);
            failedAttachment.uploaded = false;
            failedAttachment.pending = false;
        });

        it('should return true if the provided list contains any successfully uploaded attachments', () => {
            expect(containsAnyUploadedAttachments([uploadedAttachment, failedAttachment])).toBe(true);
        });

        it('should return false if the provided list contains no successfully uploaded attachments', () => {
            expect(containsAnyUploadedAttachments([failedAttachment])).toBe(false);
        });

        it('should return false if the provided list is empty', () => {
            expect(containsAnyUploadedAttachments([])).toBe(false);
        });
    });
});
