import * as React from 'react';
import { HistoryProps } from 'common/types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationUtils';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { date3YearsAgo } from 'common/utils/dateUtils';
import { validateYesOrNoIsAnswered, validateFradato, validateTildato } from '../../../validation/fieldValidations';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import { CustomFormikProps } from '../../../types/FormikProps';

import './dagerPerUkeBorteFraJobb.less';

interface OpplysningerOmTidsromStepProps {
    formikProps: CustomFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const OpplysningerOmTidsromStep = ({ history, intl, nextStepRoute, formikProps, ...stepProps }: Props) => {
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
