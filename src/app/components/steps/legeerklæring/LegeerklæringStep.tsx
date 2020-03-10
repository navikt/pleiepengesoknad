import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';

const LegeerklæringStep = ({ onValidSubmit }: StepConfigProps) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();
    const isRunningDemoMode = appIsRunningInDemoMode();
    const attachments: Attachment[] = values ? values[AppFormField.legeerklæring] : [];
    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={
                onValidSubmit
                /*() => {
                const formData = {
                    ...values,
                    [AppFormField.legeerklæring]: attachments.map((a) => ({
                        ...a,
                        file: mapFileToPersistedFile(a.file)
                    }))
                };
                persist(formData, StepID.LEGEERKLÆRING);
                if (nextStepRoute) {
                    history.push(nextStepRoute);
                }
            }*/
            }
            useValidationErrorSummary={false}
            skipValidation={isRunningDemoMode}
            buttonDisabled={hasPendingUploads}>
            {isRunningDemoMode && (
                <Box>
                    <AlertStripeInfo>
                        Opplasting av legeerklæring er ikke tilgjengelig i demo versjon. Du kan klikke Fortsett.
                    </AlertStripeInfo>
                </Box>
            )}
            {false === isRunningDemoMode && (
                <>
                    <Box padBottom="xl">
                        <CounsellorPanel>
                            <p>
                                <FormattedHTMLMessage id="steg.lege.intro.1.html" />
                            </p>
                            <p>
                                <FormattedHTMLMessage id="steg.lege.intro.2.html" />
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
                </>
            )}
        </FormikStep>
    );
};

export default LegeerklæringStep;
