import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange, getTypedFormComponents, UnansweredQuestionsInfo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateRangeValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import TidFasteDagerInput from '../../components/tid-faste-dager-input/TidFasteDagerInput';
import { TidFasteDager } from '../../types';
import { getArbeidstidProsentValidator, validateFasteArbeidstimerIUke } from '../../validation/validateArbeidFields';
import {
    ArbeidIPeriodeIntlValues,
    getRedusertArbeidstidPerUkeInfo,
} from '../../søknad/arbeid-i-periode-steps/ArbeidIPeriodeSpørsmål';

interface Props {
    arbeidsstedNavn: string;
    rammePeriode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
    jobberNormaltTimer: string;
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
    tidFasteDager?: TidFasteDager;
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
    [FormFields.tidFasteDager]?: TidFasteDager;
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
                Periode med arbeid - {arbeidsstedNavn}
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
                                submitButtonLabel="Ok"
                                cancelButtonLabel="Avbryt">
                                <div style={{ maxWidth: '20rem' }}>
                                    <FormBlock>
                                        <FormComponents.DateIntervalPicker
                                            fromDatepickerProps={{
                                                label: 'Fra og med',
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
                                                label: 'Til og med',
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
                                        legend="Hvordan ønsker du å oppgi hvor mye du skal jobbe disse dagene?"
                                        useTwoColumns={true}
                                        radios={[
                                            {
                                                label: 'I prosent',
                                                value: TidFasteDagerEllerProsent.prosent,
                                            },
                                            {
                                                label: 'I timer',
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
                                            maxLength={3}
                                            label="Hvor mange prosent skal du jobbe i denne perioden?"
                                            // validate={getNumberValidator({ min: 0, max: 99 })}
                                            // description={
                                            //     <ExpandableInfo title="Viktig når du oppgir arbeidstid i prosent">
                                            //         Når du oppgir i prosent, betyr dette at.
                                            //     </ExpandableInfo>
                                            // }
                                            validate={getArbeidstidProsentValidator(intlValues, { min: 0, max: 100 })}
                                            suffix={getRedusertArbeidstidPerUkeInfo(intl, jobberNormaltTimer, prosent)}
                                            suffixStyle="text"
                                        />
                                    </FormBlock>
                                )}
                                {tidFasteDagerEllerProsent === TidFasteDagerEllerProsent.tidFasteDager && (
                                    <FormBlock>
                                        <FormComponents.InputGroup
                                            legend={'Oppgi hvor mye du jobber disse ukedagene.'}
                                            validate={() => validateFasteArbeidstimerIUke(tidFasteDager, intlValues)}
                                            name={'fasteDager_gruppe' as any}
                                            description={
                                                <ExpandableInfo title={'Hva betyr dette?'}>
                                                    <p>Du skal bare fylle ut på den ukedagen du faktisk skal jobbe.</p>
                                                    <p>
                                                        Hvis du for eksempel skal jobbe 2 timer mandag og 4 timer
                                                        fredag, må du fylle ut 2 timer for mandag og 4 timer for fredag.
                                                        Du skal altså ikke fylle ut 6 timer på en og samme dag.
                                                    </p>
                                                </ExpandableInfo>
                                            }>
                                            <TidFasteDagerInput name={FormFields.tidFasteDager} />
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
