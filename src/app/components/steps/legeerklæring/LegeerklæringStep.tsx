import * as React from 'react';
import { useIntl, } from 'react-intl';
import { useFormikContext, } from 'formik';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment, } from 'common/types/Attachment';
import { mapFileToPersistedFile, } from 'common/utils/attachmentUtils';
import intlHelper from 'common/utils/intlUtils';
import { persist, } from '../../../api/api';
import { StepConfigProps, StepID, } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData, } from '../../../types/PleiepengesøknadFormData';
import { navigateToLoginPage, } from '../../../utils/navigationUtils';
import { validateLegeerklæring, } from '../../../validation/fieldValidations';
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
                    file: persistedFile
                };
            });
            const valuesToPersist = { ...values, legeerklæring: newValues };
            setFieldValue(AppFormField.legeerklæring, newValues);
            persist(valuesToPersist, StepID.LEGEERKLÆRING);
        }
        ref.current = {
            attachments
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
                    <p>
                        Regelverket for pleiepenger er <strong>ikke</strong> endret i forhold til koronasituasjonen.
                    </p>
                    <p>For å få pleiepenger må barnet</p>
                    <ul>
                        <li style={{ marginBottom: '.5rem' }}>
                            ha vært til behandling eller utredning i sykehus eller annen spesialisthelsetjeneste
                        </li>
                        <li>ha pleie hele tiden på grunn av sykdom</li>
                    </ul>
                    <p>
                        Her skal du laste opp legeerklæring <strong>eller</strong> en bekreftelse på at barnet har vært
                        til behandling/utredning i sykehus eller annen spesialisthelsetjeneste.
                    </p>
                    <p>
                        Vi har forståelse for at det kan være vanskelig å skaffe legeerklæring/bekreftelse på grunn av
                        koronasituasjonen. Hvis du ikke har dokumentasjonen nå, kan du ettersende den.{' '}
                        <Lenke
                            href="https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger/NAV%2009-11.05/ettersendelse"
                            target="_blank">
                            Her får du veiledning til hvordan du ettersender dokumentasjon
                        </Lenke>
                    </p>
                </CounsellorPanel>
            </Box>

            <HelperTextPanel>
                <PictureScanningGuide />
            </HelperTextPanel>

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
