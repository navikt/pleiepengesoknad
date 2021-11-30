import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormData } from '../../types/SøknadFormData';
import { harRegistrerteBarn } from '../../utils/søkerdataUtils';
import SøknadFormStep from '../SøknadFormStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { søknadenGjelderEtAnnetBarn } = values;
    const søkerdata = React.useContext(SøkerdataContext);
    return (
        <SøknadFormStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={onValidSubmit}>
            {søkerdata && (
                <>
                    {harRegistrerteBarn(søkerdata) && <RegistrertBarnPart søkersBarn={søkerdata.barn} />}
                    {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <AnnetBarnPart formValues={values} søkersFødselsnummer={søkerdata.person.fødselsnummer} />
                    )}
                </>
            )}
        </SøknadFormStep>
    );
};

export default OpplysningerOmBarnetStep;
