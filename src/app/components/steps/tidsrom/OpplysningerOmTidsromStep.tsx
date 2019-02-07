import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo, navigateToErrorPage } from '../../../utils/navigationUtils';
import { getNextStepRoute } from '../../../utils/stepUtils';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFradato, validateTildato } from '../../../utils/validationUtils';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { formatDate } from '../../../utils/dateUtils';
import { FormikProps } from 'formik';
import { getAnsettelsesforhold } from '../../../api/api';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
}

interface OpplysningerOmTidsromStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
    formikProps: FormikProps<PleiepengesøknadFormData>;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.TIDSROM);

class OpplysningerOmTidsromStep extends React.Component<Props, OpplysningerOmTidsromStepState> {
    constructor(props: Props) {
        super(props);

        this.getAnsettelsesforhold = this.getAnsettelsesforhold.bind(this);
        this.finishStep = this.finishStep.bind(this);

        this.state = {
            isLoadingNextStep: false
        };
    }

    getAnsettelsesforhold() {
        const values = this.props.formikProps.values;
        const fromDateString = formatDate(values[Field.periodeFra]!);
        const toDateString = formatDate(values[Field.periodeTil]!);
        return getAnsettelsesforhold(fromDateString, toDateString);
    }

    async finishStep(søkerdata: Søkerdata) {
        this.setState({ isLoadingNextStep: true });

        try {
            const response = await this.getAnsettelsesforhold();
            søkerdata.setAnsettelsesforhold!(response.data.organisasjoner);
            this.props.formikProps.setFieldValue(Field.ansettelsesforhold, []);
        } catch (error) {
            navigateToErrorPage(this.props.history);
        }

        navigateTo(nextStepRoute!, this.props.history);
    }

    render() {
        const { history, ...stepProps } = this.props;
        const { isLoadingNextStep } = this.state;
        return (
            <SøkerdataContextConsumer>
                {(søkerdata) => (
                    <FormikStep
                        id={StepID.TIDSROM}
                        onValidFormSubmit={() => this.finishStep(søkerdata!)}
                        showButtonSpinner={isLoadingNextStep}
                        {...stepProps}>
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
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default OpplysningerOmTidsromStep;
