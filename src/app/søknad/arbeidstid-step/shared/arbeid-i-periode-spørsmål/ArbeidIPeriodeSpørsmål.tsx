import React, { useEffect, useState } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger';
import TidFasteUkedagerInput from '@navikt/sif-common-pleiepenger/lib/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormField } from '../../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData, ArbeidsforholdFrilanserFormData } from '../../../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../../../types/Søknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import ArbeidstidVariert from '../arbeidstid-variert/ArbeidstidVariert';
import { ArbeidstidRegistrertLogProps } from '../types';
import {
    getArbeidIPeriodeErLiktHverUkeValidator,
    getArbeidIPeriodeFasteDagerDagValidator,
    getArbeidIPeriodeJobberProsentValidator,
    getArbeidIPeriodeTimerPerUkeValidator,
    getArbeidIPeriodeTimerEllerProsentValidator,
    getArbeidIPeriodeJobberIPeriodenValidator,
} from './validationArbeidIPeriodeSpørsmål';
import InfoSøkerKunHelgedager from './InfoSøkerKunHelgedager';
import InfoRedusertArbeidFasteDager from './InfoRedusertArbeidFasteDager';

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
    søkerKunHelgedager,
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
            jobberNormaltTimer: normalarbeidstid.timerPerUke,
        },
        periode,
    });

    const getFieldName = (field: ArbeidIPeriodeFormField) => `${parentFieldName}.arbeidIPeriode.${field}` as any;

    const { arbeidIPeriode } = arbeidsforhold;
    const { jobberIPerioden, timerEllerProsent, erLiktHverUke, jobberProsent } = arbeidIPeriode || {};
    const visKunVariertArbeidstidVersjon = normalarbeidstid.erLiktHverUke === false;

    const renderArbeidstidVariert = (kanLeggeTilPeriode: boolean) => (
        <ArbeidstidVariert
            arbeidstid={arbeidIPeriode?.enkeltdager}
            kanLeggeTilPeriode={kanLeggeTilPeriode}
            jobberNormaltTimerPerUke={normalarbeidstid.timerPerUke}
            jobberNormaltTimerFasteDager={normalarbeidstid.fasteDager}
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
            <SøknadFormComponents.YesOrNoQuestion
                name={getFieldName(ArbeidIPeriodeFormField.jobberIPerioden)}
                legend={intlHelper(intl, `arbeidIPeriode.jobberIPerioden.spm`, intlValues)}
                useTwoColumns={true}
                validate={getArbeidIPeriodeJobberIPeriodenValidator(intlValues)}
            />

            {jobberIPerioden === YesOrNo.YES && visKunVariertArbeidstidVersjon === true && (
                <FormBlock>{renderArbeidstidVariert(false)}</FormBlock>
            )}

            {jobberIPerioden === YesOrNo.YES && visKunVariertArbeidstidVersjon === false && (
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
                                {renderArbeidstidVariert(true)}
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
                                            name={getFieldName(ArbeidIPeriodeFormField.jobberProsent)}
                                            label={intlHelper(intl, 'arbeidIPeriode.jobberProsent.spm', intlValues)}
                                            validate={getArbeidIPeriodeJobberProsentValidator(intlValues)}
                                            bredde="XS"
                                            maxLength={4}
                                            suffixStyle="text"
                                        />
                                        <InfoRedusertArbeidFasteDager
                                            arbeiderHvor={intlValues.hvor}
                                            arbeidNormalt={normalarbeidstid.fasteDager}
                                            jobberProsent={getNumberFromNumberInputValue(jobberProsent)}
                                        />
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                            {timerEllerProsent === TimerEllerProsent.TIMER && (
                                <FormBlock margin="l">
                                    <ResponsivePanel>
                                        <SøknadFormComponents.InputGroup
                                            name={`${parentFieldName}_fasteDager.gruppe` as any}
                                            legend={intlHelper(intl, 'arbeidIPeriode.ukedager.tittel', intlValues)}
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
