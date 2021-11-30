import * as React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { harRegistrerteBarn } from '../../../utils/søkerdataUtils';
import FormikStep from '../../formik-step/FormikStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormData>();
    const { søknadenGjelderEtAnnetBarn } = values;
    const søkerdata = React.useContext(SøkerdataContext);
    return (
        <FormikStep id={StepID.OPPLYSNINGER_OM_BARNET} onValidFormSubmit={onValidSubmit}>
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
