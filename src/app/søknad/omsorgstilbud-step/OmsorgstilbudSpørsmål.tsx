import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { getOmsorgstilbudFastDagValidator, TidFasteUkedagerInput } from '@navikt/sif-common-pleiepenger';
import AlertStripe from 'nav-frontend-alertstriper';
import { OmsorgstilbudFormData, SøknadFormField } from '../../types/SøknadFormData';
import { validateOmsorgstilbud } from '../../validation/validateOmsorgstilbudFields';
import SøknadFormComponents from '../SøknadFormComponents';
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import OmsorgstilbudVariert from './omsorgstilbud-variert/OmsorgstilbudVariert';
import { skalViseSpørsmålOmProsentEllerLiktHverUke, skalViseUsikker } from './omsorgstilbudStepUtils';
import getLenker from '../../lenker';
import Lenke from 'nav-frontend-lenker';

interface Props {
    periode: DateRange;
    omsorgstilbud?: OmsorgstilbudFormData;
    onOmsorgstilbudChanged: () => void;
}

const OmsorgstilbudSpørsmål = ({ periode, omsorgstilbud, onOmsorgstilbudChanged }: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);
    const inkluderUsikker = skalViseUsikker(periode);
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
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periode.from),
                    til: prettifyDateFull(periode.to),
                })}
                description={omsorgstilbudInfo.erIOmsorgstilbud}
                validate={(value) => {
                    const error = getYesOrNoValidator()(value);
                    if (error) {
                        return {
                            key: error,
                            values: {
                                fra: prettifyDateFull(periode.from),
                                til: prettifyDateFull(periode.to),
                            },
                        };
                    }
                    return undefined;
                }}
                includeDoNotKnowOption={inkluderUsikker}
                labels={{ doNotKnow: 'Usikker' }}
            />

            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === YesOrNo.NO && (
                <Box margin="l">
                    <AlertStripe type={'info'}>
                        <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbud.nei.info" />
                    </AlertStripe>
                </Box>
            )}
            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === YesOrNo.YES && (
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

            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === YesOrNo.DO_NOT_KNOW && (
                <>
                    <FormBlock>
                        <SøknadFormComponents.YesOrNoQuestion
                            legend={intlHelper(intl, 'steg.omsorgstilbud.fastIOmsorgstilbud.spm')}
                            useTwoColumns={false}
                            labels={{
                                yes: intlHelper(intl, 'steg.omsorgstilbud.fastIOmsorgstilbud.yes'),
                                no: intlHelper(intl, 'steg.omsorgstilbud.fastIOmsorgstilbud.no'),
                            }}
                            name={SøknadFormField.omsorgstilbud__fastIOmsorgstilbud}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>
                    {omsorgstilbud.fastIOmsorgstilbud === YesOrNo.YES && (
                        <>
                            <Box margin="l">
                                <AlertStripe type={'info'}>
                                    <Box padBottom="m">
                                        <FormattedMessage id="steg.omsorgstilbud.fastIOmsorgstilbud.ja.info.avsnitt.1" />
                                    </Box>
                                    <Box>
                                        <FormattedMessage id="steg.omsorgstilbud.fastIOmsorgstilbud.ja.info.avsnitt.2" />
                                        <Lenke href={getLenker(intl.locale).skrivTilOss} target="_blank">
                                            <FormattedMessage id="steg.omsorgstilbud.fastIOmsorgstilbud.skrivTilOss" />
                                        </Lenke>
                                    </Box>
                                </AlertStripe>
                            </Box>

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
                    {omsorgstilbud.fastIOmsorgstilbud === YesOrNo.NO && (
                        <Box margin="l">
                            <AlertStripe type={'info'}>
                                <FormattedMessage id="steg.omsorgstilbud.fastIOmsorgstilbud.nei.info" />
                                <Lenke href={getLenker(intl.locale).skrivTilOss} target="_blank">
                                    <FormattedMessage id="steg.omsorgstilbud.fastIOmsorgstilbud.skrivTilOss" />
                                </Lenke>
                            </AlertStripe>
                        </Box>
                    )}
                </>
            )}
        </>
    );
};

export default OmsorgstilbudSpørsmål;
