import { YesOrNo } from '@navikt/sif-common/lib/common/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { FrilansApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

export const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiData | undefined => {
    const {
        frilans_harHattOppdragForFamilieVenner,
        frilans_jobberFortsattSomFrilans,
        frilans_harInntektSomFosterforelder,
        frilans_startdato,
        frilans_oppdrag
    } = formData;

    if (
        frilans_harHattOppdragForFamilieVenner &&
        frilans_jobberFortsattSomFrilans &&
        frilans_harInntektSomFosterforelder &&
        frilans_startdato &&
        frilans_oppdrag
    ) {
        const data: FrilansApiData = {
            har_hatt_oppdrag_for_familie: frilans_harHattOppdragForFamilieVenner === YesOrNo.YES,
            har_hatt_inntekt_som_fosterforelder: frilans_harInntektSomFosterforelder === YesOrNo.YES,
            startdato: formatDateToApiFormat(frilans_startdato),
            jobber_fortsatt_som_frilans: frilans_harInntektSomFosterforelder === YesOrNo.YES,
            oppdrag: frilans_oppdrag.map(({ fom, tom, erPågående, arbeidsgiverNavn }) => {
                return {
                    arbeidsgivernavn: arbeidsgiverNavn,
                    fra_og_med: formatDateToApiFormat(fom),
                    til_og_med: erPågående || tom === undefined ? null : formatDateToApiFormat(tom),
                    er_pagaende: erPågående
                };
            })
        };
        return data;
    }
    return undefined;
};
