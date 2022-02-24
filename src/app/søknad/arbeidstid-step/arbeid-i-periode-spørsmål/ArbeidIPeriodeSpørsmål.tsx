import React, { useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    ArbeidIPeriodeIntlValues,
    getArbeidstidFastProsentValidator,
    getArbeidstidIPeriodeIntlValues,
    getArbeidstimerFastDagValidator,
    getRedusertArbeidstidPerUkeInfo,
    validateFasteArbeidstimerIUke,
} from '@navikt/sif-common-pleiepenger';
import TidFasteUkedagerInput from '@navikt/sif-common-pleiepenger/lib/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { getWeeksInDateRange } from '@navikt/sif-common-utils';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeField, Arbeidsforhold, ArbeidsforholdFrilanser } from '../../../types/SøknadFormData';
import { søkerKunHelgedager } from '../../../utils/formDataUtils';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidstidTimerEllerProsentValidator,
    getJobberIPeriodenValidator,
} from '../../../validation/validateArbeidFields';
import SøknadFormComponents from '../../SøknadFormComponents';
import { StepID } from '../../søknadStepsConfig';
import ArbeidstidVariert from '../arbeidstid-variert/ArbeidstidVariert';
import InfoSøkerKunHelgedager from './InfoSøkerKunHelgedager';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    periode: DateRange;
}

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    periode,
    arbeidsstedNavn,
}: Props) => {
    const intl = useIntl();
    const history = useHistory();
    const { persist } = usePersistSoknad(history);
    const [arbeidstidChanged, setArbeidstidChanged] = useState(false);

    useEffect(() => {
        if (arbeidstidChanged === true) {
            setArbeidstidChanged(false);
            persist(StepID.ARBEIDSTID);
        }
    }, [arbeidstidChanged, persist]);

    const { jobberNormaltTimer } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        return <AlertStripeFeil>Det mangler informasjon om hvor mye du jobber normalt</AlertStripeFeil>;
    }

    const intlValues = getArbeidstidIPeriodeIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            jobberNormaltTimer,
            type: arbeidsforholdType,
        },
        periode,
    });

    const getFieldName = (field: ArbeidIPeriodeField) => `${parentFieldName}.arbeidIPeriode.${field}` as any;

    const { arbeidIPeriode } = arbeidsforhold;
    const { jobberIPerioden, timerEllerProsent, erLiktHverUke, jobberProsent } = arbeidIPeriode || {};
    const erKortPeriode = getWeeksInDateRange(periode).length < 4;

    const renderArbeidstidVariertPart = (kanLeggeTilPeriode: boolean) => (
        <ArbeidstidVariert
            arbeidstid={arbeidsforhold.arbeidIPeriode?.enkeltdager}
            kanLeggeTilPeriode={kanLeggeTilPeriode}
            jobberNormaltTimer={jobberNormaltTimerNumber}
            periode={periode}
            intlValues={intlValues}
            arbeidsstedNavn={arbeidsstedNavn}
            arbeidsforholdType={arbeidsforholdType}
            formFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
            onArbeidstidChanged={() => setArbeidstidChanged(true)}
        />
    );

    return (
        <>
            <SøknadFormComponents.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeField.jobberIPerioden)}
                legend={intlHelper(intl, `arbeidIPeriode.jobberIPerioden.spm`, intlValues)}
                useTwoColumns={true}
                validate={getJobberIPeriodenValidator(intlValues)}
                radios={getJobberIPeriodenRadios(intl)}
            />

            {jobberIPerioden === JobberIPeriodeSvar.JA && erKortPeriode === true && (
                <FormBlock>
                    <ResponsivePanel>{renderArbeidstidVariertPart(false)}</ResponsivePanel>
                </FormBlock>
            )}

            {jobberIPerioden === JobberIPeriodeSvar.JA && erKortPeriode === false && (
                <>
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
                            legend={intlHelper(intl, `arbeidIPeriode.erLiktHverUke.spm`, intlValues)}
                            validate={getArbeidErLiktHverUkeValidator(intlValues)}
                            useTwoColumns={true}
                            labels={{
                                yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                            }}
                        />
                    </FormBlock>

                    {erLiktHverUke === YesOrNo.NO && (
                        <FormBlock margin="l">
                            <ResponsivePanel>
                                {renderArbeidstidVariertPart(true)}

                                {søkerKunHelgedager(periode.from, periode.to) && (
                                    <Box margin="xl">
                                        <InfoSøkerKunHelgedager />
                                    </Box>
                                )}
                            </ResponsivePanel>
                        </FormBlock>
                    )}

                    {erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <SøknadFormComponents.RadioPanelGroup
                                name={getFieldName(ArbeidIPeriodeField.timerEllerProsent)}
                                legend={intlHelper(intl, `arbeidIPeriode.timerEllerProsent.spm`, intlValues)}
                                useTwoColumns={true}
                                radios={getTimerEllerProsentRadios(intl, intlValues)}
                                validate={getArbeidstidTimerEllerProsentValidator(intlValues)}
                            />
                            {timerEllerProsent === TimerEllerProsent.PROSENT && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <SøknadFormComponents.NumberInput
                                            name={getFieldName(ArbeidIPeriodeField.jobberProsent)}
                                            bredde="XS"
                                            maxLength={4}
                                            label={intlHelper(intl, 'arbeidIPeriode.jobberProsent.spm', intlValues)}
                                            validate={(value) => {
                                                const error = getArbeidstidFastProsentValidator({ max: 100, min: 1 })(
                                                    value
                                                );
                                                return error
                                                    ? {
                                                          key: `validation.arbeidIPeriode.fast.prosent.${error.key}`,
                                                          values: { ...intlValues, min: 1, max: 100 },
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                            suffix={getRedusertArbeidstidPerUkeInfo(
                                                intl,
                                                jobberNormaltTimer,
                                                jobberProsent
                                            )}
                                            suffixStyle="text"
                                        />
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                            {timerEllerProsent === TimerEllerProsent.TIMER && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <SøknadFormComponents.InputGroup
                                            legend={intlHelper(intl, 'arbeidIPeriode.ukedager.tittel', intlValues)}
                                            validate={() => {
                                                const error = validateFasteArbeidstimerIUke(arbeidIPeriode?.fasteDager);
                                                return error
                                                    ? {
                                                          key: `validation.arbeidIPeriode.timer.${error.key}`,
                                                          values: intlValues,
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                            name={'fasteDager.gruppe' as any}>
                                            <TidFasteUkedagerInput
                                                name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                                validateDag={(dag, value) => {
                                                    const error = getArbeidstimerFastDagValidator()(value);
                                                    return error
                                                        ? {
                                                              key: `validation.arbeidIPeriode.fast.tid.${error}`,
                                                              keepKeyUnaltered: true,
                                                              values: { ...intlValues, dag },
                                                          }
                                                        : undefined;
                                                }}
                                            />
                                        </SøknadFormComponents.InputGroup>
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                        </FormBlock>
                    )}
                </>
            )}
        </>
    );
};

const getJobberIPeriodenRadios = (intl: IntlShape) => [
    {
        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.JA}`),
        value: JobberIPeriodeSvar.JA,
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.NEI}`),
        value: JobberIPeriodeSvar.NEI,
    },
];

const getTimerEllerProsentRadios = (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues) => [
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.prosent`, intlValues),
        value: TimerEllerProsent.PROSENT,
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
        value: TimerEllerProsent.TIMER,
    },
];

export default ArbeidIPeriodeSpørsmål;
