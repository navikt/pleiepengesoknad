import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateRangeValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { DurationWeekdays, getWeekdayDOW, Weekday } from '@navikt/sif-common-utils';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import { getArbeidstidPeriodeIntl } from '../../i18n/arbeidstidPeriodeMessages';
import { getRedusertArbeidstidPerUkeInfo } from '../../utils/arbeidstidPeriodeUtils';
import {
    getArbeidstidFastProsentValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from './arbeidstidPeriodeFormValidation';
import { ArbeidIPeriodeIntlValues, TidFasteUkedagerInput } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidstidPeriodeData } from '../../types';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

export interface ArbeidstidPeriodeFormProps {
    arbeidsstedNavn: string;
    periode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
    /** Brukes kun i søknad hvor bruker har oppgitt jobberNormaltTimer for hele tilgjengelige periode */
    jobberNormaltTimer?: number;
    utilgjengeligeUkedager?: Weekday[];
    skjulUtilgjengeligeUkedager?: boolean;
    onSubmit: (data: ArbeidstidPeriodeData) => void;
    onCancel: () => void;
}

enum TidFasteDagerEllerProsent {
    prosent = 'prosent',
    tidFasteDager = 'tidFasteDager',
}

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
    [FormFields.tidFasteDager]?: DurationWeekdays;
}

const initialFormValues: Partial<FormValues> = {};

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const ArbeidstidPeriodeForm: React.FunctionComponent<ArbeidstidPeriodeFormProps> = ({
    arbeidsstedNavn,
    periode,
    intlValues,
    jobberNormaltTimer,
    utilgjengeligeUkedager,
    skjulUtilgjengeligeUkedager,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();
    const arbIntl = getArbeidstidPeriodeIntl(intl);

    const onValidSubmit = (values: Partial<FormValues>) => {
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

    const disabledDaysOfWeekDayNumber = utilgjengeligeUkedager
        ? utilgjengeligeUkedager.map((dag) => getWeekdayDOW(dag))
        : [];

    return (
        <div>
            <Undertittel tag="h1" className="dialogFormTitle">
                {arbIntl.intlText('arbeidstidPeriodeForm.tittel', { arbeidsstedNavn })}
            </Undertittel>
            <FormBlock margin="xl">
                <FormComponents.FormikWrapper
                    initialValues={initialFormValues}
                    onSubmit={onValidSubmit}
                    renderForm={({
                        values: { fom, tom, tidFasteDagerEllerProsent, tidFasteDager, prosent },
                        validateForm,
                    }) => {
                        const from = datepickerUtils.getDateFromDateString(fom);
                        const to = datepickerUtils.getDateFromDateString(tom);
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'arbeidstidPeriodeForm.validation')}
                                includeValidationSummary={true}
                                includeButtons={true}
                                submitButtonLabel={arbIntl.intlText('arbeidstidPeriodeForm.submitButtonLabel')}
                                cancelButtonLabel={arbIntl.intlText('arbeidstidPeriodeForm.cancelButtonLabel')}>
                                <div style={{ maxWidth: '20rem' }}>
                                    <FormBlock>
                                        <FormComponents.DateIntervalPicker
                                            fromDatepickerProps={{
                                                label: arbIntl.intlText('arbeidstidPeriodeForm.fraOgMed.label'),
                                                name: FormFields.fom,
                                                disableWeekend: true,
                                                fullScreenOnMobile: true,
                                                fullscreenOverlay: true,
                                                disabledDaysOfWeek: disabledDaysOfWeekDayNumber,
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
                                                label: arbIntl.intlText('arbeidstidPeriodeForm.tilOgMed.label'),
                                                name: FormFields.tom,
                                                disableWeekend: true,
                                                disabledDaysOfWeek: disabledDaysOfWeekDayNumber,
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
                                    <FormComponents.RadioPanelGroup
                                        name={FormFields.tidFasteDagerEllerProsent}
                                        legend={arbIntl.intlText(
                                            'arbeidstidPeriodeForm.tidFasteDagerEllerProsent.label',
                                            intlValues
                                        )}
                                        useTwoColumns={true}
                                        /** Usikker på hvorfor valideringen feiler her, men delay fikser det midlertidig */
                                        afterOnChange={() => setTimeout(validateForm, 10)}
                                        radios={[
                                            {
                                                label: arbIntl.intlText(
                                                    'arbeidstidPeriodeForm.tidFasteDagerEllerProsent.prosent'
                                                ),
                                                value: TidFasteDagerEllerProsent.prosent,
                                            },
                                            {
                                                label: arbIntl.intlText(
                                                    'arbeidstidPeriodeForm.tidFasteDagerEllerProsent.timer'
                                                ),
                                                value: TidFasteDagerEllerProsent.tidFasteDager,
                                            },
                                        ]}
                                        validate={(value) => {
                                            const error = getRequiredFieldValidator()(value);
                                            if (error) {
                                                return {
                                                    key: error,
                                                    values: intlValues,
                                                };
                                            }
                                            return undefined;
                                        }}
                                    />
                                </FormBlock>

                                {tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.prosent && (
                                    <FormBlock>
                                        <FormComponents.NumberInput
                                            name={FormFields.prosent}
                                            bredde="XS"
                                            maxLength={4}
                                            label={arbIntl.intlText('arbeidstidPeriodeForm.prosent.label', intlValues)}
                                            description={
                                                jobberNormaltTimer === undefined ? (
                                                    <ExpandableInfo title="Vi reduserer likt hver dag du jobber">
                                                        Dette vil si at dersom du jobber normalt 4 timer på mandag og 8
                                                        timer på onsdag, og du skal nå jobbe 50%, vil vi endre
                                                        arbeidstiden din til 2 timer på mandag og 4 timer på onsdag.
                                                    </ExpandableInfo>
                                                ) : undefined
                                            }
                                            validate={(value) => {
                                                const error = getArbeidstidFastProsentValidator({
                                                    min: 0,
                                                    max: 100,
                                                })(value);
                                                return error
                                                    ? {
                                                          key: error.key,
                                                          values: { ...intlValues, ...error.values },
                                                      }
                                                    : undefined;
                                            }}
                                            suffix={
                                                jobberNormaltTimer !== undefined
                                                    ? getRedusertArbeidstidPerUkeInfo(intl, jobberNormaltTimer, prosent)
                                                    : undefined
                                            }
                                            suffixStyle="text"
                                        />
                                    </FormBlock>
                                )}
                                {tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.tidFasteDager && (
                                    <FormBlock>
                                        <FormComponents.InputGroup
                                            legend={arbIntl.intlText(
                                                'arbeidstidPeriodeForm.tidFasteDager.label',
                                                intlValues
                                            )}
                                            validate={() => {
                                                const error = validateFasteArbeidstimerIUke(tidFasteDager);
                                                return error
                                                    ? {
                                                          key: error.key,
                                                          values: intlValues,
                                                      }
                                                    : undefined;
                                            }}
                                            name={'fasteDager.gruppe' as any}>
                                            <TidFasteUkedagerInput
                                                name={FormFields.tidFasteDager}
                                                disabledDays={utilgjengeligeUkedager}
                                                hideDisabledDays={skjulUtilgjengeligeUkedager}
                                                validateDag={(dag, value) => {
                                                    const error = getArbeidstimerFastDagValidator()(value);
                                                    return error
                                                        ? {
                                                              key: `arbeidstidPeriodeForm.validation.tidFasteDager.tid.${error}`,
                                                              keepKeyUnaltered: true,
                                                              values: { ...intlValues, dag },
                                                          }
                                                        : undefined;
                                                }}
                                            />
                                        </FormComponents.InputGroup>
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
