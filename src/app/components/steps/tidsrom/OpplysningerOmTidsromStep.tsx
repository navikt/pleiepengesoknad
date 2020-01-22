import * as React from 'react';
import { HistoryProps } from 'common/types/History';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { navigateTo } from '../../../utils/navigationUtils';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import FormikDateIntervalPicker from '../../../../common/formik/formik-date-interval-picker/FormikDateIntervalPicker';
import { date3YearsAgo, DateRange, date1YearFromNow, date1YearAgo } from 'common/utils/dateUtils';
import {
    validateYesOrNoIsAnswered,
    validateFradato,
    validateTildato,
    validateRequiredField,
    validateUtenlandsoppholdIPerioden
} from '../../../validation/fieldValidations';
import YesOrNoQuestion from '../../../../common/components/yes-or-no-question/YesOrNoQuestion';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { YesOrNo } from 'common/types/YesOrNo';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';
import { Field, FieldProps } from 'formik';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { Ferieuttak } from 'common/forms/ferieuttak/types';
import ModalFormAndList from 'common/components/modal-form-and-list/ModalFormAndList';
import FerieuttakListe from 'common/forms/ferieuttak/FerieuttakList';
import FerieuttakForm from 'common/forms/ferieuttak/FerieuttakForm';
import UtenlandsoppholdListe from 'common/forms/utenlandsopphold/UtenlandsoppholdListe';
import UtenlandsoppholdForm from 'common/forms/utenlandsopphold/UtenlandsoppholdForm';

import './dagerPerUkeBorteFraJobb.less';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';

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
            <FormikDateIntervalPicker
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
                    <YesOrNoQuestion<AppFormField>
                        legend={intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.spm')}
                        name={AppFormField.skalOppholdeSegIUtlandetIPerioden}
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
                                const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                    : {};
                                return (
                                    <>
                                        <ModalFormAndList<Utenlandsopphold>
                                            items={field.value}
                                            onChange={(oppholdsliste) => {
                                                setFieldValue(field.name, oppholdsliste);
                                            }}
                                            labels={{
                                                modalTitle: 'Utenlandsopphold',
                                                listTitle: 'Registrerte utenlandsopphold i perioden',
                                                addLabel: 'Legg til utenlandsopphold'
                                            }}
                                            listRenderer={(onEdit, onDelete) => (
                                                <UtenlandsoppholdListe
                                                    utenlandsopphold={field.value}
                                                    onDelete={onDelete}
                                                    onEdit={onEdit}
                                                />
                                            )}
                                            formRenderer={(onSubmit, onCancel, opphold) => (
                                                <UtenlandsoppholdForm
                                                    labels={{}}
                                                    opphold={opphold}
                                                    onCancel={onCancel}
                                                    onSubmit={onSubmit}
                                                    minDate={date1YearAgo}
                                                    maxDate={date1YearFromNow}
                                                    {...errorMsgProps}
                                                />
                                            )}
                                        />
                                    </>
                                );
                            }}
                        </Field>
                    </Box>
                )}

            {isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK) && (
                <Box margin="xl">
                    <YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.spm')}
                        name={AppFormField.skalTaUtFerieIPerioden}
                        validate={validateRequiredField}
                    />
                </Box>
            )}
            {isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK) && formikProps.values.skalTaUtFerieIPerioden === YesOrNo.YES && (
                <Box margin="m">
                    <Field name={AppFormField.ferieuttakIPerioden}>
                        {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                            const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                : {};
                            return (
                                <ModalFormAndList<Ferieuttak>
                                    items={field.value}
                                    onChange={(ferieuttak) => {
                                        setFieldValue(field.name, ferieuttak);
                                    }}
                                    labels={{
                                        modalTitle: 'Ferieuttak',
                                        listTitle: 'Registrerte ferieuttak i perioden',
                                        addLabel: 'Legg til periode med ferieuttak'
                                    }}
                                    listRenderer={(onEdit, onDelete) => (
                                        <FerieuttakListe ferieuttak={field.value} onDelete={onDelete} onEdit={onEdit} />
                                    )}
                                    formRenderer={(onSubmit, onCancel, ferieuttak) => (
                                        <FerieuttakForm
                                            ferieuttak={ferieuttak}
                                            onCancel={onCancel}
                                            onSubmit={onSubmit}
                                            minDate={date1YearAgo}
                                            maxDate={date1YearFromNow}
                                            {...errorMsgProps}
                                        />
                                    )}
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
