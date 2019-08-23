import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID } from '../../../config/stepConfig';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import { Field, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { date3YearsAgo, formatDate } from '../../../utils/dateUtils';
import { FormikProps } from 'formik';
import { getArbeidsgiver } from '../../../api/api';
import {
    validateFradato,
    validateGrad,
    validateTildato,
    validateYesOrNoIsAnswered
} from '../../../validation/fieldValidations';
import { getNextStepRoute } from '../../../utils/routeUtils';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import Box from '../../box/Box';
import Slider from '../../slider/Slider';
import { AxiosError } from 'axios';
import * as apiUtils from '../../../utils/apiUtils';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
}

interface OpplysningerOmTidsromStepProps {
    handleSubmit: () => void;
    formikProps: FormikProps<PleiepengesøknadFormData>;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & InjectedIntlProps;

const nextStepRoute = getNextStepRoute(StepID.TIDSROM);

class OpplysningerOmTidsromStep extends React.Component<Props, OpplysningerOmTidsromStepState> {
    constructor(props: Props) {
        super(props);

        this.getArbeidsforhold = this.getArbeidsforhold.bind(this);
        this.finishStep = this.finishStep.bind(this);
        this.validateFraDato = this.validateFraDato.bind(this);
        this.validateTilDato = this.validateTilDato.bind(this);

        this.state = {
            isLoadingNextStep: false
        };
    }

    getArbeidsforhold() {
        const values = this.props.formikProps.values;
        const fromDateString = formatDate(values[Field.periodeFra]!);
        const toDateString = formatDate(values[Field.periodeTil]!);
        return getArbeidsgiver(fromDateString, toDateString);
    }

    handleArbeidsforholdFetchError(response: AxiosError) {
        if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
        }
    }

    async finishStep(søkerdata: Søkerdata) {
        this.setState({ isLoadingNextStep: true });

        try {
            const response = await this.getArbeidsforhold();
            søkerdata.setAnsettelsesforhold!(response.data.organisasjoner);
            this.props.formikProps.setFieldValue(Field.ansettelsesforhold, []);
        } catch (error) {
            this.handleArbeidsforholdFetchError(error);
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

    render() {
        const { history, intl, ...stepProps } = this.props;
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
                            legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                            fromDatepickerProps={{
                                label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                                validate: this.validateFraDato,
                                name: Field.periodeFra,
                                dateLimitations: {
                                    minDato: date3YearsAgo.toDate(),
                                    maksDato: this.validateTilDato(tilDato) === undefined ? tilDato : undefined
                                }
                            }}
                            toDatepickerProps={{
                                label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                                validate: this.validateTilDato,
                                name: Field.periodeTil,
                                dateLimitations: {
                                    minDato:
                                        this.validateFraDato(fraDato) === undefined ? fraDato : date3YearsAgo.toDate()
                                }
                            }}
                        />

                        <Box margin="xl">
                            <Slider
                                name={Field.grad}
                                label={intlHelper(intl, 'steg.tidsrom.hvorMye.spm')}
                                min={20}
                                max={100}
                                valueRenderer={(value) => `${value}%`}
                                minPointLabelRenderer={(minPoint) => `${minPoint}%`}
                                maxPointLabelRenderer={(maxPoint) => `${maxPoint}%`}
                                showTextInput={true}
                                helperText={
                                    <ul style={{ margin: '0.5rem', paddingLeft: '0.5rem' }}>
                                        <li>
                                            <FormattedMessage id="steg.tidsrom.hvorMye.hjelp.part1" />
                                        </li>
                                        <li style={{ marginTop: '0.5rem' }}>
                                            <FormattedMessage id="steg.tidsrom.hvorMye.hjelp.part2" />
                                        </li>
                                    </ul>
                                }
                                validate={validateGrad}
                            />
                        </Box>

                        <Box margin="xxl">
                            <YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.annenSamtidig.spm')}
                                name={Field.harMedsøker}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>
                    </FormikStep>
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(OpplysningerOmTidsromStep);
