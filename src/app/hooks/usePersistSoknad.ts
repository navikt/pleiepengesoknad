import { useHistory } from 'react-router';
import { ApiError, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import { useFormikContext } from 'formik';
import { useSøknadsdataContext } from '../søknad/SøknadsdataContext';
import { ImportertSøknadMetadata } from '../types/ImportertSøknad';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';
import mellomlagringEndpoint, { UserHashInfo } from '../api/endpoints/mellomlagringEndpoint';
import { StepID } from '../søknad/søknadStepsConfig';

interface PersistSoknadProps {
    søknadId: string;
    stepID: StepID;
    søkerInfo: UserHashInfo;
    formValues?: SøknadFormValues;
    importertSøknadMetadata?: ImportertSøknadMetadata;
}

function usePersistSoknad() {
    const { logUserLoggedOut, logApiError } = useAmplitudeInstance();
    const { history } = useHistory();
    const { values: stateFormValues } = useFormikContext<SøknadFormValues>();
    // const søkerdata = useContext(SøkerdataContext);
    const { importertSøknadMetadata: stateImportertSøknadMetadata } = useSøknadsdataContext();

    async function doPersist({ søknadId, stepID, formValues, importertSøknadMetadata, søkerInfo }: PersistSoknadProps) {
        mellomlagringEndpoint
            .update({
                søknadId,
                formValues: formValues || stateFormValues,
                lastStepID: stepID,
                søkerInfo,
                importertSøknadMetadata: importertSøknadMetadata || stateImportertSøknadMetadata,
            })
            .catch((error: AxiosError) => {
                if (apiUtils.isUserLoggedOut(error)) {
                    logUserLoggedOut('Lagre mellomlagring');
                    relocateToLoginPage();
                } else {
                    logApiError(ApiError.mellomlagring, { stepID });
                    return navigateToErrorPage(history);
                }
            });
    }

    const persistSoknad = async (props: PersistSoknadProps) => {
        return doPersist(props);
    };

    return { persistSoknad };
}

export default usePersistSoknad;
