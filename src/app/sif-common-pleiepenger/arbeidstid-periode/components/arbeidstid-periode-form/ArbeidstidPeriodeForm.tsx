import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, getTypedFormComponents } from '@navikt/sif-common-formik';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateRangeValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { dateToISODate, Duration, DurationWeekdays, getWeekdayDOW, Weekday } from '@navikt/sif-common-utils';
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
import { ArbeiderIPeriodenSvar } from '../../../../types/ArbeidIPeriodeFormData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

export interface ArbeidstidPeriodeFormProps {
    arbeidsstedNavn: string;
    periode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
    arbeiderNormaltTimerFasteUkedager?: DurationWeekdays;
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
    'heleSøknadsperioden' = 'heleSøknadsperioden',
    'arbeiderHvordan' = 'arbeiderHvordan',
    'tidFasteDagerEllerProsent' = 'tidFasteDagerEllerProsent',
    'tidFasteDager' = 'tidFasteDager',
    'prosent' = 'prosent',
}

const noDuration: Duration = { hours: '0', minutes: '0' };
const emptyDurationWeekdays: DurationWeekdays = {
    monday: noDuration,
    tuesday: noDuration,
    wednesday: noDuration,
    thursday: noDuration,
    friday: noDuration,
};

interface FormValues {
    [FormFields.fom]: InputDateString;
    [FormFields.tom]: InputDateString;
    [FormFields.heleSøknadsperioden]?: boolean;
    [FormFields.arbeiderHvordan]?: ArbeiderIPeriodenSvar;
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
    arbeiderNormaltTimerFasteUkedager,
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

        switch (values.arbeiderHvordan) {
            case ArbeiderIPeriodenSvar.heltFravær:
                onSubmit({ fom, tom, tidFasteDager: emptyDurationWeekdays });
                break;
            case ArbeiderIPeriodenSvar.somVanlig:
                onSubmit({ fom, tom, tidFasteDager: arbeiderNormaltTimerFasteUkedager });
                break;
            case ArbeiderIPeriodenSvar.redusert:
                onSubmit({
                    fom,
                    tom,
                    prosent:
                        SPØR_OM_PROSENT && values.tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.prosent
                            ? values.prosent
                            : undefined,
                    tidFasteDager:
                        SPØR_OM_PROSENT === false ||
                        values.tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.tidFasteDager
                            ? values.tidFasteDager
                            : undefined,
                });
        }
    };

    const disabledDaysOfWeekDayNumber = utilgjengeligeUkedager
        ? utilgjengeligeUkedager.map((dag) => getWeekdayDOW(dag))
        : [];

    const SPØR_OM_PROSENT = false;
    const MÅ_VELGE_PERIODE_FØRST = 1 + 1 == 2;

    return (
        <div>
            <Undertittel tag="h1" className="dialogFormTitle">
                {arbIntl.intlText('arbeidstidPeriodeForm.tittel', { arbeidsstedNavn })}
            </Undertittel>
            <p>Arbeidstid i perioden du velger her, vil overskrive det som evt. allerede ligger i kalenderen.</p>
            <FormBlock margin="xl">
                <FormComponents.FormikWrapper
                    initialValues={initialFormValues}
                    onSubmit={onValidSubmit}
                    renderForm={({
                        values: {
                            fom,
                            tom,
                            tidFasteDagerEllerProsent,
                            tidFasteDager,
                            prosent,
                            arbeiderHvordan,
                            heleSøknadsperioden,
                        },
                        setFieldValue,
                        validateForm,
                    }) => {
                        const from = datepickerUtils.getDateFromDateString(fom);
                        const to = datepickerUtils.getDateFromDateString(tom);

                        const handleHeleSøknadsperiodenChange = (velgHeleSøknadsperioden?: boolean) => {
                            if (velgHeleSøknadsperioden) {
                                setFieldValue(FormFields.fom, dateToISODate(periode.from));
                                setFieldValue(FormFields.tom, dateToISODate(periode.to));
                            }
                        };

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
                                                disabled: heleSøknadsperioden === true,
                                                minDate: periode.from,
                                                maxDate: to || periode.to,
                                                validate: getDateRangeValidator({
                                                    required: true,
                                                    onlyWeekdays: false,
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
                                                disabled: heleSøknadsperioden === true,
                                                dayPickerProps: {
                                                    initialMonth: from || periode.from,
                                                },
                                                validate: getDateRangeValidator({
                                                    required: true,
                                                    onlyWeekdays: false,
                                                    toDate: to,
                                                    fromDate: from,
                                                    min: from || periode.from,
                                                    max: periode.to,
                                                }).validateToDate,
                                            }}
                                        />
                                        <Box>
                                            <FormComponents.Checkbox
                                                label="Velg hele søknadsperioden"
                                                name={FormFields.heleSøknadsperioden}
                                                afterOnChange={handleHeleSøknadsperiodenChange}
                                            />
                                        </Box>
                                    </FormBlock>
                                </div>

                                {((fom && tom) || MÅ_VELGE_PERIODE_FØRST === false) && (
                                    <>
                                        <FormBlock>
                                            <FormComponents.RadioPanelGroup
                                                name={FormFields.arbeiderHvordan}
                                                legend="Hvordan jobber du her i denne perioden?"
                                                radios={[
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            'arbeidIPeriode.arbeiderIPerioden.svar.jobberIkke'
                                                        ),
                                                        value: ArbeiderIPeriodenSvar.heltFravær,
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            'arbeidIPeriode.arbeiderIPerioden.svar.jobberRedusert'
                                                        ),
                                                        value: ArbeiderIPeriodenSvar.redusert,
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            'arbeidIPeriode.arbeiderIPerioden.svar.jobberVanlig'
                                                        ),
                                                        value: ArbeiderIPeriodenSvar.somVanlig,
                                                    },
                                                ]}></FormComponents.RadioPanelGroup>
                                        </FormBlock>

                                        {arbeiderHvordan === ArbeiderIPeriodenSvar.redusert && SPØR_OM_PROSENT && (
                                            <>
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
                                                                label: 'Prosent av normalt per dag',
                                                                value: TidFasteDagerEllerProsent.prosent,
                                                            },
                                                            {
                                                                label: 'Timer per ukedag',
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
                                            </>
                                        )}
                                        {tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.prosent && (
                                            <FormBlock>
                                                <FormComponents.NumberInput
                                                    name={FormFields.prosent}
                                                    bredde="XS"
                                                    maxLength={4}
                                                    label={arbIntl.intlText(
                                                        'arbeidstidPeriodeForm.prosent.label',
                                                        intlValues
                                                    )}
                                                    description={
                                                        jobberNormaltTimer === undefined ? (
                                                            <ExpandableInfo title="Vi reduserer likt hver dag du jobber">
                                                                Dette vil si at dersom du jobber normalt 4 timer på
                                                                mandag og 8 timer på onsdag, og du skal nå jobbe 50%,
                                                                vil vi endre arbeidstiden din til 2 timer på mandag og 4
                                                                timer på onsdag.
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
                                                            ? getRedusertArbeidstidPerUkeInfo(
                                                                  intl,
                                                                  jobberNormaltTimer,
                                                                  prosent
                                                              )
                                                            : undefined
                                                    }
                                                    suffixStyle="text"
                                                />
                                            </FormBlock>
                                        )}
                                        {(tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.tidFasteDager ||
                                            (!SPØR_OM_PROSENT &&
                                                arbeiderHvordan === ArbeiderIPeriodenSvar.redusert)) && (
                                            <FormBlock>
                                                <FormComponents.InputGroup
                                                    legend={'Fyll ut hvor mye du jobber de ulike ukedagene perioden:'}
                                                    // legend={arbIntl.intlText(
                                                    //     'arbeidstidPeriodeForm.tidFasteDager.label',
                                                    //     intlValues
                                                    // )}
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
                                    </>
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
