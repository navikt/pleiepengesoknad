import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SøknadFormData } from '../../types/SøknadFormData';
import { OpptjeningUtlandSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractOpptjeningUtlandSøknadsdata = ({
    harOpptjeningUtland,
    opptjeningUtland,
}: Partial<SøknadFormData>): OpptjeningUtlandSøknadsdata => {
    if (harOpptjeningUtland === YesOrNo.YES && opptjeningUtland) {
        return {
            type: 'harOpptjeningUtland',
            opptjeningUtland: opptjeningUtland,
        };
    } else {
        return {
            type: 'harIkkeIkkeOpptjeningUtland',
        };
    }
};
