import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormData } from '../../types/SøknadFormData';
import SøknadFormStep from '../SøknadFormStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';
import { Søkerdata } from '../../types/Søkerdata';

const harRegistrerteBarn = ({ barn }: Søkerdata) => {
    return barn && barn.length > 0;
};

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
