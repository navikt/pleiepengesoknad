import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
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
import { getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-periode-dialog/utils/arbeidstidPeriodeIntlValuesUtils';
import { ArbeiderIPeriodenSvar, ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import { Ingress } from 'nav-frontend-typografi';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormField } from '../../../../types/ArbeidIPeriodeFormData';
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

            return `prosent av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken)` : ''}`;
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
                        'data-testid': `${getFieldName(ArbeidIPeriodeFormField.arbeiderIPerioden)}_jobberIkke`,
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberRedusert', intlValues),
                        value: ArbeiderIPeriodenSvar.redusert,
                        'data-testid': `${getFieldName(ArbeidIPeriodeFormField.arbeiderIPerioden)}_jobberRedusert`,
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberVanlig', intlValues),
                        value: ArbeiderIPeriodenSvar.somVanlig,
                        'data-testid': `${getFieldName(ArbeidIPeriodeFormField.arbeiderIPerioden)}_jobberVanlig`,
                    },
                ]}
            />
            {arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert && (
                <FormBlock margin="l">
                    <ResponsivePanel>
                        <Ingress>Hvor mye jobber du i perioden du søker for?</Ingress>
                        {/* <p>
                            For at vi skal kunne beregne hvor mye pleiepenger du har rett til å få, trenger vi å vite
                            hvor mye du jobber i perioden du søker for.
                        </p> */}
                        <p>
                            Hvis du er usikker på hvor mye du skal jobbe fremover i tid, legger du inn slik du tror du
                            skal jobbe. Hvis det senere viser seg at du jobber mer eller mindre av hva du tror nå, gir
                            du oss beskjed i slutten av måneden.
                        </p>
                        <p>
                            Hvis det varierer hvor mye du jobber, legger du inn et snitt av det du skal jobbe i
                            søknadsperioden. Du velger om du vil oppgi snittet som prosent, eller i timer.
                        </p>

                        {normalarbeidstid.type !== NormalarbeidstidType.likeUkerOgDager && (
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
                                            <SøknadFormComponents.NumberInput
                                                name={getFieldName(ArbeidIPeriodeFormField.prosentAvNormalt)}
                                                label={intlHelper(
                                                    intl,
                                                    'arbeidIPeriode.prosentAvNormalt.spm',
                                                    intlValues
                                                )}
                                                data-testid="prosent-verdi"
                                                validate={getArbeidIPeriodeProsentAvNormaltValidator(intlValues)}
                                                bredde="XS"
                                                maxLength={4}
                                                suffixStyle="text"
                                                suffix={getProsentSuffix()}
                                            />
                                        </FormBlock>
                                    )}
                                    {timerEllerProsent === TimerEllerProsent.TIMER && (
                                        <FormBlock margin="l">
                                            <SøknadFormComponents.NumberInput
                                                name={getFieldName(ArbeidIPeriodeFormField.timerPerUke)}
                                                label={intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.spm', {
                                                    ...intlValues,
                                                    timerNormaltString,
                                                })}
                                                validate={getArbeidIPeriodeTimerPerUkeISnittValidator(
                                                    intl,
                                                    intlValues,
                                                    normalarbeidstid.timerPerUkeISnitt
                                                )}
                                                data-testid="timer-verdi"
                                                bredde="XS"
                                                maxLength={4}
                                                suffixStyle="text"
                                                suffix={`timer av normalt ${formatTimerOgMinutter(
                                                    intl,
                                                    decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
                                                )} i uken.`}
                                            />
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
                                        data-testid="er-likt-hver-uke"
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(intl, 'arbeidIPeriode.erLiktHverUke.info.tittel')}>
                                                <p>
                                                    <FormattedMessage id="arbeidIPeriode.erLiktHverUke.info.tekst.1" />
                                                </p>
                                                <p>
                                                    <FormattedMessage id="arbeidIPeriode.erLiktHverUke.info.tekst.2" />
                                                </p>
                                            </ExpandableInfo>
                                        }
                                        labels={{
                                            yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                            no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                                        }}
                                    />
                                </FormBlock>
                                {erLiktHverUke === YesOrNo.NO && (
                                    <FormBlock margin="l">
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
                                    </FormBlock>
                                )}
                                {erLiktHverUke === YesOrNo.YES && (
                                    <FormBlock>
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
                                                data-testid="arbeidstid-faste-ukedager"
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

const getTimerEllerProsentRadios = (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues) => [
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.prosent`, intlValues),
        value: TimerEllerProsent.PROSENT,
        'data-testid': 'jobberProsent',
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
        value: TimerEllerProsent.TIMER,
        'data-testid': 'jobberTimer',
    },
];

export default ArbeidIPeriodeSpørsmål;
