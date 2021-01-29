import React from 'react';
// import AlertStripe from 'nav-frontend-alertstriper';mport FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
// import FrilansFormPart from './FrilansFormPart';
// import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    // const formikProps = useFormikContext<PleiepengesøknadFormData>();

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD_I_PERIODEN} onValidFormSubmit={onValidSubmit}>
            sdf
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
