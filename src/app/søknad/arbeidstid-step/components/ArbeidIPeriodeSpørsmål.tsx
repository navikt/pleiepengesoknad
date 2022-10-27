import React, { useEffect, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger';
import { getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-periode-dialog/utils/arbeidstidPeriodeIntlValuesUtils';
import { ArbeiderIPeriodenSvar, ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { Ingress } from 'nav-frontend-typografi';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField } from '../../../types/ArbeidIPeriodeFormValues';
import { ArbeidsforholdFormValues, ArbeidsforholdFrilanserFormValues } from '../../../types/ArbeidsforholdFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/Søknadsdata';
import SøknadFormComponents from '../../SøknadFormComponents';
import { gjelderArbeidsforholdHeleSøknadsperioden, skalSvarePåOmEnJobberLiktIPerioden } from '../utils/arbeidstidUtils';
import {
    getArbeidIPeriodeArbeiderIPeriodenValidator,
    getArbeidIPeriodeErLiktHverUkeValidator,
    getArbeidIPeriodeTimerEllerProsentValidator,
} from '../validationArbeidIPeriodeSpørsmål';
import ArbeidstidInput from './ArbeidstidInput';
import ArbeidstidUkerSpørsmål from './ArbeidstidUkerSpørsmål';
import { søkerNoeFremtid } from '../../../utils/søknadsperiodeUtils';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { getDelvisAktivtArbeidsforholdInfo } from '../utils/getDelvisAktivtArbeidsforholdInfo';

interface Props {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    parentFieldName: string;
    arbeidsforhold: ArbeidsforholdFormValues | ArbeidsforholdFrilanserFormValues;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    aktivPeriode: DateRange;
    søknadsperiode: DateRange;
    onArbeidstidVariertChange: () => void;
}

const ArbeidIPeriodeSpørsmål = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    aktivPeriode,
    søknadsperiode,
    arbeidsstedNavn,
    normalarbeidstid,
    onArbeidstidVariertChange,
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
        periode: aktivPeriode,
    });

    const arbeidIPeriodeParentFieldName = `${parentFieldName}.arbeidIPeriode`;
    const getFieldName = (field: ArbeidIPeriodeFormField) => `${arbeidIPeriodeParentFieldName}.${field}` as any;

    const { arbeidIPeriode } = arbeidsforhold;
    const { arbeiderIPerioden, timerEllerProsent, erLiktHverUke } = arbeidIPeriode || {};
    const spørOmEnJobberLiktIPerioden = skalSvarePåOmEnJobberLiktIPerioden(aktivPeriode);

    const delvisAktivtArbeidsforholdInfo =
        gjelderArbeidsforholdHeleSøknadsperioden(søknadsperiode, aktivPeriode) === false
            ? getDelvisAktivtArbeidsforholdInfo(arbeidsforholdType)
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
                        'data-testid': ArbeiderIPeriodenSvar.heltFravær,
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberRedusert', intlValues),
                        value: ArbeiderIPeriodenSvar.redusert,
                        'data-testid': ArbeiderIPeriodenSvar.redusert,
                    },
                    {
                        label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberVanlig', intlValues),
                        value: ArbeiderIPeriodenSvar.somVanlig,
                        'data-testid': ArbeiderIPeriodenSvar.somVanlig,
                    },
                ]}
            />
            {arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert && (
                <FormBlock margin="l">
                    <ResponsivePanel>
                        <Ingress>
                            <FormattedMessage id="arbeidIPeriode.redusert.info.tittel" />
                        </Ingress>
                        {søkerNoeFremtid(aktivPeriode) && (
                            <p>
                                <FormattedMessage id="arbeidIPeriode.redusert.info.tekst" />
                            </p>
                        )}

                        {delvisAktivtArbeidsforholdInfo && (
                            <FormBlock margin="l">
                                <ExpandableInfo title={delvisAktivtArbeidsforholdInfo.tittel}>
                                    {delvisAktivtArbeidsforholdInfo.tekst}
                                </ExpandableInfo>
                            </FormBlock>
                        )}

                        {spørOmEnJobberLiktIPerioden && (
                            <FormBlock margin="l">
                                <SøknadFormComponents.YesOrNoQuestion
                                    name={getFieldName(ArbeidIPeriodeFormField.erLiktHverUke)}
                                    legend={intlHelper(
                                        intl,
                                        `arbeidIPeriode.erLiktHverUke.${
                                            timerEllerProsent === TimerEllerProsent.PROSENT ? 'prosent' : 'timer'
                                        }.spm`,
                                        intlValues
                                    )}
                                    validate={getArbeidIPeriodeErLiktHverUkeValidator(intlValues)}
                                    useTwoColumns={true}
                                    data-testid="er-likt-hver-uke"
                                    labels={{
                                        yes: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.ja`),
                                        no: intlHelper(intl, `arbeidIPeriode.erLiktHverUke.nei`),
                                    }}
                                />
                            </FormBlock>
                        )}
                        {(erLiktHverUke !== undefined || spørOmEnJobberLiktIPerioden === false) && (
                            <FormBlock>
                                <SøknadFormComponents.RadioPanelGroup
                                    name={getFieldName(ArbeidIPeriodeFormField.timerEllerProsent)}
                                    legend={intlHelper(intl, `arbeidIPeriode.timerEllerProsent.spm`, intlValues)}
                                    radios={getTimerEllerProsentRadios(intl, intlValues)}
                                    validate={getArbeidIPeriodeTimerEllerProsentValidator(intlValues)}
                                    useTwoColumns={true}
                                />
                            </FormBlock>
                        )}

                        {(erLiktHverUke === YesOrNo.NO || spørOmEnJobberLiktIPerioden === false) &&
                            timerEllerProsent !== undefined &&
                            arbeidIPeriode !== undefined && (
                                <FormBlock>
                                    <ArbeidstidUkerSpørsmål
                                        periode={aktivPeriode}
                                        parentFieldName={arbeidIPeriodeParentFieldName}
                                        normalarbeidstid={normalarbeidstid}
                                        timerEllerProsent={timerEllerProsent}
                                        arbeidIPeriode={arbeidIPeriode}
                                        intlValues={intlValues}
                                    />
                                </FormBlock>
                            )}

                        {erLiktHverUke === YesOrNo.YES && timerEllerProsent !== undefined && arbeidIPeriode && (
                            <ArbeidstidInput
                                arbeidIPeriode={arbeidIPeriode}
                                parentFieldName={arbeidIPeriodeParentFieldName}
                                intlValues={intlValues}
                                normalarbeidstid={normalarbeidstid}
                                timerEllerProsent={timerEllerProsent}
                                periode={aktivPeriode}
                            />
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
        'data-testid': TimerEllerProsent.PROSENT,
    },
    {
        label: intlHelper(intl, `arbeidIPeriode.timerEllerProsent.timer`, intlValues),
        value: TimerEllerProsent.TIMER,
        'data-testid': TimerEllerProsent.TIMER,
    },
];

export default ArbeidIPeriodeSpørsmål;
