import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FerieuttakIPeriodenApiData } from '../../types/søknad-api-data/SøknadApiData';
import { FerieuttakIPeriodenSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const getFerieuttakIPeriodenApiDataFromSøknadsdata = (
    ferieuttakIPerioden?: FerieuttakIPeriodenSøknadsdata
): FerieuttakIPeriodenApiData => {
    if (ferieuttakIPerioden === undefined) {
        throw Error('ferieuttakIPeriodenSøknadsdata undefined');
    }

    switch (ferieuttakIPerioden?.type) {
        case 'skalTaUtFerieSøknadsdata':
            const { ferieuttak } = ferieuttakIPerioden;

            if (ferieuttak.length === 0) {
                throw Error('ferieuttak er tomt');
            }
            return {
                skalTaUtFerieIPerioden: true,
                ferieuttak: ferieuttakIPerioden.ferieuttak.map((uttak) => ({
                    fraOgMed: formatDateToApiFormat(uttak.fom),
                    tilOgMed: formatDateToApiFormat(uttak.tom),
                })),
            };
        case 'skalIkkeTaUtFerieSøknadsdata':
            return {
                skalTaUtFerieIPerioden: false,
                ferieuttak: [],
            };
    }
};
