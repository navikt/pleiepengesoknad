import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { validateFradato, validateTildato } from '../../../utils/validationHelper';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';

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
            <DateIntervalPicker
                legend="For hvilken periode søker du pleiepenger?"
                fromDatepickerProps={{
                    label: 'Fra og med',
                    validate: validateFradato,
                    name: Field.periodeFra
                }}
                toDatepickerProps={{
                    label: 'Til og med',
                    validate: validateTildato,
                    name: Field.periodeTil
                }}
            />
        </FormikStep>
    );
};

export default OpplysningerOmTidsromStep;
