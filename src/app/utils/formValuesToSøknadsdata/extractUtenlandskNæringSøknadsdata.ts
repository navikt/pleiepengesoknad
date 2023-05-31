import { YesOrNo } from '@navikt/sif-common-core-ds/lib/types/YesOrNo';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { UtenlandskNæringSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractUtenlandskNæringSøknadsdata = ({
    harUtenlandskNæring,
    utenlandskNæring,
}: Partial<SøknadFormValues>): UtenlandskNæringSøknadsdata => {
    if (harUtenlandskNæring === YesOrNo.YES && utenlandskNæring) {
        return {
            type: 'harUtenlandskNæring',
            utenlandskNæring: utenlandskNæring,
        };
    } else {
        return {
            type: 'harIkkeUtenlandskNæring',
        };
    }
};
