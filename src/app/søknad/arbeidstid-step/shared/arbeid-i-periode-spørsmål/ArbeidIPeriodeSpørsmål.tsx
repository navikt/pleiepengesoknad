import React, { useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    ArbeidIPeriodeIntlValues,
    formatTimerOgMinutter,
    getArbeidstidIPeriodeIntlValues,
} from '@navikt/sif-common-pleiepenger';
import TidFasteUkedagerInput from '@navikt/sif-common-pleiepenger/lib/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormField, ArbeiderIPeriodenSvar } from '../../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../../../types/Søknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import ArbeidstidVariert from '../arbeidstid-variert/ArbeidstidVariert';
import { ArbeidstidRegistrertLogProps } from '../types';
import {
    getArbeidIPeriodeErLiktHverUkeValidator,
    getArbeidIPeriodeFasteDagerDagValidator,
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerPerUkeValidator,
    getArbeidIPeriodeTimerEllerProsentValidator,
    getArbeidIPeriodeArbeiderIPeriodenValidator,
} from './validationArbeidIPeriodeSpørsmål';

import { decimalDurationToDuration, DurationWeekdays } from '@navikt/sif-common-utils/lib';

interface Props extends ArbeidstidRegistrertLogProps {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    parentFieldName: string;
    arbeidsforhold: ArbeidsforholdFormData | ArbeidsforholdFrilanserFormData;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    periode: DateRange;
    søkerKunHelgedager: boolean;
    onArbeidstidVariertChange: () => void;
}

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    periode,
    arbeidsstedNavn,
    // søkerKunHelgedager,
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

    const renderArbeidstidVariert = (kanLeggeTilPeriode: boolean, timerFasteUkedager: DurationWeekdays) => (
        <ArbeidstidVariert
            arbeidstid={arbeidIPeriode?.enkeltdager}
            kanLeggeTilPeriode={kanLeggeTilPeriode}
            arbeiderNormaltTimerFasteUkedager={timerFasteUkedager}
            periode={periode}
            intlValues={intlValues}
            arbeidsstedNavn={arbeidsstedNavn}
            arbeidsforholdType={arbeidsforholdType}
            formFieldName={getFieldName(ArbeidIPeriodeFormField.enkeltdager)}
            onArbeidstidVariertChanged={() => setArbeidstidChanged(true)}
            onArbeidPeriodeRegistrert={onArbeidPeriodeRegistrert}
            onArbeidstidEnkeltdagRegistrert={onArbeidstidEnkeltdagRegistrert}
        />
    );

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
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberRedusert', intlValues),
                        value: ArbeiderIPeriodenSvar.redusert,
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberVanlig', intlValues),
                        value: ArbeiderIPeriodenSvar.somVanlig,
                    },
                ]}
            />

            {arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert && normalarbeidstid.type === 'likeUkerFasteDager' && (
                <FormBlock>{renderArbeidstidVariert(false, normalarbeidstid.timerFasteUkedager)}</FormBlock>
            )}

            {arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert && normalarbeidstid.type !== 'likeUkerFasteDager' && (
                <>
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={getFieldName(ArbeidIPeriodeFormField.erLiktHverUke)}
                            legend={intlHelper(intl, `arbeidIPeriode.erLiktHverUke.spm`, intlValues)}
                            validate={getArbeidIPeriodeErLiktHverUkeValidator(intlValues)}
                            useTwoColumns={true}
                            labels={{
                                yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                            }}
                        />
                    </FormBlock>

                    {/* {erLiktHverUke === YesOrNo.NO && (
                        <FormBlock margin="l">
                            <ResponsivePanel>
                                {renderArbeidstidVariert(true)}
                                {søkerKunHelgedager && (
                                    <Box margin="xl">
                                        <InfoSøkerKunHelgedager />
                                    </Box>
                                )}
                            </ResponsivePanel>
                        </FormBlock>
                    )} */}

                    {erLiktHverUke === YesOrNo.YES && (
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
                                            label={intlHelper(intl, 'arbeidIPeriode.prosentAvNormalt.spm', intlValues)}
                                            validate={getArbeidIPeriodeProsentAvNormaltValidator(intlValues)}
                                            bredde="XS"
                                            maxLength={4}
                                            suffixStyle="text"
                                            suffix={getProsentSuffix()}
                                        />
                                        {/* <InfoRedusertArbeidFasteDager
                                            arbeiderHvor={intlValues.hvor}
                                            arbeidNormalt={normalarbeidstid.fasteDager}
                                            jobberProsent={getNumberFromNumberInputValue(jobberProsent)}
                                        /> */}
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                            {timerEllerProsent === TimerEllerProsent.TIMER && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <SøknadFormComponents.NumberInput
                                            name={getFieldName(ArbeidIPeriodeFormField.timerPerUke)}
                                            label={`Hvor mange timer av normalt ${timerNormaltString}, jobber du i uken som frilanser i perioden?`}
                                            // validate={getArbeidIPeriodeJobberTimerValidator(
                                            //     intl,
                                            //     intlValues,
                                            //     normalarbeidstid.timerPerUke
                                            // )}
                                            bredde="XS"
                                            maxLength={4}
                                            suffixStyle="text"
                                            // suffix={`timer av normalt ${formatTimerOgMinutter(
                                            //     intl,
                                            //     decimalDurationToDuration(normalarbeidstid.timerPerUke)
                                            // )} i uken.`}
                                        />
                                        {1 + 1 === 4 && (
                                            <FormBlock>
                                                <SøknadFormComponents.InputGroup
                                                    name={`${parentFieldName}_fasteDager.gruppe` as any}
                                                    legend={intlHelper(
                                                        intl,
                                                        'arbeidIPeriode.ukedager.tittel',
                                                        intlValues
                                                    )}
                                                    validate={getArbeidIPeriodeTimerPerUkeValidator(
                                                        intlValues,
                                                        normalarbeidstid,
                                                        arbeidIPeriode
                                                    )}>
                                                    <TidFasteUkedagerInput
                                                        name={getFieldName(ArbeidIPeriodeFormField.fasteDager)}
                                                        validateDag={getArbeidIPeriodeFasteDagerDagValidator(
                                                            normalarbeidstid,
                                                            intlValues
                                                        )}
                                                    />
                                                </SøknadFormComponents.InputGroup>
                                            </FormBlock>
                                        )}
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
