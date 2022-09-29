import React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import SøknadFormStep from '../SøknadFormStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';
import { Søkerdata } from '../../types/Søkerdata';

const harRegistrerteBarn = ({ barn }: Søkerdata) => {
    return barn && barn.length > 0;
};

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormValues>();
    const { søknadenGjelderEtAnnetBarn } = values;
    const søkerdata = React.useContext(SøkerdataContext);
    return (
        <SøknadFormStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={onValidSubmit}>
            {søkerdata && (
                <div data-testid="opplysninger-om-barnet">
                    {harRegistrerteBarn(søkerdata) && <RegistrertBarnPart søkersBarn={søkerdata.barn} />}
                    {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <AnnetBarnPart formValues={values} søkersFødselsnummer={søkerdata.søker.fødselsnummer} />
                    )}
                </div>
            )}
        </SøknadFormStep>
    );
};

export default OpplysningerOmBarnetStep;
