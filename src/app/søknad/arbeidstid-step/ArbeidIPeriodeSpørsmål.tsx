import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    getArbeidstidFastProsentValidator,
    getArbeidstidIPeriodeIntlValues,
    getArbeidstimerFastDagValidator,
    getRedusertArbeidstidPerUkeInfo,
    validateFasteArbeidstimerIUke,
} from '@navikt/sif-common-pleiepenger';
import TidFasteUkedagerInput from '@navikt/sif-common-pleiepenger/lib/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { getWeeksInDateRange } from '@navikt/sif-common-utils';
import AlertStripe, { AlertStripeFeil } from 'nav-frontend-alertstriper';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeField, Arbeidsforhold } from '../../types/SøknadFormData';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidJobberValidator,
    getArbeidstidTimerEllerProsentValidator,
} from '../../validation/validateArbeidFields';
import SøknadFormComponents from '../SøknadFormComponents';
import { StepID } from '../søknadStepsConfig';
import ArbeidstidVariert from './arbeidstid-variert/ArbeidstidVariert';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold;
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
    const { jobberNormaltTimer } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    useEffect(() => {
        if (arbeidstidChanged === true) {
            setArbeidstidChanged(false);
            persist(StepID.ARBEIDSTID);
        }
    }, [arbeidstidChanged, persist]);

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

    const getSpørsmål = (spørsmål: ArbeidIPeriodeField) =>
        intlHelper(intl, `arbeidIPeriode.${spørsmål}.spm`, intlValues as any);

    const { arbeidIPeriode } = arbeidsforhold;

    const { jobberIPerioden, timerEllerProsent, erLiktHverUke, jobberProsent } = arbeidIPeriode || {};

    const erKortPeriode = getWeeksInDateRange(periode).length < 4;

    const JobbetLiktIHelePeriodenSpørsmål = () => (
        <SøknadFormComponents.YesOrNoQuestion
            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
            legend={getSpørsmål(ArbeidIPeriodeField.erLiktHverUke)}
            validate={getArbeidErLiktHverUkeValidator(intlValues)}
            useTwoColumns={true}
            labels={{
                yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
            }}
        />
    );

    const TimerEllerProsentSpørsmål = () => (
        <SøknadFormComponents.RadioPanelGroup
            name={getFieldName(ArbeidIPeriodeField.timerEllerProsent)}
            legend={getSpørsmål(ArbeidIPeriodeField.timerEllerProsent)}
            useTwoColumns={true}
            radios={[
                {
                    label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.prosent`, intlValues),
                    value: TimerEllerProsent.PROSENT,
                },
                {
                    label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
                    value: TimerEllerProsent.TIMER,
                },
            ]}
            validate={getArbeidstidTimerEllerProsentValidator(intlValues)}
        />
    );

    return (
        <>
            <SøknadFormComponents.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeField.jobberIPerioden)}
                legend={getSpørsmål(ArbeidIPeriodeField.jobberIPerioden)}
                useTwoColumns={true}
                validate={getArbeidJobberValidator(intlValues)}
                radios={[
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.JA}`),
                        value: JobberIPeriodeSvar.JA,
                    },
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.NEI}`),
                        value: JobberIPeriodeSvar.NEI,
                    },
                ]}
            />
            {jobberIPerioden === JobberIPeriodeSvar.JA && erKortPeriode === true && (
                <FormBlock>
                    <ResponsivePanel>
                        <ArbeidstidVariert
                            arbeidstid={arbeidsforhold.arbeidIPeriode?.enkeltdager}
                            kanLeggeTilPeriode={false}
                            jobberNormaltTimer={jobberNormaltTimerNumber}
                            periode={periode}
                            intlValues={intlValues}
                            arbeidsstedNavn={arbeidsstedNavn}
                            arbeidsforholdType={arbeidsforholdType}
                            formFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                            onArbeidstidChanged={() => setArbeidstidChanged(true)}
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
            {jobberIPerioden === JobberIPeriodeSvar.JA && erKortPeriode === false && (
                <>
                    <FormBlock>
                        <JobbetLiktIHelePeriodenSpørsmål />
                    </FormBlock>

                    {erLiktHverUke === YesOrNo.NO && (
                        <FormBlock margin="l">
                            <ResponsivePanel>
                                <ArbeidstidVariert
                                    arbeidstid={arbeidsforhold.arbeidIPeriode?.enkeltdager}
                                    kanLeggeTilPeriode={true}
                                    jobberNormaltTimer={jobberNormaltTimerNumber}
                                    periode={periode}
                                    intlValues={intlValues}
                                    arbeidsstedNavn={arbeidsstedNavn}
                                    arbeidsforholdType={arbeidsforholdType}
                                    formFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                                    onArbeidstidChanged={() => setArbeidstidChanged(true)}
                                />

                                {søkerKunHelgedager(periode.from, periode.to) && (
                                    <Box margin="xl">
                                        <AlertStripe type="advarsel">
                                            <p>
                                                <FormattedMessage id="arbeidIPeriode.søkerKunHelgedager.alert.avsnitt.1" />
                                            </p>
                                            <p>
                                                <FormattedMessage id="arbeidIPeriode.søkerKunHelgedager.alert.avsnitt.2" />
                                            </p>
                                            <p>
                                                <FormattedMessage id="arbeidIPeriode.søkerKunHelgedager.alert.avsnitt.3" />
                                            </p>
                                        </AlertStripe>
                                    </Box>
                                )}
                            </ResponsivePanel>
                        </FormBlock>
                    )}

                    {erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <TimerEllerProsentSpørsmål />

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

export default ArbeidIPeriodeSpørsmål;
