import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { OpptjeningUtlandSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const extractOpptjeningUtlandSøknadsdata = ({
    harOpptjeningUtland,
    opptjeningUtland,
}: Partial<SøknadFormValues>): OpptjeningUtlandSøknadsdata => {
    if (harOpptjeningUtland === YesOrNo.YES && opptjeningUtland) {
        return {
            type: 'harOpptjeningUtland',
            opptjeningUtland: opptjeningUtland,
        };
    } else {
        return {
            type: 'harIkkeOpptjeningUtland',
        };
    }
};
