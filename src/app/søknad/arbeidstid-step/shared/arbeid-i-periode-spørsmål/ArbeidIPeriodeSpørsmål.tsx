import React, { useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { IntlErrorObject } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidIPeriodeIntlValues,
    getArbeidstidFastProsentValidator,
    getArbeidstidIPeriodeIntlValues,
    getArbeidstimerFastDagValidator,
} from '@navikt/sif-common-pleiepenger';
import TidFasteUkedagerInput from '@navikt/sif-common-pleiepenger/lib/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import {
    decimalDurationToDuration,
    Duration,
    durationToDecimalDuration,
    DurationWeekdays,
    getWeeksInDateRange,
    summarizeDurationInDurationWeekdays,
} from '@navikt/sif-common-utils';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeField } from '../../../../types/ArbeidIPeriode';
import { Arbeidsforhold, ArbeidsforholdFrilanser, Normalarbeidstid } from '../../../../types/Arbeidsforhold';
import SøknadFormComponents from '../../../SøknadFormComponents';
import ArbeidstidVariert from '../arbeidstid-variert/ArbeidstidVariert';
import { ArbeidstidRegistrertLogProps } from '../types';
import { getArbeidIPeriodeErLiktHverUkeValidator } from '../validation/arbeidIPeriodeErLiktHverUkeValidator';
import { getArbeidstidTimerEllerProsentValidator } from '../validation/arbeidstidEllerProsentValidator';
import { getJobberIPeriodenValidator } from '../validation/jobberIPeriodenSpørsmål';
import InfoSøkerKunHelgedager from './InfoSøkerKunHelgedager';
import RedusertArbeidFasteDagerInfo from './RedusertArbeidFasteDagerInfo';

interface Props extends ArbeidstidRegistrertLogProps {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    periode: DateRange;
    søkerKunHelgedager: boolean;
    onArbeidstidVariertChange: () => void;
}

const getTimerPerDagFraNormalarbeidstid = ({
    erLiktHverUke,
    fasteDager,
    timerPerUke,
}: Normalarbeidstid): DurationWeekdays | undefined => {
    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return fasteDager;
    }
    if (erLiktHverUke === YesOrNo.NO && timerPerUke !== undefined) {
        const timerPerUkeNumber = getNumberFromNumberInputValue(timerPerUke);
        if (timerPerUkeNumber !== undefined) {
            return timerPerUkeTilFasteDager(timerPerUkeNumber);
        }
    }
    return undefined;
};

type Ukedager = 'mandag' | 'tirsdag' | 'onsdag' | 'torsdag' | 'fredag' | string;

const getNormaltidForDag = (fasteDager: DurationWeekdays, ukedag: Ukedager): Duration | undefined => {
    switch (ukedag) {
        case 'mandag':
            return fasteDager.monday;
        case 'tirsdag':
            return fasteDager.tuesday;
        case 'onsdag':
            return fasteDager.wednesday;
        case 'torsdag':
            return fasteDager.thursday;
        case 'fredag':
            return fasteDager.friday;
        default:
            return undefined;
    }
};

const getTimerPerUkeFraNormalarbeidstid = ({
    erLiktHverUke,
    fasteDager,
    timerPerUke,
}: Normalarbeidstid): number | undefined => {
    if (erLiktHverUke === YesOrNo.NO && timerPerUke) {
        return getNumberFromNumberInputValue(timerPerUke);
    }
    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return durationToDecimalDuration(summarizeDurationInDurationWeekdays(fasteDager));
    }
    return undefined;
};

const timerPerUkeTilFasteDager = (timer: number): DurationWeekdays => {
    const tidPerDag = decimalDurationToDuration(timer / 5);
    return {
        monday: tidPerDag,
        tuesday: tidPerDag,
        wednesday: tidPerDag,
        thursday: tidPerDag,
        friday: tidPerDag,
    };
};

export const getFasteArbeidstimerPerUkeValidator =
    (maksTimer: number = 24 * 5) =>
    (fasteDager: DurationWeekdays | undefined): IntlErrorObject | undefined => {
        const timer = fasteDager ? durationToDecimalDuration(summarizeDurationInDurationWeekdays(fasteDager)) : 0;
        if (timer === 0) {
            return {
                key: `ingenTidRegistrert`,
            };
        }
        if (timer > maksTimer) {
            return {
                key: `forMangeTimer`,
            };
        }
        return undefined;
    };

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    periode,
    arbeidsstedNavn,
    søkerKunHelgedager,
    onArbeidstidVariertChange,
    onArbeidPeriodeRegistrert,
    onArbeidstidEnkeltdagRegistrert,
}: Props) => {
    const intl = useIntl();
    const [arbeidstidChanged, setArbeidstidChanged] = useState(false);

    useEffect(() => {
        if (arbeidstidChanged === true) {
            setArbeidstidChanged(false);
            onArbeidstidVariertChange();
        }
    }, [arbeidstidChanged, onArbeidstidVariertChange]);

    const { normalarbeidstid } = arbeidsforhold;
    const intlValues = getArbeidstidIPeriodeIntlValues(intl, {
        arbeidsforhold: {
            arbeidsstedNavn,
            jobberNormaltTimer: normalarbeidstid?.timerPerUke,
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
            jobberNormaltTimerPerUke={getNumberFromNumberInputValue(normalarbeidstid?.timerPerUke)}
            jobberNormaltTimerFasteDager={normalarbeidstid?.fasteDager}
            periode={periode}
            intlValues={intlValues}
            arbeidsstedNavn={arbeidsstedNavn}
            arbeidsforholdType={arbeidsforholdType}
            formFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
            onArbeidstidVariertChanged={() => setArbeidstidChanged(true)}
            onArbeidPeriodeRegistrert={onArbeidPeriodeRegistrert}
            onArbeidstidEnkeltdagRegistrert={onArbeidstidEnkeltdagRegistrert}
        />
    );

    const arbeidFasteDagerNormalt = normalarbeidstid ? getTimerPerDagFraNormalarbeidstid(normalarbeidstid) : undefined;
    const timerPerUkeNormalt = normalarbeidstid ? getTimerPerUkeFraNormalarbeidstid(normalarbeidstid) : undefined;

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
                            validate={getArbeidIPeriodeErLiktHverUkeValidator(intlValues)}
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
                                {søkerKunHelgedager && (
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
                                radios={getTimerEllerProsentRadios(intl, intlValues)}
                                validate={getArbeidstidTimerEllerProsentValidator(intlValues)}
                                useTwoColumns={true}
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
                                                const min = 1;
                                                const max = 99;
                                                const error = getArbeidstidFastProsentValidator({ min, max })(value);
                                                return error
                                                    ? {
                                                          key: `validation.arbeidIPeriode.fast.prosent.${error.key}`,
                                                          values: { ...intlValues, min, max },
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                            // suffix={
                                            //     normalarbeidstid?.timerPerUke
                                            //         ? getRedusertArbeidstidPerUkeInfo(
                                            //               intl,
                                            //               normalarbeidstid.timerPerUke,
                                            //               jobberProsent
                                            //           )
                                            //         : undefined
                                            // }
                                            suffixStyle="text"
                                        />
                                        <RedusertArbeidFasteDagerInfo
                                            arbeiderHvor={intlValues.hvor}
                                            arbeidNormalt={arbeidFasteDagerNormalt}
                                            jobberProsent={getNumberFromNumberInputValue(jobberProsent)}
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
                                                if (timerPerUkeNormalt !== undefined) {
                                                    const error = getFasteArbeidstimerPerUkeValidator(
                                                        timerPerUkeNormalt
                                                    )(arbeidIPeriode?.fasteDager);
                                                    return error
                                                        ? {
                                                              key: `validation.arbeidIPeriode.timer.${error.key}`,
                                                              values: intlValues,
                                                              keepKeyUnaltered: true,
                                                          }
                                                        : undefined;
                                                }
                                                return undefined;
                                            }}
                                            name={`${parentFieldName}_fasteDager.gruppe` as any}>
                                            <TidFasteUkedagerInput
                                                name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                                validateDag={(dag, value) => {
                                                    if (normalarbeidstid?.fasteDager) {
                                                        const normaltidDag = getNormaltidForDag(
                                                            normalarbeidstid.fasteDager,
                                                            dag
                                                        );
                                                        if (normaltidDag) {
                                                            // const max = {hours:24} || durationAsNumberDuration(normaltidDag);
                                                            const error = getTimeValidator({
                                                                max: { hours: 24, minutes: 0 },
                                                                min: { hours: 0, minutes: 0 },
                                                            })(value);
                                                            return error
                                                                ? {
                                                                      key: `validation.arbeidIPeriode.fast.tid.${error}`,
                                                                      keepKeyUnaltered: true,
                                                                      values: { ...intlValues, dag },
                                                                  }
                                                                : undefined;
                                                        }
                                                    }
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
