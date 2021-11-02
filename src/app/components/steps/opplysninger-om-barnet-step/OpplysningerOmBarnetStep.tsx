import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { FormattedMessage } from 'react-intl';

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { søknadenGjelderEtAnnetBarn } = values;
    const søkerdata = React.useContext(SøkerdataContext);
    return (
        <FormikStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="xl">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <p>
                        <FormattedMessage id={'steg.omBarnet.intro.1'} />
                    </p>
                    <p>
                        <FormattedMessage id={'steg.omBarnet.intro.2'} />
                    </p>
                </CounsellorPanel>
            </Box>
            {søkerdata && (
                <>
                    {harRegistrerteBarn(søkerdata) && <RegistrertBarnPart søkersBarn={søkerdata.barn} />}
                    {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <AnnetBarnPart formValues={values} søkersFødselsnummer={søkerdata.person.fødselsnummer} />
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default OpplysningerOmBarnetStep;
