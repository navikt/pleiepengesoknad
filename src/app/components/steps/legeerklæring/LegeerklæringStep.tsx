import * as React from 'react';
import { useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FileUploadErrors from 'common/components/file-upload-errors/FileUploadErrors';
import HelperTextPanel from 'common/components/helper-text-panel/HelperTextPanel';
import PictureScanningGuide from 'common/components/picture-scanning-guide/PictureScanningGuide';
import { Attachment } from 'common/types/Attachment';
import { HistoryProps } from 'common/types/History';
import { mapFileToPersistedFile } from 'common/utils/attachmentUtils';
import intlHelper from 'common/utils/intlUtils';
import { persist } from '../../../api/api';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { navigateToLoginPage } from '../../../utils/navigationUtils';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';

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
                                Regelverket for pleiepenger er <strong>ikke</strong> endret i forhold til
                                koronasituasjonen.
                            </p>
                            <p>For å få pleiepenger må barnet</p>
                            <ul>
                                <li style={{ marginBottom: '.5rem' }}>
                                    ha vært til behandling eller utredning i sykehus eller annen spesialisthelsetjeneste
                                </li>
                                <li>ha pleie hele tiden på grunn av sykdom</li>
                            </ul>
                            <p>
                                Her skal du laste opp legeerklæring <strong>eller</strong> en bekreftelse på at barnet
                                har vært til behandling/utredning i sykehus eller annen spesialisthelsetjeneste.
                            </p>
                            <p>
                                Vi har forståelse for at det kan være vanskelig å skaffe legeerklæring/bekreftelse på
                                grunn av koronasituasjonen. Hvis du ikke har dokumentasjonen nå, kan du ettersende den.{' '}
                                <Lenke href="https://www.nav.no/soknader/nb/person/familie/pleiepenger-og-opplaringspenger/NAV%2009-11.05/ettersendelse">
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
                </>
            )}
        </FormikStep>
    );
};

export default LegeerklæringStep;
