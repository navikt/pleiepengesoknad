import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime, iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import TidFasteDagerInput from '../../components/tid-faste-dager-input/TidFasteDagerInput';
import { formatTimerOgMinutter } from '../../components/timer-og-minutter/TimerOgMinutter';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import { ArbeidsforholdType, JobberIPeriodeSvar, TimerEllerProsent } from '../../types';
import {
    ArbeidIPeriodeField,
    Arbeidsforhold,
    isArbeidsforholdAnsatt,
    SøknadFormField,
} from '../../types/SøknadFormData';
import { getRedusertArbeidstidSomIso8601Duration } from '../../utils/formToApiMaps/tidsbrukApiUtils';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidJobberValidator,
    getArbeidstidProsentValidator,
    getArbeidstidTimerEllerProsentValidator,
    getArbeidstimerFastDagValidator,
    validateArbeidsTidEnkeltdager,
    validateFasteArbeidstimerIUke,
} from '../../validation/validateArbeidFields';
import SøknadFormComponents from '../SøknadFormComponents';
import { StepID } from '../søknadStepsConfig';
import ArbeidstidVariert from './arbeidstid-variert/ArbeidstidVariert';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    periode: DateRange;
    erHistorisk: boolean;
    søknadsdato: Date;
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
    jobberNormaltTimer: string | undefined,
    skalJobbeProsent: string | undefined
): string => {
    const normalTimer = getNumberFromNumberInputValue(jobberNormaltTimer);
    const prosent = getNumberFromNumberInputValue(skalJobbeProsent);
    if (normalTimer !== undefined && prosent !== undefined) {
        const timerPerDag = normalTimer / 5;
        const varighet = iso8601DurationToTime(getRedusertArbeidstidSomIso8601Duration(timerPerDag, prosent));
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
    søknadsdato,
}: Props) => {
    const intl = useIntl();

    const history = useHistory();
    const { persist } = usePersistSoknad(history);
    const [arbeidstidChanged, setArbeidstidChanged] = useState(false);
    const { jobberNormaltTimer } = arbeidsforhold;

    useEffect(() => {
        if (arbeidstidChanged === true) {
            setArbeidstidChanged(false);
            persist(erHistorisk ? StepID.ARBEID_HISTORISK : StepID.ARBEID_PLANLAGT);
        }
    }, [erHistorisk, arbeidstidChanged, persist]);

    if (jobberNormaltTimer === undefined) {
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

    const ErLiktHverUkeSpørsmål = () => (
        <SøknadFormComponents.YesOrNoQuestion
            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
            legend={erHistorisk ? 'Jobbet du likt i hele perioden?' : 'Skal du jobbe likt hver uke i hele perioden?'}
            validate={getArbeidErLiktHverUkeValidator(intlValues)}
        />
    );

    const TimerEllerProsentSpørsmål = () => (
        <SøknadFormComponents.RadioPanelGroup
            name={getFieldName(ArbeidIPeriodeField.timerEllerProsent)}
            legend={getSpørsmål(ArbeidIPeriodeField.timerEllerProsent)}
            useTwoColumns={false}
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
            {jobberIPerioden === JobberIPeriodeSvar.JA && (
                <FormBlock margin="m">
                    <FormBlock>
                        <ErLiktHverUkeSpørsmål />
                    </FormBlock>

                    {erLiktHverUke === YesOrNo.NO && (
                        <FormBlock>
                            <SøknadFormComponents.InputGroup
                                /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
                                 * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
                                 * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
                                 * brukt.
                                 * Ikke optimalt, men det virker.
                                 */
                                name={`${getFieldName(ArbeidIPeriodeField.enkeltdager)}_dager` as any}
                                validate={() =>
                                    validateArbeidsTidEnkeltdager(
                                        arbeidIPeriode?.enkeltdager || {},
                                        periode,
                                        erHistorisk,
                                        intlValues
                                    )
                                }
                                tag="div">
                                <ArbeidstidVariert
                                    arbeidstidSøknad={
                                        erHistorisk
                                            ? arbeidsforhold.historisk?.enkeltdager
                                            : arbeidsforhold.planlagt?.enkeltdager
                                    }
                                    jobberNormaltTimer={jobberNormaltTimer}
                                    periode={periode}
                                    intlValues={intlValues}
                                    arbeidsstedNavn={arbeidsstedNavn}
                                    søknadsdato={søknadsdato}
                                    formFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                                    onArbeidstidChanged={() => setArbeidstidChanged(true)}
                                />
                            </SøknadFormComponents.InputGroup>
                        </FormBlock>
                    )}

                    {erLiktHverUke === YesOrNo.YES && (
                        <>
                            <FormBlock>
                                <TimerEllerProsentSpørsmål />
                            </FormBlock>
                            {timerEllerProsent === TimerEllerProsent.PROSENT && (
                                <FormBlock>
                                    <SøknadFormComponents.NumberInput
                                        name={getFieldName(ArbeidIPeriodeField.skalJobbeProsent)}
                                        bredde="XS"
                                        maxLength={5}
                                        label={intlHelper(
                                            intl,
                                            erHistorisk
                                                ? 'arbeidIPeriode.historisk.skalJobbeProsent.spm'
                                                : 'arbeidIPeriode.skalJobbeProsent.spm',

                                            intlValues
                                        )}
                                        validate={getArbeidstidProsentValidator(intlValues)}
                                        suffix={getRedusertArbeidstidPerUkeInfo(
                                            intl,
                                            jobberNormaltTimer,
                                            skalJobbeProsent
                                        )}
                                        suffixStyle="text"
                                    />
                                </FormBlock>
                            )}
                            {timerEllerProsent === TimerEllerProsent.TIMER && (
                                <FormBlock>
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
                                        <TidFasteDagerInput
                                            name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                            validator={getArbeidstimerFastDagValidator}
                                        />
                                    </SøknadFormComponents.InputGroup>
                                </FormBlock>
                            )}
                        </>
                    )}
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodeSpørsmål;
