import React, { useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    ArbeidIPeriodeIntlValues,
    formatTimerOgMinutter,
    getArbeidstimerFastDagValidator,
    TidFasteUkedagerInput,
} from '@navikt/sif-common-pleiepenger';
import { getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-periode/utils/arbeidstidPeriodeIntlValuesUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../../types';
import { ArbeiderIPeriodenSvar, ArbeidIPeriodeFormField } from '../../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../../../types/søknadsdata/Søknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import { ArbeidstidRegistrertLogProps } from '../../types';
import ArbeidstidVariertKalender from '../arbeidstid-variert/ArbeidstidVariertKalender';
import {
    getArbeidIPeriodeArbeiderIPeriodenValidator,
    getArbeidIPeriodeErLiktHverUkeValidator,
    getArbeidIPeriodeFasteUkedagerValidator,
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerEllerProsentValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
} from './validationArbeidIPeriodeSpørsmål';

interface Props extends ArbeidstidRegistrertLogProps {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    parentFieldName: string;
    arbeidsforhold: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    periode: DateRange;
    onArbeidstidVariertChange: () => void;
}

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    periode,
    arbeidsstedNavn,
    normalarbeidstid,
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

    const intlValues = getArbeidstidIPeriodeIntlValues(intl, {
        arbeidsforhold: {
            type: arbeidsforholdType,
            arbeidsstedNavn,
            jobberNormaltTimer: undefined, // normalarbeidstid.timerPerUke,
        },
        periode,
    });

    const getFieldName = (field: ArbeidIPeriodeFormField) => `${parentFieldName}.arbeidIPeriode.${field}` as any;

    const { arbeidIPeriode } = arbeidsforhold;
    const { arbeiderIPerioden, timerEllerProsent, erLiktHverUke } = arbeidIPeriode || {};

    const arbeiderProsentNumber = arbeidIPeriode?.prosentAvNormalt
        ? getNumberFromNumberInputValue(arbeidIPeriode?.prosentAvNormalt)
        : undefined;

    const getProsentSuffix = () => {
        if (normalarbeidstid.type === 'ulikeUker') {
            const normalttimer = formatTimerOgMinutter(
                intl,
                decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
            );

            const nyTid = arbeiderProsentNumber
                ? formatTimerOgMinutter(
                      intl,
                      decimalDurationToDuration((normalarbeidstid.timerPerUkeISnitt / 100) * arbeiderProsentNumber)
                  )
                : undefined;

            return `prosent av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken).` : '.'}`;
        }
        return undefined;
    };

    const timerNormaltString =
        normalarbeidstid.erLiktHverUke === false || normalarbeidstid.erFasteUkedager === false
            ? formatTimerOgMinutter(intl, decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt))
            : undefined;

    return (
        <>
            <SøknadFormComponents.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeFormField.arbeiderIPerioden)}
                legend={intlHelper(intl, `arbeidIPeriode.arbeiderIPerioden.spm`, intlValues)}
                validate={getArbeidIPeriodeArbeiderIPeriodenValidator(intlValues)}
                radios={[
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberIkke', intlValues),
                        value: ArbeiderIPeriodenSvar.heltFravær,
                        'data-testkey': 'jobberIkke',
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberRedusert', intlValues),
                        value: ArbeiderIPeriodenSvar.redusert,
                        'data-testkey': 'jobberRedusert',
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberVanlig', intlValues),
                        value: ArbeiderIPeriodenSvar.somVanlig,
                        'data-testkey': 'jobberVanlig',
                    },
                ]}
            />
            {arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert && (
                <>
                    {(normalarbeidstid.type === NormalarbeidstidType.likeUkerVarierendeDager ||
                        normalarbeidstid.type === NormalarbeidstidType.ulikeUker) && (
                        <>
                            <FormBlock>
                                <SøknadFormComponents.RadioPanelGroup
                                    name={getFieldName(ArbeidIPeriodeFormField.timerEllerProsent)}
                                    legend={intlHelper(intl, `arbeidIPeriode.timerEllerProsent.spm`, intlValues)}
                                    radios={getTimerEllerProsentRadios(intl, intlValues)}
                                    validate={getArbeidIPeriodeTimerEllerProsentValidator(intlValues)}
                                    useTwoColumns={true}
                                />
                                {timerEllerProsent === TimerEllerProsent.PROSENT && (
                                    <FormBlock margin="l">
                                        <ResponsivePanel>
                                            <SøknadFormComponents.NumberInput
                                                name={getFieldName(ArbeidIPeriodeFormField.prosentAvNormalt)}
                                                label={intlHelper(
                                                    intl,
                                                    'arbeidIPeriode.prosentAvNormalt.spm',
                                                    intlValues
                                                )}
                                                data-testkey="prosent-verdi"
                                                validate={getArbeidIPeriodeProsentAvNormaltValidator(intlValues)}
                                                bredde="XS"
                                                maxLength={4}
                                                suffixStyle="text"
                                                suffix={getProsentSuffix()}
                                            />
                                        </ResponsivePanel>
                                    </FormBlock>
                                )}
                                {timerEllerProsent === TimerEllerProsent.TIMER && (
                                    <FormBlock margin="l">
                                        <ResponsivePanel>
                                            <SøknadFormComponents.NumberInput
                                                name={getFieldName(ArbeidIPeriodeFormField.timerPerUke)}
                                                label={`Hvor mange timer av normalt ${timerNormaltString}, jobber du i uken som frilanser i perioden?`}
                                                validate={getArbeidIPeriodeTimerPerUkeISnittValidator(
                                                    intl,
                                                    intlValues,
                                                    normalarbeidstid.timerPerUkeISnitt
                                                )}
                                                data-testkey="timer-verdi"
                                                bredde="XS"
                                                maxLength={4}
                                                suffixStyle="text"
                                                suffix={`timer av normalt ${formatTimerOgMinutter(
                                                    intl,
                                                    decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
                                                )} i uken.`}
                                            />
                                        </ResponsivePanel>
                                    </FormBlock>
                                )}
                            </FormBlock>
                        </>
                    )}
                    {normalarbeidstid.type === NormalarbeidstidType.likeUkerOgDager && (
                        <>
                            <FormBlock>
                                <SøknadFormComponents.YesOrNoQuestion
                                    name={getFieldName(ArbeidIPeriodeFormField.erLiktHverUke)}
                                    legend={intlHelper(intl, `arbeidIPeriode.erLiktHverUke.spm`, intlValues)}
                                    validate={getArbeidIPeriodeErLiktHverUkeValidator(intlValues)}
                                    useTwoColumns={true}
                                    data-testkey="er-likt-hver-uke"
                                    labels={{
                                        yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                        no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                                    }}
                                />
                            </FormBlock>
                            {erLiktHverUke === YesOrNo.NO && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <ArbeidstidVariertKalender
                                            arbeidstid={arbeidIPeriode?.enkeltdager}
                                            kanLeggeTilPeriode={true}
                                            arbeiderNormaltTimerFasteUkedager={normalarbeidstid.timerFasteUkedager}
                                            periode={periode}
                                            intlValues={intlValues}
                                            arbeidsstedNavn={arbeidsstedNavn}
                                            arbeidsforholdType={arbeidsforholdType}
                                            formFieldName={getFieldName(ArbeidIPeriodeFormField.enkeltdager)}
                                            onArbeidstidVariertChanged={() => setArbeidstidChanged(true)}
                                            onArbeidPeriodeRegistrert={onArbeidPeriodeRegistrert}
                                            onArbeidstidEnkeltdagRegistrert={onArbeidstidEnkeltdagRegistrert}
                                        />
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                            {erLiktHverUke === YesOrNo.YES && (
                                <FormBlock margin="m">
                                    <ResponsivePanel>
                                        <SøknadFormComponents.InputGroup
                                            name={`${parentFieldName}_fasteDager.gruppe` as any}
                                            legend={intlHelper(intl, 'arbeidIPeriode.ukedager.tittel', intlValues)}
                                            validate={getArbeidIPeriodeFasteUkedagerValidator(
                                                intlValues,
                                                normalarbeidstid,
                                                arbeidIPeriode
                                            )}>
                                            <TidFasteUkedagerInput
                                                name={getFieldName(ArbeidIPeriodeFormField.fasteDager)}
                                                data-testkey="arbeidstid-faste-ukedager"
                                                validateDag={(dag, value) => {
                                                    const error = getArbeidstimerFastDagValidator()(value);
                                                    return error
                                                        ? {
                                                              key: `validation.arbeidsforhold.fastDag.tid.${error}`,
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
                        </>
                    )}
                </>
            )}
        </>
    );
};

const getTimerEllerProsentRadios = (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues) => [
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.prosent`, intlValues),
        value: TimerEllerProsent.PROSENT,
        'data-testkey': 'jobberProsent',
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
        value: TimerEllerProsent.TIMER,
        'data-testkey': 'jobberTimer',
    },
];

export default ArbeidIPeriodeSpørsmål;
