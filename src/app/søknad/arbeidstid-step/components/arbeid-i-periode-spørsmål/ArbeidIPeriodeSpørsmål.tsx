import React, { useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger';
import { getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-periode/utils/arbeidstidPeriodeIntlValuesUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import {
    decimalDurationToDuration,
    getAllWeekdaysWithoutDuration,
    hasWeekdaysWithoutDuration,
} from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../../types';
import { ArbeiderIPeriodenSvar, ArbeidIPeriodeFormField } from '../../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../../../types/søknadsdata/Søknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import ArbeidstidFasteUkedagerInput from '../../shared/arbeidstid-faste-ukedager-input/ArbeidstidFasteUkedagerInput';
import ArbeidstidVariertKalender from '../arbeidstid-variert/ArbeidstidVariertKalender';
import { ArbeidstidRegistrertLogProps } from '../../shared/types';
import {
    getArbeidIPeriodeArbeiderIPeriodenValidator,
    getArbeidIPeriodeErLiktHverUkeValidator,
    getArbeidIPeriodeFasteDagerDagValidator,
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerEllerProsentValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
    getArbeidIPeriodeTimerPerUkeValidator,
} from './validationArbeidIPeriodeSpørsmål';
import ArbeidstidVariertUkedager from '../arbeidstid-variert/ArbeidstidVariertUkedager';

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
        if (normalarbeidstid.type === 'varierendeUker') {
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

    const jobberFastMenIkkeAlleDager =
        normalarbeidstid.erFasteUkedager && hasWeekdaysWithoutDuration(normalarbeidstid.timerFasteUkedager);

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
            {arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert && (
                <>
                    {(normalarbeidstid.type === NormalarbeidstidType.likeUkerVarierendeDager ||
                        normalarbeidstid.type === NormalarbeidstidType.varierendeUker) && (
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
                                    labels={{
                                        yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                        no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                                    }}
                                />
                            </FormBlock>
                            {erLiktHverUke === YesOrNo.NO && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        {1 + 1 === 2 && (
                                            <ArbeidstidVariertUkedager
                                                arbeidstid={arbeidIPeriode?.enkeltdager}
                                                kanLeggeTilPeriode={false}
                                                arbeiderNormaltTimerFasteUkedager={normalarbeidstid.timerFasteUkedager}
                                                periode={periode}
                                                intlValues={intlValues}
                                                formFieldName={getFieldName(ArbeidIPeriodeFormField.enkeltdager)}
                                                onArbeidPeriodeRegistrert={onArbeidPeriodeRegistrert}
                                                onArbeidstidEnkeltdagRegistrert={onArbeidstidEnkeltdagRegistrert}
                                            />
                                        )}
                                        {1 + 1 === 3 && (
                                            <ArbeidstidVariertKalender
                                                arbeidstid={arbeidIPeriode?.enkeltdager}
                                                kanLeggeTilPeriode={false}
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
                                        )}
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                            {erLiktHverUke === YesOrNo.YES && (
                                <FormBlock margin="m">
                                    <ResponsivePanel>
                                        <SøknadFormComponents.InputGroup
                                            name={`${parentFieldName}_fasteDager.gruppe` as any}
                                            legend={intlHelper(intl, 'arbeidIPeriode.ukedager.tittel', intlValues)}
                                            description={
                                                jobberFastMenIkkeAlleDager ? (
                                                    <>
                                                        <p style={{ marginTop: 0 }}>
                                                            Du kan kun oppgi timer på de dagene du normalt jobber.
                                                            Dersom du jobber andre dager enn dette i perioden, må timene
                                                            føres på dagene hvor du opprinnelig skulle jobbet.
                                                        </p>
                                                        <ExpandableInfo title="Forklar meg dette en gang til">
                                                            Dette er litt rart ja, men vi trenger at ... fordi ...
                                                        </ExpandableInfo>
                                                    </>
                                                ) : undefined
                                            }
                                            validate={getArbeidIPeriodeTimerPerUkeValidator(
                                                intlValues,
                                                normalarbeidstid,
                                                arbeidIPeriode
                                            )}>
                                            <ArbeidstidFasteUkedagerInput
                                                fieldName={getFieldName(ArbeidIPeriodeFormField.fasteDager)}
                                                tekst={{
                                                    dag: 'Dag',
                                                    jobber: 'Jobber timer',
                                                    ariaLabelTidInput: (dagNavn) => `Hvor mye jobber du ${dagNavn}`,
                                                }}
                                                skjulUtilgjengeligeUkedager={true}
                                                utilgjengeligeUkedager={getAllWeekdaysWithoutDuration(
                                                    normalarbeidstid.timerFasteUkedager
                                                )}
                                                tidPerDagValidator={getArbeidIPeriodeFasteDagerDagValidator(
                                                    normalarbeidstid.timerFasteUkedager,
                                                    intlValues,
                                                    (weekday) => intlHelper(intl, `${weekday}.plural`)
                                                )}
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
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
        value: TimerEllerProsent.TIMER,
    },
];

export default ArbeidIPeriodeSpørsmål;
