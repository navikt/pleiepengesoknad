import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType, TimerEllerProsent, JobberIPeriodeSvar } from '../../../types';
import {
    SøknadFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    isArbeidsforholdAnsatt,
} from '../../../types/SøknadFormData';
import { getTimerTekst } from '../../../utils/arbeidsforholdUtils';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidJobberValidator,
    getArbeidstidProsentValidator,
    getArbeidstidTimerEllerProsentValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from '../../../validation/validateArbeidFields';
import SøknadFormComponents from '../../SøknadFormComponents';
import TidFasteDagerInput from '../../../components/tid-faste-dager-input/TidFasteDagerInput';
import ArbeidstidKalenderInput from './ArbeidstidKalenderInput';
import { getRedusertArbeidstidSomIso8601Duration } from '../../../utils/formToApiMaps/tidsbrukApiUtils';
import { decimalTimeToTime, iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { formatTimerOgMinutter } from '../../../components/timer-og-minutter/TimerOgMinutter';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold;
    arbeidsforholdType: ArbeidsforholdType;
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
        const timerPerDage = normalTimer / 5;
        const varighet = iso8601DurationToTime(getRedusertArbeidstidSomIso8601Duration(timerPerDage, prosent));
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

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    erHistorisk,
    arbeidsforholdType,
    periode,
    søknadsdato,
}: Props) => {
    const intl = useIntl();

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

    const { jobberNormaltTimer } = arbeidsforhold;

    const ErLiktHverUkeSpørsmål = () => (
        <SøknadFormComponents.YesOrNoQuestion
            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
            legend={erHistorisk ? 'Jobbet du likt i hele perioden?' : 'Skal du jobbe likt i hele perioden?'}
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
                    value: TimerEllerProsent.prosent,
                },
                {
                    label: intlHelper(
                        intl,
                        `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}timerEllerProsent.timer`,
                        intlValues
                    ),
                    value: TimerEllerProsent.timer,
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

                    {jobberIPerioden === JobberIPeriodeSvar.JA && (
                        <>
                            {erLiktHverUke === YesOrNo.YES && (
                                <>
                                    <FormBlock>
                                        <TimerEllerProsentSpørsmål />
                                    </FormBlock>
                                    {timerEllerProsent === TimerEllerProsent.prosent && (
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
                                    {timerEllerProsent === TimerEllerProsent.timer && (
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
                                                    validateFasteArbeidstimerIUke(arbeidIPeriode, intlValues)
                                                }
                                                name={'fasteDager_gruppe' as any}
                                                description={
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
                            {erLiktHverUke === YesOrNo.NO && (
                                <FormBlock>
                                    <ArbeidstidKalenderInput
                                        periode={periode}
                                        tidMedArbeid={arbeidIPeriode?.enkeltdager}
                                        intlValues={intlValues}
                                        enkeltdagerFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                                        søknadsdato={søknadsdato}
                                    />
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
