import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { validateFradato, validateTildato } from '../../../utils/validationHelper';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { getAnsettelsesforhold } from '../../../utils/apiHelper';
import { CustomFormikProps as FormikProps } from '../../../types/FormikProps';
import * as moment from 'moment';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
}

interface OpplysningerOmTidsromStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
    formikProps: FormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.TIDSROM);

class OpplysningerOmTidsromStep extends React.Component<Props, OpplysningerOmTidsromStepState> {
    constructor(props: Props) {
        super(props);
        this.navigate = this.navigate.bind(this);

        this.state = {
            isLoadingNextStep: false
        };
    }

    navigate = async (søkerdata: Søkerdata) => {
        const { history, formikProps } = this.props;
        const {
            values: { periodeFra, periodeTil }
        } = formikProps;

        this.setState({
            isLoadingNextStep: true
        });

        const fromDateString = moment(periodeFra).format('YYYY-MM-DD');
        const toDateString = moment(periodeTil).format('YYYY-MM-DD');

        const response = await getAnsettelsesforhold(fromDateString, toDateString);
        søkerdata.setAnsettelsesforhold!(response.data.organisasjoner);

        navigateTo(nextStepRoute!, history);
    };

    render() {
        const { history, ...stepProps } = this.props;
        const { isLoadingNextStep } = this.state;

        return (
            <SøkerdataContextConsumer>
                {(søkerdata) => (
                    <FormikStep
                        id={StepID.TIDSROM}
                        onValidFormSubmit={() => this.navigate(søkerdata!)}
                        {...stepProps}
                        showButtonSpinner={isLoadingNextStep}>
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
