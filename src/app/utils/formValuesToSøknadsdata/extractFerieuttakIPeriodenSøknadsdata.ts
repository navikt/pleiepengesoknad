import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { FerieuttakIPeriodenSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractFerieuttakIPeriodenSøknadsdata = ({
    skalTaUtFerieIPerioden,
    ferieuttakIPerioden,
}: Partial<SøknadFormValues>): FerieuttakIPeriodenSøknadsdata | undefined => {
    if (skalTaUtFerieIPerioden && skalTaUtFerieIPerioden === YesOrNo.YES && ferieuttakIPerioden) {
        return {
            type: 'skalTaUtFerieSøknadsdata',
            skalTaUtFerieIPerioden: true,
            ferieuttak: ferieuttakIPerioden,
        };
    }

    if (skalTaUtFerieIPerioden && skalTaUtFerieIPerioden === YesOrNo.NO) {
        return {
            type: 'skalIkkeTaUtFerieSøknadsdata',
            skalTaUtFerieIPerioden: false,
        };
    }

    return undefined;
};
