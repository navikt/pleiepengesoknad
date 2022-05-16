import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';

export const getAttachmentsApiDataFromSøknadsdata = (attachments: Attachment[]): string[] => {
    const apiData: string[] = [];
    attachments
        .filter((attachment) => !attachmentUploadHasFailed(attachment))
        .forEach((a) => {
            if (a.url) {
                apiData.push(a.url);
            }
        });
    return apiData;
};
