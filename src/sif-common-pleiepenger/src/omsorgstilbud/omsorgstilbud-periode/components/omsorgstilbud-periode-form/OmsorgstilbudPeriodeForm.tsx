import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    getDateRangeValidator,
    ValidateDateError,
    ValidateDateRangeError,
} from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import TidFasteUkedagerInput from '../../../../tid/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { getOmsorgstilbudPeriodeIntl } from '../../i18n/omsorgstilbudPeriodeMessages';
import { getOmsorgstilbudFastDagValidator, validateOmsorgstilbudFasteDager } from './omsorgstilbudFormValidation';

export interface OmsorgstilbudPeriodeFormProps {
    periode: DateRange;
    onSubmit: (data: OmsorgstilbudPeriodeData) => void;
    onCancel: () => void;
}

export type OmsorgstilbudPeriodeData = {
    fom: Date;
    tom: Date;
    tidFasteDager: DurationWeekdays;
};

enum FormFields {
    'fom' = 'fom',
    'tom' = 'tom',
    'tidFasteDager' = 'tidFasteDager',
    'tidFasteDager.gruppe' = 'tidFasteDager.gruppe',
}

interface FormValues {
    [FormFields.fom]: InputDateString;
    [FormFields.tom]: InputDateString;
    [FormFields.tidFasteDager]: DurationWeekdays;
}

const initialFormValues: Partial<FormValues> = {};

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const OmsorgstilbudPeriodeForm: React.FC<OmsorgstilbudPeriodeFormProps> = ({ periode, onSubmit, onCancel }) => {
    const intl = useIntl();
    const { intlText } = getOmsorgstilbudPeriodeIntl(intl);

    const onValidSubmit = (values: Partial<FormValues>) => {
        const fom = datepickerUtils.getDateFromDateString(values.fom);
        const tom = datepickerUtils.getDateFromDateString(values.tom);

        if (!fom || !tom || !values.tidFasteDager) {
            throw new Error('OmsorgstilbudPeriodeForm. Ugyldig fom/tom eller tidFasteDager ');
        }

        onSubmit({
            fom,
            tom,
            tidFasteDager: values.tidFasteDager,
        });
    };

    return (
        <div>
            <Undertittel tag="h1" className="dialogFormTitle">
                {intlText('omsorgstilbudPeriodeForm.tittel')}
            </Undertittel>
            <FormBlock margin="xl">
                <FormComponents.FormikWrapper
                    initialValues={initialFormValues}
                    onSubmit={onValidSubmit}
                    renderForm={({ values: { fom, tom, tidFasteDager } }) => {
                        const from = datepickerUtils.getDateFromDateString(fom);
                        const to = datepickerUtils.getDateFromDateString(tom);

                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'omsorgstilbudPeriodeForm.validation')}
                                includeValidationSummary={true}
                                submitButtonLabel={intlText('omsorgstilbudPeriodeForm.submitButtonLabel')}
                                cancelButtonLabel={intlText('omsorgstilbudPeriodeForm.cancelButtonLabel')}>
                                <div style={{ maxWidth: '20rem' }}>
                                    <FormBlock>
                                        <FormComponents.DateIntervalPicker
                                            fromDatepickerProps={{
                                                label: intlText('omsorgstilbudPeriodeForm.fraOgMed.label'),
                                                name: FormFields.fom,
                                                disableWeekend: true,
                                                fullscreenOverlay: true,
                                                fullScreenOnMobile: true,
                                                dayPickerProps: {
                                                    initialMonth: periode.from,
                                                },
                                                minDate: periode.from,
                                                maxDate: to || periode.to,
                                                validate: getDateRangeValidator({
                                                    required: true,
                                                    onlyWeekdays: true,
                                                    toDate: to,
                                                    fromDate: from,
                                                    min: periode.from,
                                                    max: to || periode.to,
                                                }).validateFromDate,
                                            }}
                                            toDatepickerProps={{
                                                label: intlText('omsorgstilbudPeriodeForm.tilOgMed.label'),
                                                name: FormFields.tom,
                                                disableWeekend: true,
                                                fullScreenOnMobile: true,
                                                fullscreenOverlay: true,
                                                minDate: from || periode.from,
                                                maxDate: periode.to,
                                                dayPickerProps: {
                                                    initialMonth: from || periode.from,
                                                },
                                                validate: getDateRangeValidator({
                                                    required: true,
                                                    onlyWeekdays: true,
                                                    toDate: to,
                                                    fromDate: from,
                                                    min: from || periode.from,
                                                    max: periode.to,
                                                }).validateToDate,
                                            }}
                                        />
                                    </FormBlock>
                                </div>

                                <FormBlock>
                                    <FormComponents.InputGroup
                                        legend={intlText('omsorgstilbudPeriodeForm.tidFasteDager.label')}
                                        validate={() => {
                                            const error = validateOmsorgstilbudFasteDager(tidFasteDager);
                                            return error
                                                ? {
                                                      key: `${error}`,
                                                  }
                                                : undefined;
                                        }}
                                        name={FormFields['tidFasteDager.gruppe']}>
                                        <TidFasteUkedagerInput
                                            name={FormFields.tidFasteDager}
                                            validateDag={(dag, value) => {
                                                const error = getOmsorgstilbudFastDagValidator()(value);
                                                return error
                                                    ? {
                                                          key: `omsorgstilbudPeriodeForm.validation.tidFasteDager.tid.${error}`,
                                                          keepKeyUnaltered: true,
                                                          values: { dag },
                                                      }
                                                    : undefined;
                                            }}
                                        />
                                    </FormComponents.InputGroup>
                                </FormBlock>
                            </FormComponents.Form>
                        );
                    }}
                />
            </FormBlock>
        </div>
    );
};

export const OmsorgstilbudPeriodeFormErrors = {
    [FormFields.fom]: {
        [ValidateDateError.dateHasNoValue]: 'omsorgstilbudPeriodeForm.validation.fom.dateHasNoValue',
        [ValidateDateError.dateIsAfterMax]: 'omsorgstilbudPeriodeForm.validation.fom.dateIsAfterMax',
        [ValidateDateError.dateIsBeforeMin]: 'omsorgstilbudPeriodeForm.validation.fom.dateIsBeforeMin',
        [ValidateDateError.dateHasInvalidFormat]: 'omsorgstilbudPeriodeForm.validation.fom.dateHasInvalidFormat',
        [ValidateDateRangeError.fromDateIsAfterToDate]: 'omsorgstilbudPeriodeForm.validation.fom.fromDateIsAfterToDate',
    },
    [FormFields.tom]: {
        [ValidateDateError.dateHasNoValue]: 'omsorgstilbudPeriodeForm.validation.tom.dateHasNoValue',
        [ValidateDateError.dateIsAfterMax]: 'omsorgstilbudPeriodeForm.validation.tom.dateIsAfterMax',
        [ValidateDateError.dateIsBeforeMin]: 'omsorgstilbudPeriodeForm.validation.tom.dateIsBeforeMin',
        [ValidateDateError.dateHasInvalidFormat]: 'omsorgstilbudPeriodeForm.validation.tom.dateHasInvalidFormat',
        [ValidateDateRangeError.toDateIsBeforeFromDate]:
            'omsorgstilbudPeriodeForm.validation.tom.toDateIsBeforeFromDate',
    },
    [FormFields['tidFasteDager.gruppe']]: {
        ['ingenTidRegistrert']: 'omsorgstilbudPeriodeForm.validation.tidFasteDager.gruppe.ingenTidRegistrert',
        ['forMangeTimer']: 'omsorgstilbudPeriodeForm.validation.tidFasteDager.gruppe.forMangeTimer',
    },
};

export default OmsorgstilbudPeriodeForm;
