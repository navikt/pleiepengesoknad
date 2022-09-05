import { OpptjeningIUtlandetApi } from '../../types/søknad-api-data/SøknadApiData';
import { OpptjeningUtlandSøknadsdata } from '../../types/søknadsdata/opptjeningUtlandSøknadsdata';
import { getCountryName } from '@navikt/sif-common-formik/lib';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';

export const getOpptjeningIUtlandetSøknadsdata = (
    locale: string,
    opptjeningUtland?: OpptjeningUtlandSøknadsdata
): OpptjeningIUtlandetApi[] => {
    if (opptjeningUtland?.type === 'harOpptjeningUtland') {
        const apiData: OpptjeningIUtlandetApi[] = opptjeningUtland.opptjeningUtland.map((opptjening) => ({
            navn: opptjening.navn,
            opptjeningType: opptjening.opptjeningType,
            land: {
                landnavn: getCountryName(opptjening.landkode, locale),
                landkode: opptjening.landkode,
            },
            fraOgMed: formatDateToApiFormat(opptjening.fom),
            tilOgMed: formatDateToApiFormat(opptjening.tom),
        }));

        return apiData;
    }

    return [];
};
