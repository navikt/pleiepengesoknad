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
import {
    skalViseSpørsmålOmProsentEllerLiktHverUke,
    søkerFortid,
    søkerFortidFremtid,
    søkerFremtid,
} from './omsorgstilbudStepUtils';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import dayjs from 'dayjs';

interface Props {
    periode: DateRange;
    omsorgstilbud?: OmsorgstilbudFormData;
    onOmsorgstilbudChanged: () => void;
}

const OmsorgstilbudSpørsmål = ({ periode, omsorgstilbud, onOmsorgstilbudChanged }: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    const periodeFortid = søkerFortid(periode);
    const periodeFremtid = søkerFremtid(periode);
    const periodeFortidFremtid = søkerFortidFremtid(periode);

    const getPeriode = (): DateRange => {
        if (
            omsorgstilbud &&
            omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES &&
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO
        ) {
            return {
                from: periode.from,
                to: dayjs().subtract(1, 'day').toDate(),
            };
        }

        if (
            omsorgstilbud &&
            omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO &&
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.YES
        ) {
            return {
                from: dayjs().toDate(),
                to: periode.to,
            };
        }

        return periode;
    };

    const visValg = () => {
        if (!omsorgstilbud) {
            return false;
        }

        if (
            omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO &&
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO
        ) {
            return false;
        }
        if (
            omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO &&
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW
        ) {
            return false;
        }

        if (
            omsorgstilbud.erIOmsorgstilbudFremtid !== YesOrNo.YES &&
            omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO
        )
            return false;
        if (
            omsorgstilbud.erIOmsorgstilbudFortid !== YesOrNo.YES &&
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO
        )
            return false;
        if (
            omsorgstilbud.erIOmsorgstilbudFortid !== YesOrNo.YES &&
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW
        )
            return false;

        if (periodeFortidFremtid && (!omsorgstilbud.erIOmsorgstilbudFortid || !omsorgstilbud.erIOmsorgstilbudFremtid)) {
            return false;
        }

        if (periodeFortid && !omsorgstilbud.erIOmsorgstilbudFortid) {
            return false;
        }

        if (periodeFremtid && !omsorgstilbud.erIOmsorgstilbudFremtid) {
            return false;
        }

        return true;
    };
    console.log('omsorgstilbud: ', omsorgstilbud);
    return (
        <>
            {periodeFortid && (
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fortid}
                    legend={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudFortid.spm', {
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
                    labels={{ yes: 'Ja, i hele eller deler av perioden' }}
                />
            )}
            {periodeFremtid && (
                <SøknadFormComponents.YesOrNoQuestion
                    name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fremtid}
                    legend={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudFremtid.spm', {
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
                    includeDoNotKnowOption={true}
                    labels={{ yes: 'Ja, i hele eller deler av perioden', doNotKnow: 'Usikker' }}
                />
            )}

            {periodeFortidFremtid && (
                <>
                    <FormSection title={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudFortid')}>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fortid}
                            legend={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudFortid.spm', {
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
                            labels={{ yes: 'Ja, i hele eller deler av perioden' }}
                        />
                    </FormSection>
                    <FormSection title={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudFremtid')}>
                        <SøknadFormComponents.YesOrNoQuestion
                            name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fremtid}
                            legend={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbudFremtid.spm', {
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
                            includeDoNotKnowOption={true}
                            labels={{ yes: 'Ja, i hele eller deler av perioden', doNotKnow: 'Usikker' }}
                        />
                    </FormSection>
                </>
            )}
            {omsorgstilbud && omsorgstilbud.erIOmsorgstilbud === YesOrNo.NO && (
                <Box margin="l">
                    <AlertStripe type={'info'}>
                        <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbud.nei.info" />
                    </AlertStripe>
                </Box>
            )}

            {omsorgstilbud &&
                omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES &&
                omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW && (
                    <Box margin="l">
                        <AlertStripe type={'info'}>
                            <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.usikker" />
                        </AlertStripe>
                    </Box>
                )}
            {omsorgstilbud &&
                omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO &&
                omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW && (
                    <Box margin="l">
                        <AlertStripe type={'info'}>
                            <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.neiUsikker" />
                        </AlertStripe>
                    </Box>
                )}
            {omsorgstilbud && periodeFremtid && omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW && (
                <Box margin="l">
                    <AlertStripe type={'info'}>
                        <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.neiUsikker" />
                    </AlertStripe>
                </Box>
            )}

            {omsorgstilbud && visValg() && (
                <>
                    {inkluderFastPlan && (
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
                    )}
                    {inkluderFastPlan && omsorgstilbud.erLiktHverUke === YesOrNo.YES && (
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
                    )}
                    {((inkluderFastPlan === false &&
                        (omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES ||
                            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.YES)) ||
                        omsorgstilbud.erLiktHverUke === YesOrNo.NO) && (
                        <FormBlock>
                            <ResponsivePanel>
                                <OmsorgstilbudVariert
                                    omsorgsdager={omsorgstilbud.enkeltdager || {}}
                                    tittel={intlHelper(intl, 'steg.omsorgstilbud.hvormyetittel')}
                                    formFieldName={SøknadFormField.omsorgstilbud__enkeltdager}
                                    periode={getPeriode()}
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
        </>
    );
};

export default OmsorgstilbudSpørsmål;
