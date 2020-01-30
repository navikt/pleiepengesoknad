import { Attachment, PersistedFile } from '../types/Attachment';

export const VALID_EXTENSIONS = ['.pdf', '.jpeg', '.jpg', '.png'];

export const fileExtensionIsValid = (filename: string): boolean => {
    const ext = filename.split('.').pop();
    return VALID_EXTENSIONS.includes(`.${ext!.toLowerCase()}`);
};

export const isFileObject = (file: File | PersistedFile): file is File => (file as any).isPersistedFile !== true;

export const mapFileToPersistedFile = ({
    name,
    lastModified,
    type,
    size,
    ...rest
}: File | PersistedFile): PersistedFile => ({
    isPersistedFile: true,
    name,
    lastModified,
    type,
    size
});

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

export const attachmentShouldBeProcessed = ({ pending, uploaded }: Attachment): boolean => pending && !uploaded;

export const attachmentShouldBeUploaded = (attachment: Attachment): boolean =>
    attachmentShouldBeProcessed(attachment) && fileExtensionIsValid(attachment.file.name);

export const attachmentUploadHasFailed = ({ pending, uploaded, file: { name } }: Attachment): boolean =>
    (!pending && !uploaded) || !fileExtensionIsValid(name);

export const attachmentHasBeenUploaded = ({ pending, uploaded, file: { name } }: Attachment): boolean =>
    !pending && uploaded && fileExtensionIsValid(name);

export const containsAnyUploadedAttachments = (attachmentList: Attachment[]) =>
    attachmentList &&
    attachmentList.length > 0 &&
    attachmentList.length !== attachmentList.filter(attachmentUploadHasFailed).length;
