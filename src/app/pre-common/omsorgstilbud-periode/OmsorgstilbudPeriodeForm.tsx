import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateRangeValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import TidUkedagerInput from '../../components/tid-ukedager-input/TidUkedagerInput';
import { TidUkedager } from '../../types';
import { validateOmsorgstilbudIUke } from '../../validation/validateOmsorgstilbudFields';
import { getArbeidstimerFastDagValidator } from '../../validation/validateArbeidFields';

interface Props {
    rammePeriode: DateRange;
    onSubmit: (data: OmsorgstilbudPeriodeData) => void;
    onCancel: () => void;
}

export type OmsorgstilbudPeriodeData = {
    fom: Date;
    tom: Date;
    tidFasteDager: TidUkedager;
};

enum FormFields {
    'fom' = 'fom',
    'tom' = 'tom',
    'tidFasteDager' = 'tidFasteDager',
}

interface FormValues {
    [FormFields.fom]: InputDateString;
    [FormFields.tom]: InputDateString;
    [FormFields.tidFasteDager]: TidUkedager;
}

const initialFormValues: Partial<FormValues> = {};

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const OmsorgstilbudPeriodeForm: React.FC<Props> = ({ rammePeriode, onSubmit, onCancel }) => {
    const intl = useIntl();

    const onValidSubmit = (values: FormValues) => {
        const fom = datepickerUtils.getDateFromDateString(values.fom);
        const tom = datepickerUtils.getDateFromDateString(values.tom);

        if (!fom || !tom) {
            throw new Error('OmsorgstilbudPeriodeForm. Ugyldig fom/tom ');
        }

        onSubmit({
            fom,
            tom,
            tidFasteDager: values.tidFasteDager,
        });
    };

    return (
        <div>
            <Undertittel tag="h1">
                <FormattedMessage id="omsorgstilbudPeriodeForm.tittel" />
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
                                formErrorHandler={getIntlFormErrorHandler(intl, 'omsorgstilbudPeriode')}
                                includeValidationSummary={true}
                                submitButtonLabel={intlHelper(intl, 'omsorgstilbudPeriodeForm.submitButtonLabel')}
                                cancelButtonLabel={intlHelper(intl, 'omsorgstilbudPeriodeForm.cancelButtonLabel')}>
                                <div style={{ maxWidth: '20rem' }}>
                                    <FormBlock>
                                        <FormComponents.DateIntervalPicker
                                            fromDatepickerProps={{
                                                label: intlHelper(intl, 'omsorgstilbudPeriodeForm.fraOgMed.label'),
                                                name: FormFields.fom,
                                                disableWeekend: true,
                                                fullScreenOnMobile: true,
                                                dayPickerProps: {
                                                    initialMonth: rammePeriode.from,
                                                },
                                                minDate: rammePeriode.from,
                                                maxDate: to || rammePeriode.to,
                                                validate: getDateRangeValidator({ required: true, onlyWeekdays: true })
                                                    .validateFromDate,
                                            }}
                                            toDatepickerProps={{
                                                label: intlHelper(intl, 'omsorgstilbudPeriodeForm.tilOgMed.label'),
                                                name: FormFields.tom,
                                                disableWeekend: true,
                                                fullScreenOnMobile: true,
                                                minDate: from || rammePeriode.from,
                                                maxDate: rammePeriode.to,
                                                dayPickerProps: {
                                                    initialMonth: from || rammePeriode.from,
                                                },
                                                validate: getDateRangeValidator({ required: true }).validateToDate,
                                            }}
                                        />
                                    </FormBlock>
                                </div>

                                <FormBlock>
                                    <FormComponents.InputGroup
                                        legend={intlHelper(intl, 'omsorgstilbudPeriodeForm.tidFasteDager.label')}
                                        validate={() => validateOmsorgstilbudIUke(tidFasteDager)}
                                        name={'fasteDager_gruppe' as any}>
                                        <TidUkedagerInput
                                            name={FormFields.tidFasteDager}
                                            validator={getArbeidstimerFastDagValidator}
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

export default OmsorgstilbudPeriodeForm;
