/* eslint-disable @typescript-eslint/camelcase */
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { FrilansApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

export const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiData | undefined => {
    const { frilans_jobberFortsattSomFrilans, frilans_startdato } = formData;

    if (frilans_jobberFortsattSomFrilans && frilans_startdato) {
        const data: FrilansApiData = {
            startdato: frilans_startdato,
            jobberFortsattSomFrilans: frilans_jobberFortsattSomFrilans === YesOrNo.YES,
        };
        return data;
    }
    return undefined;
};
