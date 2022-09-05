import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { getOmsorgstilbudFastDagValidator, TidFasteUkedagerInput } from '@navikt/sif-common-pleiepenger';
import AlertStripe from 'nav-frontend-alertstriper';
import { OmsorgstilbudFormData, SøknadFormField } from '../../types/SøknadFormData';
import { validateOmsorgstilbud } from '../../validation/validateOmsorgstilbudFields';
import SøknadFormComponents from '../SøknadFormComponents';
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import OmsorgstilbudVariert from './omsorgstilbud-variert/OmsorgstilbudVariert';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from './omsorgstilbudStepUtils';
// import getLenker from '../../lenker';
// import Lenke from 'nav-frontend-lenker';
import { OmsorgstilbudSvar } from '../../types/søknad-api-data/SøknadApiData';

interface Props {
    periode: DateRange;
    omsorgstilbud?: OmsorgstilbudFormData;
    onOmsorgstilbudChanged: () => void;
}

const OmsorgstilbudSpørsmål = ({ periode, omsorgstilbud, onOmsorgstilbudChanged }: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    const getSpmErLiktHverUke = () => {
        return (
            <FormBlock>
                <SøknadFormComponents.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.omsorgstilbud.erLiktHverUke.spm', {
                        fra: prettifyDateFull(periode.from),
                        til: prettifyDateFull(periode.to),
                    })}
                    useTwoColumns={false}
                    labels={{
                        yes: intlHelper(intl, 'steg.omsorgstilbud.erLiktHverUke.yes'),
                        no: intlHelper(intl, 'steg.omsorgstilbud.erLiktHverUke.no'),
                    }}
                    name={SøknadFormField.omsorgstilbud__erLiktHverUke}
                    description={omsorgstilbudInfo.erLiktHverUke}
                    validate={(value) => {
                        const error = getYesOrNoValidator()(value);
                        return error
                            ? {
                                  key: error,
                                  values: {
                                      fra: prettifyDateFull(periode.from),
                                      til: prettifyDateFull(periode.to),
                                  },
                              }
                            : undefined;
                    }}
                />
            </FormBlock>
        );
    };

    const getValgHvorMyeTidIOmsorgstilbud = (omsorgstilbud: OmsorgstilbudFormData) => {
        return (
            <FormBlock>
                <ResponsivePanel>
                    <SøknadFormComponents.InputGroup
                        legend={intlHelper(intl, 'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud')}
                        description={omsorgstilbudInfo.hvorMye}
                        validate={() => validateOmsorgstilbud(omsorgstilbud)}
                        name={SøknadFormField.omsorgstilbud_gruppe}>
                        <TidFasteUkedagerInput
                            name={SøknadFormField.omsorgstilbud__fasteDager}
                            validateDag={(dag, value) => {
                                const error = getOmsorgstilbudFastDagValidator()(value);
                                return error
                                    ? {
                                          key: `validation.omsorgstilbud.fastdag.tid.${error}`,
                                          keepKeyUnaltered: true,
                                          values: {
                                              dag,
                                          },
                                      }
                                    : undefined;
                            }}
                        />
                    </SøknadFormComponents.InputGroup>
                </ResponsivePanel>
            </FormBlock>
        );
    };

    return (
        <>
            <SøknadFormComponents.RadioPanelGroup
                name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.spm')}
                radios={[
                    {
                        label: intlHelper(intl, 'steg.omsorgstilbud.fastOgRegelmessig'),
                        value: OmsorgstilbudSvar.FAST_OG_REGELMESSIG,
                        'data-testid': 'fastOgRegelmessig',
                    },
                    {
                        label: intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudEnkeltDager'),
                        value: OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG,
                        'data-testid': 'delvisFastOgRegelmessig',
                    },
                    {
                        label: intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.delvisFastOgRegelmessig'),
                        value: OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG,
                        'data-testid': 'ikkeFastOgRegelmessig',
                    },

                    {
                        label: intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.ikkeOmsorgstilbud'),
                        value: OmsorgstilbudSvar.IKKE_OMSORGSTILBUD,
                        'data-testid': 'ikkeOmsorgstilbud',
                    },
                ]}
                description={omsorgstilbudInfo.erIOmsorgstilbud}
                validate={getRequiredFieldValidator()}
            />

            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG && (
                <Box margin="l">
                    <AlertStripe type={'info'}>
                        <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbud.nei.info" />
                    </AlertStripe>
                </Box>
            )}
            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.FAST_OG_REGELMESSIG && (
                <>
                    {inkluderFastPlan && getSpmErLiktHverUke()}

                    {inkluderFastPlan &&
                        omsorgstilbud.erLiktHverUke === YesOrNo.YES &&
                        getValgHvorMyeTidIOmsorgstilbud(omsorgstilbud)}

                    {(inkluderFastPlan === false || omsorgstilbud.erLiktHverUke === YesOrNo.NO) && (
                        <FormBlock>
                            <ResponsivePanel>
                                <OmsorgstilbudVariert
                                    omsorgsdager={omsorgstilbud.enkeltdager || {}}
                                    tittel={intlHelper(intl, 'steg.omsorgstilbud.hvormyetittel')}
                                    formFieldName={SøknadFormField.omsorgstilbud__enkeltdager}
                                    periode={periode}
                                    tidIOmsorgstilbud={omsorgstilbud.enkeltdager || {}}
                                    onOmsorgstilbudChanged={() => {
                                        onOmsorgstilbudChanged();
                                    }}
                                />
                            </ResponsivePanel>
                        </FormBlock>
                    )}
                </>
            )}
            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG && (
                <>
                    <FormBlock>
                        <ResponsivePanel>
                            <OmsorgstilbudVariert
                                omsorgsdager={omsorgstilbud.enkeltdager || {}}
                                tittel={intlHelper(intl, 'steg.omsorgstilbud.hvormyetittel')}
                                formFieldName={SøknadFormField.omsorgstilbud__enkeltdager}
                                periode={periode}
                                tidIOmsorgstilbud={omsorgstilbud.enkeltdager || {}}
                                onOmsorgstilbudChanged={() => {
                                    onOmsorgstilbudChanged();
                                }}
                            />
                        </ResponsivePanel>
                    </FormBlock>
                </>
            )}
        </>
    );
};

export default OmsorgstilbudSpørsmål;
