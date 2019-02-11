import * as React from 'react';
import { connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import FileInput from '../file-input/FileInput';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { getAttachmentFromFile } from '../../utils/attachmentUtils';
import { uploadFile } from '../../api/api';

interface LegeerklæringFileUploaderProps {
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

type Props = LegeerklæringFileUploaderProps & ConnectedFormikProps<Field>;

const LegeerklæringFileUploader: React.FunctionComponent<Props> = ({
    formik: { setFieldValue, values },
    ...otherProps
}) => {
    return (
        <FileInput
            name={Field.legeerklæring}
            onFilesSelect={(files: File[]) => {
                for (const file of files) {
                    const attachment = getAttachmentFromFile(file);
                    setFieldValue(Field.legeerklæring, [
                        ...values[Field.legeerklæring],
                        { ...attachment, pending: true }
                    ]);
                    uploadFile(file).then((response) => {
                        const url = response.headers.location;
                        setFieldValue(Field.legeerklæring, [
                            ...values[Field.legeerklæring],
                            { ...attachment, pending: false, uploaded: true, url }
                        ]);
                    });
                }
            }}
            {...otherProps}
        />
    );
};

export default connect<LegeerklæringFileUploaderProps, Field>(LegeerklæringFileUploader);
