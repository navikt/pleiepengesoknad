import * as React from 'react';
import { ArrayHelpers, connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import FileInput from '../file-input/FileInput';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { getAttachmentFromFile } from '../../utils/attachmentUtils';
import { uploadFile } from '../../api/api';
import { FieldArrayPushFn, FieldArrayReplaceFn } from '../../types/FormikProps';

interface FormikFileUploader {
    name: Field;
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
    onFileInputClick?: () => void;
    onErrorUploadingAttachments: (attachments: Attachment[]) => void;
}

type Props = FormikFileUploader & ConnectedFormikProps<Field>;

const FormikFileUploader: React.FunctionComponent<Props> = ({
    name,
    formik: { values },
    onFileInputClick,
    onErrorUploadingAttachments,
    ...otherProps
}) => {
    async function uploadAttachment(attachment: Attachment) {
        try {
            const response = await uploadFile(attachment.file);
            attachment.url = response.headers.location;
            attachment.pending = false;
            attachment.uploaded = true;
        } catch (error) {
            attachment.pending = false;
            attachment.uploaded = false;
        }
    }

    async function uploadAttachments(attachmentsToUpload: Attachment[], replaceFn: FieldArrayReplaceFn) {
        for (const attachment of attachmentsToUpload) {
            if (!attachment.uploaded && attachment.pending) {
                await uploadAttachment(attachment);
                replaceFn(attachmentsToUpload.indexOf(attachment), attachment);
                onErrorUploadingAttachments(
                    attachmentsToUpload.filter(({ pending, uploaded }: Attachment) => !pending && !uploaded)
                );
            }
        }
    }

    function addPendingAttachmentToFieldArray(file: File, pushFn: FieldArrayPushFn) {
        const attachment = getAttachmentFromFile(file);
        attachment.pending = true;
        pushFn(attachment);
        return attachment;
    }

    return (
        <FileInput
            name={name}
            onFilesSelect={async (files: File[], { push, replace }: ArrayHelpers) => {
                const attachments = files.map((file) => addPendingAttachmentToFieldArray(file, push));
                await uploadAttachments([...values[name], ...attachments], replace);
            }}
            onClick={onFileInputClick}
            {...otherProps}
        />
    );
};

export default connect<FormikFileUploader, Field>(FormikFileUploader);
