import * as React from 'react';
import { HistoryProps } from 'common/types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationUtils';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
// import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
// import { Søkerdata } from '../../../types/Søkerdata';
import { date3YearsAgo } from 'common/utils/dateUtils';
// import { getArbeidsgiver } from '../../../api/api';
import { validateYesOrNoIsAnswered, validateFradato, validateTildato } from '../../../validation/fieldValidations';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import Box from 'common/components/box/Box';
// import { AxiosError } from 'axios';
// import * as apiUtils from '../../../utils/apiUtils';
import intlHelper from 'common/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import { CustomFormikProps } from '../../../types/FormikProps';
// import demoSøkerdata from '../../../demo/demoData';
// import { appIsRunningInDemoMode } from '../../../utils/envUtils';

import './dagerPerUkeBorteFraJobb.less';

// interface OpplysningerOmTidsromStepState {
//     isLoadingNextStep: boolean;
// }

interface OpplysningerOmTidsromStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

// type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const OpplysningerOmTidsromStep = ({ history, intl, nextStepRoute, formikProps, ...stepProps }: Props) => {
    // const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;

    // class OpplysningerOmTidsromStep extends React.Component<Props, OpplysningerOmTidsromStepState> {
    //     constructor(props: Props) {
    //         super(props);

    //         this.getArbeidsforhold = this.getArbeidsforhold.bind(this);
    //         this.finishStep = this.finishStep.bind(this);
    //         this.validateFraDato = this.validateFraDato.bind(this);
    //         this.validateTilDato = this.validateTilDato.bind(this);

    //         // this.state = {
    //         //     isLoadingNextStep: false
    //         // };
    //     }

    // getArbeidsforhold() {
    //     const values = this.props.formikProps.values;
    //     const fromDateString = formatDateToApiFormat(values[AppFormField.periodeFra]!);
    //     const toDateString = formatDateToApiFormat(values[AppFormField.periodeTil]!);
    //     return getArbeidsgiver(fromDateString, toDateString);
    // }

    // handleArbeidsforholdFetchError(response: AxiosError) {
    //     if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
    //         navigateToLoginPage();
    //     }
    // }

    // async finishStep(søkerdata: Søkerdata) {
    //     this.setState({ isLoadingNextStep: true });

    //     if (appIsRunningInDemoMode()) {
    //         søkerdata.setAnsettelsesforhold(demoSøkerdata.ansettelsesforhold);
    //         navigateTo(this.props.nextStepRoute!, this.props.history);
    //         return;
    //     }
    //     try {
    //         const response = await this.getArbeidsforhold();
    //         søkerdata.setAnsettelsesforhold!(response.data.organisasjoner);
    //         if (this.props.formikProps.values[AppFormField.ansettelsesforhold].length === 0) {
    //             this.props.formikProps.setFieldValue(AppFormField.ansettelsesforhold, [
    //                 ...response.data.organisasjoner
    //             ]);
    //         }
    //     } catch (error) {
    //         this.handleArbeidsforholdFetchError(error);
    //     }

    //     const { nextStepRoute } = this.props;
    //     if (nextStepRoute) {
    //         navigateTo(nextStepRoute, this.props.history);
    //     }
    // }

    // validateFraDato(fraDato?: Date) {
    //     const { periodeTil } = this.props.formikProps.values;
    //     return validateFradato(fraDato, periodeTil);
    // }

    // validateTilDato(tilDato?: Date) {
    //     const { periodeFra } = this.props.formikProps.values;
    //     return validateTildato(tilDato, periodeFra);
    // }

    // render() {
    // const { history, intl, formikProps, ...stepProps } = this.props;
    // const { isLoadingNextStep } = this.state;
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;

    const fraDato = formikProps.values[AppFormField.periodeFra];
    const tilDato = formikProps.values[AppFormField.periodeTil];
    const harMedsøker = formikProps.values[AppFormField.harMedsøker];

    const validateFraDatoField = (date?: Date) => {
        const { periodeTil } = formikProps.values;
        return validateFradato(date, periodeTil);
    };

    const validateTilDatoField = (date?: Date) => {
        const { periodeFra } = formikProps.values;
        return validateTildato(date, periodeFra);
    };

    return (
        <FormikStep
            id={StepID.TIDSROM}
            onValidFormSubmit={navigate}
            formValues={formikProps.values}
            handleSubmit={formikProps.handleSubmit}
            history={history}
            {...stepProps}>
            <DateIntervalPicker
                legend={intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.spm')}
                helperText={intlHelper(intl, 'steg.tidsrom.hjelpetekst')}
                fromDatepickerProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.fom'),
                    validate: validateFraDatoField,
                    name: AppFormField.periodeFra,
                    dateLimitations: {
                        minDato: date3YearsAgo.toDate(),
                        maksDato: validateTilDatoField(tilDato) === undefined ? tilDato : undefined
                    }
                }}
                toDatepickerProps={{
                    label: intlHelper(intl, 'steg.tidsrom.hvilketTidsrom.tom'),
                    validate: validateTilDatoField,
                    name: AppFormField.periodeTil,
                    dateLimitations: {
                        minDato: validateFraDatoField(fraDato) === undefined ? fraDato : date3YearsAgo.toDate()
                    }
                }}
            />

            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.tidsrom.annenSamtidig.spm')}
                    name={AppFormField.harMedsøker}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>

            {harMedsøker === YesOrNo.YES && (
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.tidsrom.samtidigHjemme.spm')}
                    name={AppFormField.samtidigHjemme}
                    validate={validateYesOrNoIsAnswered}
                />
            )}
        </FormikStep>
    );
};

export default injectIntl(OpplysningerOmTidsromStep);
