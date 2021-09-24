import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

export const getFerieuttakIPeriodenApiData = ({
    skalTaUtFerieIPerioden,
    ferieuttakIPerioden,
}: PleiepengesøknadFormData): Pick<PleiepengesøknadApiData, 'ferieuttakIPerioden'> => ({
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
