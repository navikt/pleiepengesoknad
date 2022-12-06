import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
// import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger';
import { getArbeidstidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-periode-dialog/utils/arbeidstidPeriodeIntlValuesUtils';
import { ArbeiderIPeriodenSvar, ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib/types';
import { Ingress } from 'nav-frontend-typografi';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField, OmsorgsstønadIPerioden, VervSvar } from '../../../types/ArbeidIPeriodeFormValues';
import { ArbeidsforholdFormValues, ArbeidsforholdFrilanserFormValues } from '../../../types/ArbeidsforholdFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/Søknadsdata';
import { søkerNoeFremtid } from '../../../utils/søknadsperiodeUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import { arbeidIPeriodeSpørsmålConfig } from '../utils/arbeidIPeriodeSpørsmålConfig';
import {
    getArbeidIPeriodeArbeiderIPeriodenValidator,
    getArbeidIPeriodeErLiktHverUkeValidator,
    //  getArbeidIPeriodeTimerEllerProsentValidator,
} from '../validationArbeidIPeriodeSpørsmål';
import ArbeidstidInput from './ArbeidstidInput';
import ArbeidstidUkerSpørsmål from './ArbeidstidUkerSpørsmål';
import { FrilansType } from '../../../types/FrilansFormData';
import { Element } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    parentFieldName: string;
    arbeidsforhold: ArbeidsforholdFormValues | ArbeidsforholdFrilanserFormValues;
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsstedNavn: string;
    frilansType: FrilansType[];
    misterHonorarer?: YesOrNo;
    arbeidsperiode: DateRange;
    søknadsperiode: DateRange;
    onArbeidstidVariertChange: () => void;
}

const ArbeidIPeriodeSpørsmålFrilans = ({
    arbeidsforhold,
    parentFieldName,
    arbeidsforholdType,
    arbeidsperiode,
    søknadsperiode,
    arbeidsstedNavn,
    normalarbeidstid,
    frilansType,
    misterHonorarer,
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
            jobberNormaltTimer: normalarbeidstid.timerPerUkeISnitt,
        },
        periode: arbeidsperiode,
    });

    const arbeidIPeriodeParentFieldName = `${parentFieldName}.arbeidIPeriode`;
    const getFieldName = (field: ArbeidIPeriodeFormField) => `${arbeidIPeriodeParentFieldName}.${field}` as any;

    const { arbeidIPeriode } = arbeidsforhold;
    const { arbeiderIPerioden, omsorgsstønadIPerioden, vervSvar } = arbeidIPeriode || {};

    const visibility = arbeidIPeriodeSpørsmålConfig.getVisbility({
        formValues: arbeidIPeriode || {},
        arbeidsperiode,
    });

    const frilansRedusert =
        frilansType.some((type) => type === FrilansType.FRILANS) &&
        arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert;

    const omsorgsstønadRedusert =
        frilansType.some((type) => type === FrilansType.OMSORGSSTØNAD) &&
        omsorgsstønadIPerioden === OmsorgsstønadIPerioden.mottarRedusert;

    const vervRedusert =
        frilansType.some((type) => type === FrilansType.STYREVERV) &&
        misterHonorarer === YesOrNo.YES &&
        vervSvar === VervSvar.misterDelerAvHonorarer;

    console.log('frilansRedusert: ', frilansRedusert);
    console.log('omsorgsstønadRedusert: ', omsorgsstønadRedusert);
    console.log('vervRedusert: ', vervRedusert);

    console.log('frilansType: ', frilansType);
    return (
        <ResponsivePanel>
            <Element>Hva er din situasjon i perioden</Element>
            {frilansType.some((type) => type === FrilansType.FRILANS) && (
                <FormBlock>
                    <SøknadFormComponents.RadioPanelGroup
                        name={getFieldName(ArbeidIPeriodeFormField.arbeiderIPerioden)}
                        legend={intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.frilans.spm')}
                        validate={getArbeidIPeriodeArbeiderIPeriodenValidator(intlValues)}
                        radios={[
                            {
                                label: intlHelper(intl, 'arbeidIPeriode.arbeiderIPerioden.svar.jobberIkke', intlValues),
                                value: ArbeiderIPeriodenSvar.heltFravær,
                                'data-testid': ArbeiderIPeriodenSvar.heltFravær,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    'arbeidIPeriode.arbeiderIPerioden.svar.jobberRedusert',
                                    intlValues
                                ),
                                value: ArbeiderIPeriodenSvar.redusert,
                                'data-testid': ArbeiderIPeriodenSvar.redusert,
                            },
                            {
                                label: intlHelper(
                                    intl,
                                    'arbeidIPeriode.arbeiderIPerioden.svar.jobberVanlig',
                                    intlValues
                                ),
                                value: ArbeiderIPeriodenSvar.somVanlig,
                                'data-testid': ArbeiderIPeriodenSvar.somVanlig,
                            },
                        ]}
                    />
                </FormBlock>
            )}
            {frilansType.some((type) => type === FrilansType.OMSORGSSTØNAD) && (
                <FormBlock>
                    <SøknadFormComponents.RadioPanelGroup
                        name={getFieldName(ArbeidIPeriodeFormField.omsorgsstønadIPerioden)}
                        // legend={intlHelper(intl, `arbeidIPeriode.arbeiderIPerioden.spm`, intlValues)}
                        legend={'Omsorgsstønad'}
                        // validate={getArbeidIPeriodeArbeiderIPeriodenValidator(intlValues)}
                        radios={[
                            {
                                label: 'Jeg mister hele omsorgsstønaden',
                                value: OmsorgsstønadIPerioden.misterOmsorgsstønad,
                                'data-testid': OmsorgsstønadIPerioden.misterOmsorgsstønad,
                            },
                            {
                                label: 'Jeg mottar redusert omsorgsstønad',
                                value: OmsorgsstønadIPerioden.mottarRedusert,
                                'data-testid': OmsorgsstønadIPerioden.mottarRedusert,
                            },
                            {
                                label: 'Jeg beholder hele omsorgsstønaden',
                                value: OmsorgsstønadIPerioden.beholderHeleOmsorgsstønad,
                                'data-testid': OmsorgsstønadIPerioden.beholderHeleOmsorgsstønad,
                            },
                        ]}
                    />
                </FormBlock>
            )}
            {frilansType.some((type) => type === FrilansType.STYREVERV && misterHonorarer === YesOrNo.YES) && (
                <FormBlock>
                    <SøknadFormComponents.RadioPanelGroup
                        name={getFieldName(ArbeidIPeriodeFormField.vervSvar)}
                        // legend={intlHelper(intl, `arbeidIPeriode.arbeiderIPerioden.spm`, intlValues)}
                        legend={'Honorar for verv'}
                        // validate={getArbeidIPeriodeArbeiderIPeriodenValidator(intlValues)}
                        radios={[
                            {
                                label: 'Jeg mister alle honorar',
                                value: VervSvar.misterAlleHonorarer,
                                'data-testid': VervSvar.misterAlleHonorarer,
                            },
                            {
                                label: 'Jeg mister deler av honorar',
                                value: VervSvar.misterDelerAvHonorarer,
                                'data-testid': VervSvar.misterDelerAvHonorarer,
                            },
                        ]}
                    />
                </FormBlock>
            )}

            {(frilansRedusert || omsorgsstønadRedusert || vervRedusert) && (
                <FormBlock>
                    <Ingress>
                        <FormattedMessage id="arbeidIPeriode.redusert.info.frilans.tittel" />
                    </Ingress>
                    <Box margin="l">
                        <FormattedMessage id="arbeidIPeriode.redusert.info.frilans.info.tittel" />
                        <Box margin="l">
                            {frilansRedusert && (
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'arbeidIPeriode.redusert.info.frilans.info.frilans.tittel'
                                    )}>
                                    <FormattedMessage id={'arbeidIPeriode.redusert.info.frilans.info.frilans.info'} />
                                </ExpandableInfo>
                            )}

                            {omsorgsstønadRedusert && (
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'arbeidIPeriode.redusert.info.frilans.info.omsorgsstønad.tittel'
                                    )}>
                                    <FormattedMessage
                                        id={'arbeidIPeriode.redusert.info.frilans.info.omsorgsstønad.info'}
                                    />
                                </ExpandableInfo>
                            )}
                            {vervRedusert && (
                                <ExpandableInfo
                                    title={intlHelper(intl, 'arbeidIPeriode.redusert.info.frilans.info.verv.tittel')}>
                                    <FormattedMessage id={'arbeidIPeriode.redusert.info.frilans.info.verv.info'} />
                                </ExpandableInfo>
                            )}
                        </Box>
                    </Box>

                    {søkerNoeFremtid(arbeidsperiode) && (
                        <p>
                            <FormattedMessage id="arbeidIPeriode.redusert.info.tekst" />
                        </p>
                    )}
                    {visibility.isIncluded(ArbeidIPeriodeFormField.erLiktHverUke) && (
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                name={getFieldName(ArbeidIPeriodeFormField.erLiktHverUke)}
                                legend={intlHelper(intl, 'arbeidIPeriode.erLiktHverUke.frilans.spm')}
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

                    {visibility.isVisible(ArbeidIPeriodeFormField.arbeidsuker) && arbeidIPeriode !== undefined && (
                        <FormBlock>
                            <ArbeidstidUkerSpørsmål
                                periode={arbeidsperiode}
                                søknadsperiode={søknadsperiode}
                                parentFieldName={arbeidIPeriodeParentFieldName}
                                normalarbeidstid={normalarbeidstid}
                                timerEllerProsent={TimerEllerProsent.TIMER}
                                arbeidIPeriode={arbeidIPeriode}
                                intlValues={intlValues}
                            />
                        </FormBlock>
                    )}

                    {visibility.isVisible(ArbeidIPeriodeFormField.erLiktHverUke) &&
                        !visibility.isVisible(ArbeidIPeriodeFormField.arbeidsuker) &&
                        arbeidIPeriode && (
                            <ArbeidstidInput
                                arbeidIPeriode={arbeidIPeriode}
                                parentFieldName={arbeidIPeriodeParentFieldName}
                                intlValues={intlValues}
                                normalarbeidstid={normalarbeidstid}
                                timerEllerProsent={TimerEllerProsent.TIMER}
                                frilans={true}
                            />
                        )}
                </FormBlock>
            )}
        </ResponsivePanel>
    );
};
/*
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
*/
export default ArbeidIPeriodeSpørsmålFrilans;
