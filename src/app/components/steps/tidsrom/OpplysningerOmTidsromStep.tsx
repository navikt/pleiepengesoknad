import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo, navigateToErrorPage } from '../../../utils/navigationUtils';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { date3YearsAgo, formatDate } from '../../../utils/dateUtils';
import { FormikProps } from 'formik';
import { getArbeidsgiver } from '../../../api/api';
import { validateFradato, validateTildato, validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import { getNextStepRoute } from '../../../utils/routeUtils';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import SliderBase from '../../slider-base/SliderBase';
import Box from '../../box/Box';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
    sliderValue: number;
}

interface OpplysningerOmTidsromStepProps {
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
        this.validateFraDato = this.validateFraDato.bind(this);
        this.validateTilDato = this.validateTilDato.bind(this);
        this.updateSliderValue = this.updateSliderValue.bind(this);

        this.state = {
            isLoadingNextStep: false,
            sliderValue: 100
        };
    }

    getAnsettelsesforhold() {
        const values = this.props.formikProps.values;
        const fromDateString = formatDate(values[Field.periodeFra]!);
        const toDateString = formatDate(values[Field.periodeTil]!);
        return getArbeidsgiver(fromDateString, toDateString);
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

    validateFraDato(fraDato?: Date) {
        const { periodeTil } = this.props.formikProps.values;
        return validateFradato(fraDato, periodeTil);
    }

    validateTilDato(tilDato?: Date) {
        const { periodeFra } = this.props.formikProps.values;
        return validateTildato(tilDato, periodeFra);
    }

    updateSliderValue(nextSliderValue: number) {
        this.setState({
            sliderValue: nextSliderValue
        });
    }

    render() {
        const { history, ...stepProps } = this.props;
        const { isLoadingNextStep } = this.state;

        const fraDato = this.props.formikProps.values[Field.periodeFra];
        const tilDato = this.props.formikProps.values[Field.periodeTil];

        return (
            <SøkerdataContextConsumer>
                {(søkerdata) => (
                    <FormikStep
                        id={StepID.TIDSROM}
                        onValidFormSubmit={() => this.finishStep(søkerdata!)}
                        showButtonSpinner={isLoadingNextStep}
                        history={history}
                        {...stepProps}>
                        <DateIntervalPicker
                            legend="For hvilken periode søker du pleiepenger?"
                            fromDatepickerProps={{
                                label: 'Fra og med',
                                validate: this.validateFraDato,
                                name: Field.periodeFra,
                                dateLimitations: {
                                    minDato: date3YearsAgo.toDate(),
                                    maksDato: this.validateTilDato(tilDato) === undefined ? tilDato : undefined
                                }
                            }}
                            toDatepickerProps={{
                                label: 'Til og med',
                                validate: this.validateTilDato,
                                name: Field.periodeTil,
                                dateLimitations: {
                                    minDato:
                                        this.validateFraDato(fraDato) === undefined ? fraDato : date3YearsAgo.toDate()
                                }
                            }}
                        />

                        <Box margin="xxl">
                            <SliderBase
                                name="asdf"
                                label="Velg grad av pleiepenger du vil søke om"
                                min={20}
                                max={100}
                                value={this.state.sliderValue}
                                onChange={(e) => {
                                    this.updateSliderValue(+e.currentTarget.value);
                                }}
                                valueRenderer={(value) => `${value}%`}
                                minPointLabelRenderer={(minPoint) => `${minPoint}%`}
                                maxPointLabelRenderer={(maxPoint) => `${maxPoint}%`}
                            />
                        </Box>

                        <Box margin="xxl">
                            <YesOrNoQuestion
                                legend="Finnes det en annen søker?"
                                name={Field.finnesDetEnAnnenSøker}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                    </FormikStep>
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default OpplysningerOmTidsromStep;
