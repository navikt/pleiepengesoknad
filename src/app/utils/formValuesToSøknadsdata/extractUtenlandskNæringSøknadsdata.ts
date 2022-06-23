import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import { UtenlandskNæringSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractUtenlandskNæringSøknadsdata = ({
    harUtenlandskNæring,
    utenlandskNæring,
}: Partial<SøknadFormData>): UtenlandskNæringSøknadsdata => {
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
