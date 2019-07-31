import * as React from 'react';
import { ArrayHelpers, connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import FileInput from '../file-input/FileInput';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import {
    attachmentShouldBeProcessed,
    attachmentShouldBeUploaded,
    attachmentUploadHasFailed,
    getPendingAttachmentFromFile,
    VALID_EXTENSIONS
} from '../../utils/attachmentUtils';
import { uploadFile } from '../../api/api';
import { FieldArrayPushFn, FieldArrayReplaceFn, FormikValidateFunction } from '../../types/FormikProps';
import * as apiUtils from '../../utils/apiUtils';

interface FormikFileUploader {
    name: Field;
    label: string;
    validate?: FormikValidateFunction;
    onFileInputClick?: () => void;
    onErrorUploadingAttachments: (files: File[]) => void;
    onUnauthorizedOrForbiddenUpload: () => void;
}

type Props = FormikFileUploader & ConnectedFormikProps<Field>;

const FormikFileUploader: React.FunctionComponent<Props> = ({
    name,
    formik: { values },
    onFileInputClick,
    onErrorUploadingAttachments,
    onUnauthorizedOrForbiddenUpload,
    ...otherProps
}) => {
    async function uploadAttachment(attachment: Attachment) {
        try {
            const response = await uploadFile(attachment.file);
            attachment = setAttachmentPendingToFalse(attachment);
            attachment.url = response.headers.location;
            attachment.uploaded = true;
        } catch (error) {
            if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                onUnauthorizedOrForbiddenUpload();
            }
            setAttachmentPendingToFalse(attachment);
        }
    }

    async function uploadAttachments(allAttachments: Attachment[], replaceFn: FieldArrayReplaceFn) {
        const attachmentsToProcess = findAttachmentsToProcess(allAttachments);
        const attachmentsToUpload = findAttachmentsToUpload(attachmentsToProcess);
        const attachmentsNotToUpload = attachmentsToProcess.filter((el) => !attachmentsToUpload.includes(el));

        for (const attachment of attachmentsToUpload) {
            await uploadAttachment(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        }

        const failedAttachments = [...attachmentsNotToUpload, ...attachmentsToUpload.filter(attachmentUploadHasFailed)];
        updateFailedAttachments(allAttachments, failedAttachments, replaceFn);
    }

    function updateFailedAttachments(
        allAttachments: Attachment[],
        failedAttachments: Attachment[],
        replaceFn: FieldArrayReplaceFn
    ) {
        failedAttachments.forEach((attachment) => {
            attachment = setAttachmentPendingToFalse(attachment);
            updateAttachmentListElement(allAttachments, attachment, replaceFn);
        });
        onErrorUploadingAttachments(failedAttachments.map(({ file }) => file));
    }

    function findAttachmentsToProcess(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeProcessed);
    }

    function findAttachmentsToUpload(attachments: Attachment[]): Attachment[] {
        return attachments.filter(attachmentShouldBeUploaded);
    }

    function updateAttachmentListElement(
        attachments: Attachment[],
        attachment: Attachment,
        replaceFn: FieldArrayReplaceFn
    ) {
        replaceFn(attachments.indexOf(attachment), attachment);
    }

    function setAttachmentPendingToFalse(attachment: Attachment) {
        attachment.pending = false;
        return attachment;
    }

    function addPendingAttachmentToFieldArray(file: File, pushFn: FieldArrayPushFn) {
        const attachment = getPendingAttachmentFromFile(file);
        pushFn(attachment);
        return attachment;
    }

    return (
        <FileInput
            name={name}
            acceptedExtensions={VALID_EXTENSIONS.join(', ')}
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
