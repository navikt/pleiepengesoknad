import * as React from 'react';
import { HistoryProps } from '../../../types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { date3YearsAgo, formatDate } from '../../../utils/dateUtils';
import { getArbeidsgiver } from '../../../api/api';
import { validateFradato, validateTildato, validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import Box from '../../box/Box';
import { AxiosError } from 'axios';
import * as apiUtils from '../../../utils/apiUtils';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { YesOrNo } from 'app/types/YesOrNo';
import { CustomFormikProps } from '../../../types/FormikProps';
import demoSøkerdata from '../../../demo/demoData';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';

import './dagerPerUkeBorteFraJobb.less';

interface OpplysningerOmTidsromStepState {
    isLoadingNextStep: boolean;
}

interface OpplysningerOmTidsromStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

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

        if (appIsRunningInDemoMode()) {
            søkerdata.setAnsettelsesforhold(demoSøkerdata.ansettelsesforhold);
            navigateTo(this.props.nextStepRoute!, this.props.history);
            return;
        }

        try {
            const response = await this.getArbeidsforhold();
            søkerdata.setAnsettelsesforhold!(response.data.organisasjoner);
            this.props.formikProps.setFieldValue(Field.ansettelsesforhold, []);
        } catch (error) {
            this.handleArbeidsforholdFetchError(error);
        }

        const { nextStepRoute } = this.props;
        if (nextStepRoute) {
            navigateTo(nextStepRoute, this.props.history);
        }
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
        const { history, intl, formikProps, ...stepProps } = this.props;
        const { isLoadingNextStep } = this.state;

        const fraDato = this.props.formikProps.values[Field.periodeFra];
        const tilDato = this.props.formikProps.values[Field.periodeTil];
        const harMedsøker = this.props.formikProps.values[Field.harMedsøker];

        return (
            <SøkerdataContextConsumer>
                {(søkerdata) => (
                    <FormikStep
                        id={StepID.TIDSROM}
                        onValidFormSubmit={() => this.finishStep(søkerdata!)}
                        showButtonSpinner={isLoadingNextStep}
                        formValues={formikProps.values}
                        handleSubmit={formikProps.handleSubmit}
                        history={history}
                        {...stepProps}>
                        <DateIntervalPicker
                            legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                            helperText={intlHelper(intl, 'steg.tidsrom.hjelpetekst')}
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
                            <YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.annenSamtidig.spm')}
                                name={Field.harMedsøker}
                                validate={validateYesOrNoIsAnswered}
                            />
                        </Box>

                        {harMedsøker === YesOrNo.YES && (
                            <YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                                name={Field.samtidigHjemme}
                                validate={validateYesOrNoIsAnswered}
                            />
                        )}
                    </FormikStep>
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(OpplysningerOmTidsromStep);
