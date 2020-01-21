import * as React from 'react';
import { HistoryProps } from 'common/types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationUtils';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import DateIntervalPicker from '../../date-interval-picker/DateIntervalPicker';
import { date3YearsAgo, DateRange, date1YearFromNow, date1YearAgo } from 'common/utils/dateUtils';
import {
    validateYesOrNoIsAnswered,
    validateFradato,
    validateTildato,
    validateRequiredField,
    validateUtenlandsoppholdIPerioden
} from '../../../validation/fieldValidations';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';

import './dagerPerUkeBorteFraJobb.less';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';
import { Field, FieldProps } from 'formik';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import UtenlandsoppholdInput from 'common/forms/utenlandsopphold';
import { showValidationErrors } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';

interface OpplysningerOmTidsromStepProps {
    formikProps: PleiepengesøknadFormikProps;
}

type Props = OpplysningerOmTidsromStepProps & HistoryProps & StepConfigProps;

const OpplysningerOmTidsromStep = ({ history, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;

    const fraDato = formikProps.values[AppFormField.periodeFra];
    const tilDato = formikProps.values[AppFormField.periodeTil];
    const harMedsøker = formikProps.values[AppFormField.harMedsøker];

    const { periodeFra, periodeTil } = formikProps.values;

    const validateFraDatoField = (date?: Date) => {
        return validateFradato(date, periodeTil);
    };

    const validateTilDatoField = (date?: Date) => {
        return validateTildato(date, periodeFra);
    };

    const periode: DateRange = { from: periodeFra || date1YearAgo, to: periodeTil || date1YearFromNow };
    const intl = useIntl();

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

            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) && (
                <Box margin="xl">
                    <YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.medlemsskap.iUtlandetIPerioden.spm')}
                        name={AppFormField.skalOppholdsSegIUtlandetIPerioden}
                        validate={validateRequiredField}
                    />
                </Box>
            )}
            {isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD) &&
                formikProps.values.skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && (
                    <Box margin="m">
                        <Field
                            name={AppFormField.utenlandsoppholdIPerioden}
                            validate={
                                periode
                                    ? (opphold: Utenlandsopphold[]) =>
                                          validateUtenlandsoppholdIPerioden(periode, opphold)
                                    : undefined
                            }>
                            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                                const errorMsgProps = showValidationErrors(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};
                                return (
                                    <UtenlandsoppholdInput
                                        labels={{
                                            listeTittel: intlHelper(
                                                intl,
                                                'steg.medlemsskap.iUtlandetIPerioden.listeTittel'
                                            ),
                                            formLabels: {
                                                reasonLabel: intlHelper(
                                                    intl,
                                                    'steg.medlemsskap.iUtlandetIPerioden.eøs.årsak.spm'
                                                ),
                                                reasonHelperText: intlHelper(
                                                    intl,
                                                    'steg.medlemsskap.iUtlandetIPerioden.eøs.årsak.hjelp'
                                                )
                                            }
                                        }}
                                        spørOmÅrsakVedOppholdIEØSLand={true}
                                        utenlandsopphold={field.value}
                                        tidsrom={periode || { from: date1YearFromNow, to: date1YearFromNow }}
                                        onChange={(utenlandsopphold: Utenlandsopphold[]) => {
                                            setFieldValue(field.name, utenlandsopphold);
                                        }}
                                        {...errorMsgProps}
                                    />
                                );
                            }}
                        </Field>
                    </Box>
                )}

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

export default OpplysningerOmTidsromStep;
