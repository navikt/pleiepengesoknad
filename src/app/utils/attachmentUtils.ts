export const VALID_EXTENSIONS = ['pdf', 'jpeg', 'jpg', 'png'];

export const fileExtensionIsValid = (filename: string): boolean => {
    const ext = filename.split('.').pop();
    return VALID_EXTENSIONS.includes(ext!);
};

export const getPendingAttachmentFromFile = (file: File): Attachment => ({
    file,
    pending: true,
    uploaded: false
});

export const attachmentUploadHasFailed = ({ pending, uploaded }: Attachment): boolean => !pending && !uploaded;

export const containsAnyUploadedAttachments = (attachmentList: Attachment[]) =>
    attachmentList &&
    attachmentList.length > 0 &&
    attachmentList.length !== attachmentList.filter(attachmentUploadHasFailed).length;
