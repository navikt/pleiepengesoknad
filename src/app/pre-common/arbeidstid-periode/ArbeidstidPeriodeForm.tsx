import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateRangeValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import TidUkedagerInput from '../../components/tid-ukedager-input/TidUkedagerInput';
import {
    ArbeidIPeriodeIntlValues,
    getRedusertArbeidstidPerUkeInfo,
} from '../../søknad/arbeid-i-periode-steps/ArbeidIPeriodeSpørsmål';
import { TidUkedager } from '../../types';
import {
    getArbeidstidFastProsentValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from '../../validation/validateArbeidFields';

interface Props {
    arbeidsstedNavn: string;
    rammePeriode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
    jobberNormaltTimer: number;
    onSubmit: (data: ArbeidstidPeriodeData) => void;
    onCancel: () => void;
}

enum TidFasteDagerEllerProsent {
    prosent = 'prosent',
    tidFasteDager = 'tidFasteDager',
}

export type ArbeidstidPeriodeData = {
    fom: Date;
    tom: Date;
    prosent?: string;
    tidFasteDager?: TidUkedager;
};

enum FormFields {
    'fom' = 'fom',
    'tom' = 'tom',
    'tidFasteDagerEllerProsent' = 'tidFasteDagerEllerProsent',
    'tidFasteDager' = 'tidFasteDager',
    'prosent' = 'prosent',
}

interface FormValues {
    [FormFields.fom]: InputDateString;
    [FormFields.tom]: InputDateString;
    [FormFields.tidFasteDagerEllerProsent]: TidFasteDagerEllerProsent;
    [FormFields.prosent]: string;
    [FormFields.tidFasteDager]?: TidUkedager;
}

const initialFormValues: Partial<FormValues> = {};

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('arbeidstidEnkeltdagEdit');

const ArbeidstidPeriodeForm: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    rammePeriode,
    intlValues,
    jobberNormaltTimer,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();

    const onValidSubmit = (values: FormValues) => {
        const fom = datepickerUtils.getDateFromDateString(values.fom);
        const tom = datepickerUtils.getDateFromDateString(values.tom);

        if (!fom || !tom) {
            throw new Error('ArbeidstidPeriodeForm. Ugyldig fom/tom ');
        }

        onSubmit({
            fom,
            tom,
            prosent:
                values.tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.prosent ? values.prosent : undefined,
            tidFasteDager:
                values.tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.tidFasteDager
                    ? values.tidFasteDager
                    : undefined,
        });
    };

    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                <FormattedMessage id="arbeidstidPeriodeForm.tittel" values={{ arbeidsstedNavn }} />
            </Undertittel>
            <FormBlock margin="xl">
                <FormComponents.FormikWrapper
                    initialValues={initialFormValues}
                    onSubmit={onValidSubmit}
                    renderForm={({ values: { fom, tom, tidFasteDagerEllerProsent, tidFasteDager, prosent } }) => {
                        const from = datepickerUtils.getDateFromDateString(fom);
                        const to = datepickerUtils.getDateFromDateString(tom);
                        const periode = from && to ? { from, to } : undefined;
                        const visKnapper = periode !== undefined && tidFasteDagerEllerProsent !== undefined;
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'arbeidstidPeriode')}
                                includeValidationSummary={true}
                                includeButtons={visKnapper}
                                submitButtonLabel={intlHelper(intl, 'arbeidstidPeriodeForm.submitButtonLabel')}
                                cancelButtonLabel={intlHelper(intl, 'arbeidstidPeriodeForm.cancelButtonLabel')}>
                                <div style={{ maxWidth: '20rem' }}>
                                    <FormBlock>
                                        <FormComponents.DateIntervalPicker
                                            fromDatepickerProps={{
                                                label: intlHelper(intl, 'arbeidstidPeriodeForm.fraOgMed.label'),
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
                                                label: intlHelper(intl, 'arbeidstidPeriodeForm.tilOgMed.label'),
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
                                    <FormComponents.RadioPanelGroup
                                        name={FormFields.tidFasteDagerEllerProsent}
                                        legend={intlHelper(
                                            intl,
                                            'arbeidstidPeriodeForm.tidFasteDagerEllerProsent.label',
                                            intlValues
                                        )}
                                        useTwoColumns={true}
                                        radios={[
                                            {
                                                label: intlHelper(
                                                    intl,
                                                    'arbeidstidPeriodeForm.tidFasteDagerEllerProsent.prosent'
                                                ),
                                                value: TidFasteDagerEllerProsent.prosent,
                                            },
                                            {
                                                label: intlHelper(
                                                    intl,
                                                    'arbeidstidPeriodeForm.tidFasteDagerEllerProsent.timer'
                                                ),
                                                value: TidFasteDagerEllerProsent.tidFasteDager,
                                            },
                                        ]}
                                        validate={getRequiredFieldValidator()}
                                    />
                                </FormBlock>

                                {tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.prosent && (
                                    <FormBlock>
                                        <FormComponents.NumberInput
                                            name={FormFields.prosent}
                                            bredde="XS"
                                            maxLength={4}
                                            label={intlHelper(intl, 'arbeidstidPeriodeForm.prosent.label', intlValues)}
                                            validate={getArbeidstidFastProsentValidator(intlValues, {
                                                min: 0,
                                                max: 100,
                                            })}
                                            suffix={getRedusertArbeidstidPerUkeInfo(intl, jobberNormaltTimer, prosent)}
                                            suffixStyle="text"
                                        />
                                    </FormBlock>
                                )}
                                {tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.tidFasteDager && (
                                    <FormBlock>
                                        <FormComponents.InputGroup
                                            legend={intlHelper(
                                                intl,
                                                'arbeidstidPeriodeForm.tidFasteDager.label',
                                                intlValues
                                            )}
                                            validate={() => validateFasteArbeidstimerIUke(tidFasteDager, intlValues)}
                                            name={'fasteDager_gruppe' as any}>
                                            <TidUkedagerInput
                                                name={FormFields.tidFasteDager}
                                                validator={getArbeidstimerFastDagValidator}
                                            />
                                        </FormComponents.InputGroup>
                                    </FormBlock>
                                )}
                                {visKnapper === false && (
                                    <FormBlock>
                                        <UnansweredQuestionsInfo>
                                            <FormattedMessage id="ubesvarteSpørsmålInfo" />
                                        </UnansweredQuestionsInfo>
                                    </FormBlock>
                                )}
                            </FormComponents.Form>
                        );
                    }}
                />
            </FormBlock>
        </div>
    );
};

export default ArbeidstidPeriodeForm;
