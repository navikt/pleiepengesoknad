import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { getNextStepRoute } from '../../../utils/routeUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FileUploadErrors from '../../file-upload-errors/FileUploadErrors';
import { validateLegeerklæring } from '../../../validation/fieldValidations';
import HelperTextPanel from '../../helper-text-panel/HelperTextPanel';
import Box from '../../box/Box';

interface LegeerklæringStepProps {
    handleSubmit: () => void;
}

type Props = LegeerklæringStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.LEGEERKLÆRING);

const LegeerklæringStep = ({ history, ...stepProps }: Props) => {
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
                Legeerklæringen er på side to (punkt 5) i papirsøknaden som du har fått fra legen. Det er nok at du tar
                bilde og laster opp den delen av søknaden.
            </HelperTextPanel>
            <Box margin="l">
                <FormikFileUploader
                    name={Field.legeerklæring}
                    label="Last opp bilde av legeerklæringen (maks 3 bilder)"
                    onErrorUploadingAttachments={setFilesThatDidntGetUploaded}
                    onFileInputClick={() => {
                        setFilesThatDidntGetUploaded([]);
                    }}
                    validate={validateLegeerklæring}
                />
            </Box>
            <FileUploadErrors filesThatDidntGetUploaded={filesThatDidntGetUploaded} />
            <LegeerklæringFileList wrapNoAttachmentsInBox={true} includeDeletionFunctionality={true} />
        </FormikStep>
    );
};

export default LegeerklæringStep;
