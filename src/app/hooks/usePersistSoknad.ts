// import { History } from 'history';
import { useHistory } from 'react-router';
import { ApiError, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import { useFormikContext } from 'formik';
import { persist } from '../api/api';
import { useSøknadsdataContext } from '../søknad/SøknadsdataContext';
import { StepID } from '../søknad/søknadStepsConfig';
import { ImportertSøknadMetadata } from '../types/ImportertSøknad';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';

interface PersistSoknadProps {
    stepID?: StepID;
    formValues?: SøknadFormValues;
    importertSøknadMetadata?: ImportertSøknadMetadata;
}

/**
 * Oppdaterer mellomlagring med innsendte verdier eller verdier som hentes ut fra context
 */

function usePersistSoknad() {
    const { logUserLoggedOut, logApiError } = useAmplitudeInstance();
    const { history } = useHistory();
    const { values: stateFormValues } = useFormikContext<SøknadFormValues>();
    const { importertSøknadMetadata: stateImportertSøknadMetadata } = useSøknadsdataContext();

    // console.log(stateImportertSøknadMetadata);

    async function doPersist({ stepID, formValues, importertSøknadMetadata }: PersistSoknadProps) {
        persist({
            formValues: formValues || stateFormValues,
            lastStepID: stepID,
            importertSøknadMetadata: importertSøknadMetadata || stateImportertSøknadMetadata,
        }).catch((error: AxiosError) => {
            if (apiUtils.isUnauthorized(error)) {
                logUserLoggedOut('Lagre mellomlagring');
                relocateToLoginPage();
            } else {
                logApiError(ApiError.mellomlagring, { stepID });
                return navigateToErrorPage(history);
            }
        });
    }

    const persistSoknad = async ({ stepID, formValues, importertSøknadMetadata }: PersistSoknadProps) => {
        return doPersist({ stepID, formValues, importertSøknadMetadata });
    };

    return { persistSoknad };
}

export default usePersistSoknad;
