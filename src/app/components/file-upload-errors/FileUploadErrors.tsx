import * as React from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

interface FileUploadErrorsProps {
    filesThatDidntGetUploaded: File[];
}

const FileUploadErrors: React.FunctionComponent<FileUploadErrorsProps> = ({ filesThatDidntGetUploaded }) => {
    if (filesThatDidntGetUploaded.length === 0) {
        return null;
    }

    return (
        <AlertStripeAdvarsel>
            Det har dessverre skjedd en feil under opplasting av følgende vedlegg:
            <ul>
                {filesThatDidntGetUploaded.map(({ name }) => (
                    <li key={name}>{name}</li>
                ))}
            </ul>
        </AlertStripeAdvarsel>
    );
};

export default FileUploadErrors;
