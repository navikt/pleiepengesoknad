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
