import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { Field } from '../../../types/PleiepengesøknadFormData';
import Datepicker from '../../datepicker/Datepicker';
import { validateFradato, validateTildato } from '../../../utils/validationHelper';
import FormikStep from '../../formik-step/FormikStep';

interface OpplysningerOmTidsromStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.TIDSROM);

const OpplysningerOmTidsromStep = ({ history, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.TIDSROM} onValidFormSubmit={navigate} {...stepProps}>
            <Datepicker
                label="Hvilken dato ønsker du å ha pleiepenger fra?"
                validate={validateFradato}
                name={Field.periodeFra}
            />
            <Datepicker
                label="Hvilken dato ønsker du å ha pleiepenger til?"
                validate={validateTildato}
                name={Field.periodeTil}
            />
        </FormikStep>
    );
};

export default OpplysningerOmTidsromStep;
