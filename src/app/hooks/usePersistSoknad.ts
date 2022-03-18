import { useAmplitudeInstance } from '@navikt/sif-common-amplitude/lib';
import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { useFormikContext } from 'formik';
import { History } from 'history';
import { persist as apiPersist } from '../api/api';
import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { navigateToErrorPage, relocateToLoginPage } from '../utils/navigationUtils';

function usePersistSoknad(history: History) {
    const { logUserLoggedOut } = useAmplitudeInstance();
    const { values } = useFormikContext<SøknadFormData>();

    async function doPersist(stepID: StepID) {
        apiPersist(values, stepID).catch((error) => {
            if (apiUtils.isUnauthorized(error)) {
                logUserLoggedOut('Mellomlagring ved navigasjon');
                relocateToLoginPage();
            } else {
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
