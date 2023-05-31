import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { SøknadFormValues, SøknadFormField } from '../../types/SøknadFormValues';
import { useFormikContext } from 'formik';
import PictureScanningGuide from '@navikt/sif-common-core-ds/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core-ds/lib/types/Attachment';
import { Undertittel } from 'nav-frontend-typografi';
import {
    getTotalSizeOfAttachments,
    mapFileToPersistedFile,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core-ds/lib/utils/attachmentUtils';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import { relocateToLoginPage } from '../../utils/navigationUtils';
import { StepID } from '../søknadStepsConfig';
import { persist } from '../../api/api';
import FormikFileUploader from '../../components/formik-file-uploader/FormikFileUploader';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import FileUploadErrors from '@navikt/sif-common-core-ds/lib/components/file-upload-errors/FileUploadErrors';
import getLenker from '../../lenker';
import UploadedDocumentsList from '../../components/fødselsattest-file-list/UploadedDocumentsList';

interface Props {
    attachments: Attachment[];
}

const FødselsattestPart: React.FC<Props> = ({ attachments }) => {
    const intl = useIntl();
    const { values, setFieldValue } = useFormikContext<SøknadFormValues>();
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const totalSize = getTotalSizeOfAttachments(attachments);
    const ref = React.useRef({ attachments });

    const { logHendelse, logUserLoggedOut } = useAmplitudeInstance();

    const vedleggOpplastingFeilet = async (files?: File[]) => {
        if (files) {
            if (files.length > 0) {
                await logHendelse(
                    ApplikasjonHendelse.vedleggOpplastingFeilet,
                    files.map((f) => {
                        const { size, type } = f;
                        return {
                            type,
                            size,
                        };
                    })
                );
            }
            setFilesThatDidntGetUploaded(files);
        }
    };

    const userNotLoggedIn = async () => {
        await logUserLoggedOut('Opplasting av dokument');
        relocateToLoginPage();
    };

    React.useEffect(() => {
        const hasPendingAttachments = attachments.find((a) => a.pending === true);
        if (hasPendingAttachments) {
            return;
        }
        if (attachments.length !== ref.current.attachments.length) {
            const newValues = attachments.map((a) => {
                const persistedFile = mapFileToPersistedFile(a.file);
                return {
                    ...a,
                    file: persistedFile,
                };
            });
            const valuesToPersist = { ...values, fødselsattest: newValues };
            setFieldValue(SøknadFormField.fødselsattest, newValues);
            persist({ formValues: valuesToPersist, lastStepID: StepID.OPPLYSNINGER_OM_BARNET });
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, values]);

    return (
        <>
            <Undertittel tag="h2" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
                {intlHelper(intl, 'steg.omBarnet.fødselsattest.tittel')}
            </Undertittel>
            <Block margin="m">
                <FormattedMessage id="steg.omBarnet.fødselsattest.info" />
            </Block>
            <Block margin={'l'}>
                <PictureScanningGuide />
            </Block>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Block margin="l">
                    <FormikFileUploader
                        name={SøknadFormField.fødselsattest}
                        label={intlHelper(intl, 'steg.omBarnet.fødselsattest.vedlegg')}
                        onErrorUploadingAttachments={vedleggOpplastingFeilet}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        // validate={validateLegeerklæring}
                        onUnauthorizedOrForbiddenUpload={userNotLoggedIn}
                    />
                </Block>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Block margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.1'} />
                        <Lenke target={'_blank'} rel={'noopener noreferrer'} href={getLenker(intl.locale).ettersend}>
                            <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.2'} />
                        </Lenke>
                    </AlertStripeAdvarsel>
                </Block>
            )}
            <Block margin={'l'}>
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Block>
            <Block margin="l">
                <UploadedDocumentsList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
            </Block>
        </>
    );
};

export default FødselsattestPart;
