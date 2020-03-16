import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import Box from 'common/components/box/Box';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import { persist } from '../../../api/api';
import { mapFileToPersistedFile } from 'common/utils/attachmentUtils';

type Props = { formikProps: PleiepengesøknadFormikProps } & CommonStepFormikProps & HistoryProps & StepConfigProps;

const LegeerklæringStep = ({ history, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);
    const intl = useIntl();
    const isRunningDemoMode = appIsRunningInDemoMode();
    const { values } = formikProps;
    const attachments: Attachment[] = values ? values[AppFormField.legeerklæring] : [];
    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;

    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={() => {
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
            }}
            history={history}
            useValidationErrorSummary={false}
            skipValidation={true}
            buttonDisabled={hasPendingUploads}
            {...stepProps}>
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
