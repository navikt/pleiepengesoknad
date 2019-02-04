import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo, navigateToErrorPage } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateFradato, validateTildato } from '../../../utils/validationHelper';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { getAnsettelsesforhold } from '../../../utils/apiHelper';
import { formatDate } from '../../../utils/dateHelper';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
}

interface OpplysningerOmTidsromStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
    values: PleiepengesøknadFormData;
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
        const fromDateString = formatDate(this.props.values[Field.periodeFra]!);
        const toDateString = formatDate(this.props.values[Field.periodeTil]!);
        return getAnsettelsesforhold(fromDateString, toDateString);
    }

    async finishStep(søkerdata: Søkerdata) {
        this.setState({ isLoadingNextStep: true });

        if (!søkerdata.ansettelsesforhold) {
            try {
                const response = await this.getAnsettelsesforhold();
                søkerdata.setAnsettelsesforhold!(response.data.organisasjoner);
            } catch (error) {
                navigateToErrorPage(this.props.history);
            }
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
