import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import {
    AppFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    isArbeidsforholdAnsatt,
    TimerEllerProsent,
} from '../../types/PleiepengesøknadFormData';
import { getTimerTekst } from '../../utils/arbeidsforholdUtils';
import { visSpørsmålOmTidErLikHverUke } from '../../utils/tidsbrukUtils';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidJobberSomVanligValidator,
    getArbeidJobberValidator,
    getArbeidstidProsentValidator,
    getArbeidstidTimerEllerProsentValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from '../../validation/validateArbeidFields';
import AppForm from '../app-form/AppForm';
import TidFasteDagerInput from '../tid-faste-dager-input/TidFasteDagerInput';
import ArbeidstidKalenderInput from './ArbeidstidKalenderInput';
import { getRedusertArbeidstidSomIso8601Duration } from '../../utils/formToApiMaps/tidsbrukApiUtils';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { formatTime } from '../timer-og-minutter/TimerOgMinutter';

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
        const timerPerUkedag = normalTimer / 5;
        const time = iso8601DurationToTime(getRedusertArbeidstidSomIso8601Duration(timerPerUkedag, prosent));
        if (time) {
            return intlHelper(intl, 'arbeidIPeriode.skalJobbeProsent.utledetTimerPerUke', {
                tid: formatTime(intl, { hours: `${time.hours}` || '', minutes: `${time.minutes}` }),
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
        `${parentFieldName}.${erHistorisk ? 'historisk' : 'planlagt'}.${field}` as AppFormField;

    const getSpørsmål = (spørsmål: ArbeidIPeriodeField) =>
        intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}${spørsmål}.spm`, intlValues as any);

    const arbeidIPeriode = erHistorisk ? arbeidsforhold?.historisk : arbeidsforhold?.planlagt;

    const { jobberIPerioden, jobberSomVanlig, timerEllerProsent, erLiktHverUke, skalJobbeProsent } =
        arbeidIPeriode || {};

    const { jobberNormaltTimer } = arbeidsforhold; // getNumberFromNumberInputValue(arbeidsforhold.jobberNormaltTimer);

    const visSpørsmålOmLiktHverUke = visSpørsmålOmTidErLikHverUke(periode);

    /** Spørsmål */
    const JobberSomVanligSpørsmål = () => (
        <AppForm.YesOrNoQuestion
            name={getFieldName(ArbeidIPeriodeField.jobberSomVanlig)}
            legend={getSpørsmål(ArbeidIPeriodeField.jobberSomVanlig)}
            useTwoColumns={false}
            labels={{
                yes: intlHelper(intl, 'arbeidIPeriode.jobberSomVanlig.somVanlig', intlValues),
                no: intlHelper(intl, 'arbeidIPeriode.jobberSomVanlig.redusert', intlValues),
            }}
            validate={getArbeidJobberSomVanligValidator(intlValues)}
        />
    );

    const ErLiktHverUkeSpørsmål = () => (
        <AppForm.YesOrNoQuestion
            name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
            legend={getSpørsmål(ArbeidIPeriodeField.erLiktHverUke)}
            useTwoColumns={false}
            labels={{
                yes: intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.erLikt`),
                no: intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.varierer`),
            }}
            validate={getArbeidErLiktHverUkeValidator(intlValues)}
        />
    );

    const TimerEllerProsentSpørsmål = () => (
        <AppForm.RadioPanelGroup
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
            <AppForm.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeField.jobberIPerioden)}
                legend={getSpørsmål(ArbeidIPeriodeField.jobberIPerioden)}
                useTwoColumns={erHistorisk === true}
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
                    ...(erHistorisk === false
                        ? [
                              {
                                  label: intlHelper(
                                      intl,
                                      `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.VET_IKKE}`
                                  ),
                                  value: JobberIPeriodeSvar.VET_IKKE,
                              },
                          ]
                        : []),
                ]}
            />
            {jobberIPerioden === JobberIPeriodeSvar.VET_IKKE && (
                <Box margin="l">
                    <AlertStripeInfo>
                        {intlHelper(intl, 'arbeidIPeriode.jobberIPerioden.VET_IKKE.AlertStripeInfo')}
                    </AlertStripeInfo>
                </Box>
            )}
            {jobberIPerioden === JobberIPeriodeSvar.JA && (
                <FormBlock margin="m">
                    <ResponsivePanel>
                        <JobberSomVanligSpørsmål />

                        {jobberIPerioden === JobberIPeriodeSvar.JA && jobberSomVanlig === YesOrNo.NO && (
                            <>
                                {visSpørsmålOmLiktHverUke && (
                                    <>
                                        <FormBlock>
                                            <TimerEllerProsentSpørsmål />
                                        </FormBlock>
                                        {timerEllerProsent === TimerEllerProsent.prosent && (
                                            <FormBlock>
                                                <AppForm.NumberInput
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
                                            <>
                                                <FormBlock>
                                                    <ErLiktHverUkeSpørsmål />
                                                </FormBlock>
                                                {erLiktHverUke === YesOrNo.YES && (
                                                    <FormBlock>
                                                        <AppForm.InputGroup
                                                            legend={intlHelper(
                                                                intl,
                                                                erHistorisk
                                                                    ? 'arbeidIPeriode.historisk.ukedager.tittel'
                                                                    : 'arbeidIPeriode.planlagt.ukedager.tittel',
                                                                intlValues
                                                            )}
                                                            validate={() =>
                                                                validateFasteArbeidstimerIUke(
                                                                    arbeidIPeriode,
                                                                    intlValues
                                                                )
                                                            }
                                                            name={'fasteDager_gruppe' as any}
                                                            description={
                                                                <ExpandableInfo
                                                                    title={intlHelper(
                                                                        intl,
                                                                        'arbeidIPeriode.ukedager.info.tittel'
                                                                    )}>
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
                                                        </AppForm.InputGroup>
                                                    </FormBlock>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                                {((timerEllerProsent === TimerEllerProsent.timer && erLiktHverUke === YesOrNo.NO) ||
                                    visSpørsmålOmLiktHverUke === false) && (
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
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodeSpørsmål;
