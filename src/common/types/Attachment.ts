export interface Attachment {
    file: File;
    pending: boolean;
    uploaded: boolean;
    url?: string;
}
