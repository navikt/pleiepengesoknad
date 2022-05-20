import { ApiError, useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import { useFormikContext } from 'formik';
import { History } from 'history';
import { persist as apiPersist } from '../api/api';
import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';

function usePersistSoknad(history: History) {
    const { logUserLoggedOut, logApiError } = useAmplitudeInstance();
    const { values } = useFormikContext<SøknadFormData>();

    async function doPersist(stepID: StepID) {
        apiPersist(values, stepID).catch((error: AxiosError) => {
            if (apiUtils.isUnauthorized(error)) {
                logUserLoggedOut('Mellomlagring ved navigasjon');
                relocateToLoginPage();
            } else {
                logApiError(ApiError.mellomlagring, { stepID });
                return navigateToErrorPage(history);
            }
        });
    }

    const persist = (stepID: StepID) => {
        doPersist(stepID);
    };

    return { persist };
}

export default usePersistSoknad;
