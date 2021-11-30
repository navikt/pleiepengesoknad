import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';

export const getFerieuttakIPeriodenApiData = ({
    skalTaUtFerieIPerioden,
    ferieuttakIPerioden,
}: SøknadFormData): Pick<SøknadApiData, 'ferieuttakIPerioden'> => ({
    ferieuttakIPerioden: {
        skalTaUtFerieIPerioden: skalTaUtFerieIPerioden === YesOrNo.YES,
        ferieuttak:
            skalTaUtFerieIPerioden === YesOrNo.YES && ferieuttakIPerioden
                ? ferieuttakIPerioden.map((uttak) => ({
                      fraOgMed: formatDateToApiFormat(uttak.fom),
                      tilOgMed: formatDateToApiFormat(uttak.tom),
                  }))
                : [],
    },
});
