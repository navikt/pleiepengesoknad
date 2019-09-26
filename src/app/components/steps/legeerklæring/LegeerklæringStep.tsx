import * as React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { getNextStepRoute } from '../../../utils/routeUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import HelperTextPanel from '../../helper-text-panel/HelperTextPanel';
import Box from '../../box/Box';
import intlHelper from 'app/utils/intlUtils';

interface LegeerklæringStepProps {
    handleSubmit: () => void;
}

type Props = LegeerklæringStepProps & HistoryProps & WrappedComponentProps;
const nextStepRoute = getNextStepRoute(StepID.LEGEERKLÆRING);

const LegeerklæringStep = ({ history, intl, ...stepProps }: Props) => {
    const [filesThatDidntGetUploaded, setFilesThatDidntGetUploaded] = React.useState<File[]>([]);

    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep
            id={StepID.LEGEERKLÆRING}
            onValidFormSubmit={navigate}
            history={history}
            useValidationErrorSummary={false}
            {...stepProps}>
            <HelperTextPanel>
                <FormattedMessage id="steg.lege.info" />
            </HelperTextPanel>
            <Box margin="l">
                <FormikFileUploader
                    name={Field.legeerklæring}
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

export default injectIntl(LegeerklæringStep);
