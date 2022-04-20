import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../../types/SøknadFormData';
import { UtenlandsoppholdIPeriodenSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractUtenlandsoppholdIPeriodenSøknadsdata = ({
    skalOppholdeSegIUtlandetIPerioden,
    utenlandsoppholdIPerioden,
}: Partial<SøknadFormData>): UtenlandsoppholdIPeriodenSøknadsdata | undefined => {
    if (
        skalOppholdeSegIUtlandetIPerioden &&
        skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES &&
        utenlandsoppholdIPerioden
    ) {
        return {
            type: 'skalOppholdeSegIUtlandet',
            skalOppholdeSegIUtlandetIPerioden: true,
            opphold: utenlandsoppholdIPerioden,
        };
    }

    if (skalOppholdeSegIUtlandetIPerioden && skalOppholdeSegIUtlandetIPerioden === YesOrNo.NO) {
        return {
            type: 'skalIkkeOppholdeSegIUtlandet',
            skalOppholdeSegIUtlandetIPerioden: false,
        };
    }

    return undefined;
};
