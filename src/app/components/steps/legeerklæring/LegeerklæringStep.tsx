import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ApplikasjonHendelse, useAmplitudeInstance } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from '@navikt/sif-common-core/lib/components/file-upload-errors/FileUploadErrors';
import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    getTotalSizeOfAttachments,
    mapFileToPersistedFile,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useFormikContext } from 'formik';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Knapp from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { persist, verifyAttachmentsOnServer } from '../../../api/api';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import getLenker from '../../../lenker';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { apiUtils } from '../../../utils/apiUtils';
import { relocateToLoginPage } from '../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';
import { pluralize } from '../../pages/confirmation-page/ConfirmationPage';

const LegeerklæringStep = ({ onValidSubmit }: StepConfigProps) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<Array<File>>([]);
    const [missingFiles, setMissingFiles] = React.useState<Attachment[]>([]);
    const { values, setFieldValue } = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const attachments: Attachment[] = React.useMemo(() => {
        return values ? values[AppFormField.legeerklæring] : [];
    }, [values]);
    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const totalSize = getTotalSizeOfAttachments(attachments);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

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

    const verifyAttachmentsThenSubmit = async () => {
        if (values.legeerklæring.length > 0) {
            verifyAttachmentsOnServer(values.legeerklæring).then(
                (respons) => {
                    const missingIds = respons.data.missing_attachments;
                    if (missingIds.length > 0) {
                        const missingFiles = values.legeerklæring.filter((a) => {
                            return missingIds.some((id) => id === a.url);
                        });
                        if (missingFiles.length > 0) {
                            setMissingFiles(missingFiles);
                            setFieldValue(
                                AppFormField.legeerklæring,
                                values.legeerklæring.filter((a) => {
                                    return missingIds.some((id) => id !== a.url);
                                })
                            );
                            return;
                        }
                    }
                    setMissingFiles([]);
                    onValidSubmit();
                },
                (error) => {
                    if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
                        userNotLoggedIn();
                    }
                }
            );
        } else {
            onValidSubmit();
        }
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
            const valuesToPersist = { ...values, legeerklæring: newValues };
            setFieldValue(AppFormField.legeerklæring, newValues);
            persist(valuesToPersist, StepID.LEGEERKLÆRING);
        }
        ref.current = {
            attachments,
        };
    }, [attachments, setFieldValue, values]);

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={() => {
                verifyAttachmentsThenSubmit();
            }}
            useValidationErrorSummary={false}
            skipValidation={true}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            <Box padBottom="xl">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id={'steg.legeerklaering.counsellorpanel.1'} />
                    </p>
                    <p>
                        <FormattedMessage id={'steg.legeerklaering.counsellorpanel.2'} />{' '}
                        <Lenke href={getLenker(intl.locale).ettersend} target="_blank" rel={'noopener'}>
                            <FormattedMessage id={'steg.legeerklaering.counsellorpanel.ettersendLenke'} />
                        </Lenke>
                    </p>
                </CounsellorPanel>
            </Box>

            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>
            {totalSize <= MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin="l">
                    <FormikFileUploader
                        name={AppFormField.legeerklæring}
                        label={intlHelper(intl, 'steg.lege.vedlegg')}
                        onErrorUploadingAttachments={vedleggOpplastingFeilet}
                        onFileInputClick={() => {
                            setFilesThatDidntGetUploaded([]);
                        }}
                        validate={validateLegeerklæring}
                        onUnauthorizedOrForbiddenUpload={userNotLoggedIn}
                    />
                </Box>
            )}
            {totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES && (
                <Box margin={'l'}>
                    <AlertStripeAdvarsel>
                        <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.1'} />
                        <Lenke target={'_blank'} rel={'noopener noreferrer'} href={getLenker(intl.locale).ettersend}>
                            <FormattedMessage id={'dokumenter.advarsel.totalstørrelse.2'} />
                        </Lenke>
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin={'l'}>
                <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            </Box>
            <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
            {missingFiles.length > 0 && (
                <Box margin="l">
                    <AlertStripeAdvarsel>
                        <p style={{ marginTop: 0 }}>
                            Det har oppstått en feil med{' '}
                            {pluralize(missingFiles.length, 'ett dokument', `${missingFiles.length} dokumenter`)}. Du må
                            kontrollere listen ovenfor, og sjekke at alle dokumentene du ønsker å sende med søknaden er
                            i listen. Når du har kontrollert listen, kan du fortsette.
                        </p>
                        <p>{pluralize(missingFiles.length, 'Dokumentet', `Dokumentene`)} som hadde feil var:</p>
                        <ul>
                            {missingFiles.map((file) => (
                                <li key={file.url}>{file.file.name}</li>
                            ))}
                        </ul>
                        <Knapp mini={true} htmlType="button" type="standard" onClick={() => setMissingFiles([])}>
                            Ok, skjul denne meldingen
                        </Knapp>
                    </AlertStripeAdvarsel>
                </Box>
            )}
        </FormikStep>
    );
};

export default LegeerklæringStep;
