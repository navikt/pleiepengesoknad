import * as React from 'react';
import { ArrayHelpers, connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import FileInput from '../file-input/FileInput';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { getAttachmentFromFile } from '../../utils/attachmentUtils';
import { uploadFile } from '../../api/api';

interface FormikFileUploader {
    name: Field;
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

type Props = FormikFileUploader & ConnectedFormikProps<Field>;

const FormikFileUploader: React.FunctionComponent<Props> = ({ name, formik: { values }, ...otherProps }) => {
    return (
        <FileInput
            name={name}
            onFilesSelect={async (files: File[], { push, replace }: ArrayHelpers) => {
                const attachments = files.map((file) => {
                    const attachment = getAttachmentFromFile(file);
                    attachment.pending = true;
                    push(attachment);
                    return attachment;
                });

                async function uploadFiles() {
                    const allAttachments = [...values[name], ...attachments];
                    for (const attachment of [...values[name], ...attachments]) {
                        if (!attachment.uploaded && attachment.pending) {
                            const response = await uploadFile(attachment.file);
                            attachment.url = response.headers.location;
                            attachment.pending = false;
                            attachment.uploaded = true;
                            replace(allAttachments.indexOf(attachment), attachment);
                        }
                    }
                }

                await uploadFiles();
            }}
            {...otherProps}
        />
    );
};

export default connect<FormikFileUploader, Field>(FormikFileUploader);
