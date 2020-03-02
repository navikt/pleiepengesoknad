import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { FrilansApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

export const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiData | undefined => {
    const { frilans_jobberFortsattSomFrilans, frilans_startdato } = formData;

    if (frilans_jobberFortsattSomFrilans && frilans_startdato) {
        const data: FrilansApiData = {
            startdato: formatDateToApiFormat(frilans_startdato),
            jobber_fortsatt_som_frilans: frilans_jobberFortsattSomFrilans === YesOrNo.YES
        };
        return data;
    }
    return undefined;
};
