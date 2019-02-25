export const VALID_EXTENSIONS = ['pdf', 'jpeg', 'jpg', 'png'];

export const fileExtensionIsValid = (filename: string): boolean => {
    const ext = filename.split('.').pop();
    return VALID_EXTENSIONS.includes(ext!);
};

export const getAttachmentFromFile = (file: File): Attachment => ({
    file,
    pending: false,
    uploaded: false
});

export const getPendingAttachmentFromFile = (file: File): Attachment => {
    const newAttachment = getAttachmentFromFile(file);
    newAttachment.pending = true;
    return newAttachment;
};

export const attachmentUploadHasFailed = ({ pending, uploaded }: Attachment): boolean => !pending && !uploaded;

export const containsAnyUploadedAttachments = (attachmentList: Attachment[]) =>
    attachmentList &&
    attachmentList.length > 0 &&
    attachmentList.length !== attachmentList.filter(attachmentUploadHasFailed).length;
