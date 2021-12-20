import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime, iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getWeeksInDateRange } from '@navikt/sif-common-utils';
import AlertStripe, { AlertStripeFeil } from 'nav-frontend-alertstriper';
import TidUkedagerInput from '../../components/tid-ukedager-input/TidUkedagerInput';
import { formatTimerOgMinutter } from '../../components/timer-og-minutter/TimerOgMinutter';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import { ArbeidsforholdType, JobberIPeriodeSvar, TimerEllerProsent } from '../../types';
import {
    ArbeidIPeriodeField,
    Arbeidsforhold,
    isArbeidsforholdAnsatt,
    SøknadFormField,
} from '../../types/SøknadFormData';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import { getRedusertArbeidstidSomIso8601Duration } from '../../utils/formToApiMaps/tidsbrukApiUtils';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidJobberValidator,
    getArbeidstidFastProsentValidator,
    getArbeidstidTimerEllerProsentValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
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
    erHistorisk: boolean;
}

export type ArbeidIPeriodeIntlValues = {
    hvor: string;
    skalEllerHarJobbet: string;
    timer: string;
    fra: string;
    til: string;
    iPerioden: string;
    iPeriodenKort: string;
};

export const getRedusertArbeidstidPerUkeInfo = (
    intl: IntlShape,
    jobberNormaltTimer: string | number | undefined,
    skalJobbeProsent: string | undefined
): string => {
    const normalTimer =
        typeof jobberNormaltTimer === 'number' ? jobberNormaltTimer : getNumberFromNumberInputValue(jobberNormaltTimer);
    const prosent = getNumberFromNumberInputValue(skalJobbeProsent);
    if (normalTimer !== undefined && prosent !== undefined) {
        const varighet = iso8601DurationToTime(getRedusertArbeidstidSomIso8601Duration(normalTimer / 5, prosent));
        if (varighet) {
            return intlHelper(intl, 'arbeidIPeriode.prosent.utledet.medTimer', {
                timerNormalt: formatTimerOgMinutter(intl, decimalTimeToTime(normalTimer)),
                timerRedusert: formatTimerOgMinutter(intl, {
                    hours: `${varighet.hours}` || '',
                    minutes: `${varighet.minutes}`,
                }),
            });
        }
    }
    return '';
};

export const getTimerTekst = (intl: IntlShape, value: string | undefined): string => {
    const timer = getNumberFromNumberInputValue(value);
    if (timer) {
        return intlHelper(intl, 'timer', {
            timer,
        });
    }
    return intlHelper(intl, 'timer.ikkeTall', {
        timer: value,
    });
};

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    erHistorisk,
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
            persist(erHistorisk ? StepID.ARBEID_HISTORISK : StepID.ARBEID_PLANLAGT);
        }
    }, [erHistorisk, arbeidstidChanged, persist]);

    if (jobberNormaltTimerNumber === undefined) {
        return <AlertStripeFeil>Det mangler informasjon om hvor mye du jobber normalt</AlertStripeFeil>;
    }

    const intlValues: ArbeidIPeriodeIntlValues = {
        skalEllerHarJobbet: intlHelper(
            intl,
            erHistorisk ? 'arbeidIPeriode.jobberIPerioden.historisk' : 'arbeidIPeriode.jobberIPerioden.planlagt'
        ),
        hvor: isArbeidsforholdAnsatt(arbeidsforhold)
            ? intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsforhold.navn })
            : intlHelper(intl, `arbeidsforhold.part.som.${arbeidsforholdType}`),
        timer: getTimerTekst(intl, arbeidsforhold.jobberNormaltTimer),
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
        iPerioden: intlHelper(intl, 'arbeidIPeriode.iPerioden.part', {
            fra: prettifyDate(periode.from),
            til: prettifyDate(periode.to),
        }),
        iPeriodenKort: intlHelper(intl, 'arbeidIPeriode.iPerioden.part', {
            fra: prettifyDateFull(periode.from),
            til: prettifyDateFull(periode.to),
        }),
    };

    const getFieldName = (field: ArbeidIPeriodeField) =>
        `${parentFieldName}.${erHistorisk ? 'historisk' : 'planlagt'}.${field}` as SøknadFormField;

    const getSpørsmål = (spørsmål: ArbeidIPeriodeField) =>
        intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}${spørsmål}.spm`, intlValues as any);

    const arbeidIPeriode = erHistorisk ? arbeidsforhold?.historisk : arbeidsforhold?.planlagt;

    const { jobberIPerioden, timerEllerProsent, erLiktHverUke, skalJobbeProsent } = arbeidIPeriode || {};

    const erKortPeriode = getWeeksInDateRange(periode).length < 4;

    const JobbetLiktIHelePeriodenSpørsmål = () => (
        <SøknadFormComponents.YesOrNoQuestion
            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
            legend={getSpørsmål(ArbeidIPeriodeField.erLiktHverUke)}
            validate={getArbeidErLiktHverUkeValidator(intlValues)}
            useTwoColumns={true}
            labels={{
                yes: intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.ja`),
                no: intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.nei`),
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
                    label: intlHelper(
                        intl,
                        `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}timerEllerProsent.prosent`,
                        intlValues
                    ),
                    value: TimerEllerProsent.PROSENT,
                },
                {
                    label: intlHelper(
                        intl,
                        `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}timerEllerProsent.timer`,
                        intlValues
                    ),
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
                            arbeidstid={
                                erHistorisk
                                    ? arbeidsforhold.historisk?.enkeltdager
                                    : arbeidsforhold.planlagt?.enkeltdager
                            }
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
                                    arbeidstid={
                                        erHistorisk
                                            ? arbeidsforhold.historisk?.enkeltdager
                                            : arbeidsforhold.planlagt?.enkeltdager
                                    }
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
                                            name={getFieldName(ArbeidIPeriodeField.skalJobbeProsent)}
                                            bredde="XS"
                                            maxLength={4}
                                            label={intlHelper(
                                                intl,
                                                erHistorisk
                                                    ? 'arbeidIPeriode.historisk.skalJobbeProsent.spm'
                                                    : 'arbeidIPeriode.skalJobbeProsent.spm',

                                                intlValues
                                            )}
                                            validate={getArbeidstidFastProsentValidator(intlValues)}
                                            suffix={getRedusertArbeidstidPerUkeInfo(
                                                intl,
                                                jobberNormaltTimer,
                                                skalJobbeProsent
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
                                            legend={intlHelper(
                                                intl,
                                                erHistorisk
                                                    ? 'arbeidIPeriode.historisk.ukedager.tittel'
                                                    : 'arbeidIPeriode.planlagt.ukedager.tittel',
                                                intlValues
                                            )}
                                            validate={() =>
                                                validateFasteArbeidstimerIUke(arbeidIPeriode?.fasteDager, intlValues)
                                            }
                                            name={'fasteDager_gruppe' as any}
                                            description={
                                                1 + 1 === 2 ? (
                                                    <></>
                                                ) : (
                                                    <ExpandableInfo
                                                        title={intlHelper(intl, 'arbeidIPeriode.ukedager.info.tittel')}>
                                                        <FormattedMessage
                                                            id={
                                                                erHistorisk
                                                                    ? 'arbeidIPeriode.ukedager.historisk.info.tekst.1'
                                                                    : 'arbeidIPeriode.ukedager.planlagt.info.tekst.1'
                                                            }
                                                            tagName="p"
                                                        />
                                                        <FormattedMessage
                                                            id={
                                                                erHistorisk
                                                                    ? 'arbeidIPeriode.ukedager.historisk.info.tekst.2'
                                                                    : 'arbeidIPeriode.ukedager.planlagt.info.tekst.2'
                                                            }
                                                            tagName="p"
                                                        />
                                                    </ExpandableInfo>
                                                )
                                            }>
                                            <TidUkedagerInput
                                                name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                                validator={getArbeidstimerFastDagValidator}
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
