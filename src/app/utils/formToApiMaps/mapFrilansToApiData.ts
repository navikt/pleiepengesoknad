/* eslint-disable @typescript-eslint/camelcase */
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { formatDateToApiFormat } from '@sif-common/core/utils/dateUtils';
import { FrilansApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

export const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiData | undefined => {
    const { frilans_jobberFortsattSomFrilans } = formData;
    const frilans_startdato = ISOStringToDate(formData.frilans_startdato);

    if (frilans_jobberFortsattSomFrilans && frilans_startdato) {
        const data: FrilansApiData = {
            startdato: formatDateToApiFormat(frilans_startdato),
            jobberFortsattSomFrilans: frilans_jobberFortsattSomFrilans === YesOrNo.YES,
        };
        return data;
    }
    return undefined;
};
