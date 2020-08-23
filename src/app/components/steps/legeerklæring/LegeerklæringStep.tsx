import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Lenke from 'nav-frontend-lenker';
import Box from '@sif-common/core/components/box/Box';
import CounsellorPanel from '@sif-common/core/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from '@sif-common/core/components/file-upload-errors/FileUploadErrors';
import PictureScanningGuide from '@sif-common/core/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from '@sif-common/core/types/Attachment';
import { mapFileToPersistedFile } from '@sif-common/core/utils/attachmentUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { persist } from '../../../api/api';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';

const LegeerklæringStep = ({ onValidSubmit }: StepConfigProps) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const { values, setFieldValue } = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const attachments: Attachment[] = values ? values[AppFormField.legeerklæring] : [];
    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;

    const ref = React.useRef({ attachments });

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
    }, [attachments]);

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={() => {
                onValidSubmit();
            }}
            useValidationErrorSummary={false}
            skipValidation={true}
            buttonDisabled={hasPendingUploads}>
            <Box padBottom="xl">
                <CounsellorPanel>
                    <Box padBottom={'l'}>
                        <FormattedMessage id={'steg.legeerklaering.counsellorpanel.3.1'} />
                        <FormattedMessage id={'steg.legeerklaering.counsellorpanel.3.2'} />
                        <FormattedMessage id={'steg.legeerklaering.counsellorpanel.3.3'} />
                    </Box>

                    <Box padBottom={'l'}>
                        <FormattedMessage id={'steg.legeerklaering.counsellorpanel.4'} />
                        <Lenke
                            href="https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger/NAV%2009-11.05/ettersendelse"
                            target="_blank"
                            rel={'noopener'}>
                            <FormattedMessage id={'steg.legeerklaering.counsellorpanel.4.1'} />
                        </Lenke>
                    </Box>
                </CounsellorPanel>
            </Box>

            <Box margin={'l'}>
                <PictureScanningGuide />
            </Box>

            <Box margin="l">
                <FormikFileUploader
                    name={AppFormField.legeerklæring}
                    label={intlHelper(intl, 'steg.lege.vedlegg')}
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={() => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    validate={validateLegeerklæring}
                    onUnauthorizedOrForbiddenUpload={navigateToLoginPage}
                />
            </Box>
            <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </FormikStep>
    );
};

export default LegeerklæringStep;
