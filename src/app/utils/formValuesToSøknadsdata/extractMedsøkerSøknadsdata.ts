import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { MedsøkerSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractMedsøkerSøknadsdata = ({
    harMedsøker,
    samtidigHjemme,
}: Partial<SøknadFormValues>): MedsøkerSøknadsdata | undefined => {
    if (harMedsøker && harMedsøker === YesOrNo.YES) {
        return {
            type: 'harMedsøker',
            harMedsøker: true,
            samtidigHjemme: samtidigHjemme === YesOrNo.YES,
        };
    }

    return undefined;
};
