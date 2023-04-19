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
import { Systemtittel } from 'nav-frontend-typografi';
import { OmsorgstilbudFormValues, SøknadFormField } from '../../types/SøknadFormValues';
import { søkerFortidOgFremtid, søkerKunFortid, søkerKunFremtid } from '../../utils/søknadsperiodeUtils';
import { validateOmsorgstilbud } from '../../validation/validateOmsorgstilbudFields';
import SøknadFormComponents from '../SøknadFormComponents';
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import OmsorgstilbudVariert from './omsorgstilbud-variert/OmsorgstilbudVariert';
import {
    getPeriode,
    getSpmTeksterLiktHverUke,
    skalViseSpørsmålOmProsentEllerLiktHverUke,
    visLiktHverUke,
} from './omsorgstilbudStepUtils';

interface Props {
    periode: DateRange;
    omsorgstilbud?: OmsorgstilbudFormValues;
    onOmsorgstilbudChanged: () => void;
}

const OmsorgstilbudSpørsmål = ({ periode, omsorgstilbud, onOmsorgstilbudChanged }: Props) => {
    const intl = useIntl();

    const periodeFortid = søkerKunFortid(periode);
    const periodeFremtid = søkerKunFremtid(periode);
    const periodeFortidFremtid = søkerFortidOgFremtid(periode);
    const riktigSøknadsperiode = getPeriode(periode, omsorgstilbud);
    const skalViseLiktHverUke = visLiktHverUke(periodeFortidFremtid, periodeFortid, periodeFremtid, omsorgstilbud);
    const tekstLiktHverUke = getSpmTeksterLiktHverUke(omsorgstilbud);
    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    return (
        <>
            {(periodeFortid || periodeFortidFremtid) && (
                <Box margin="xl">
                    {periodeFortidFremtid && (
                        <Box padBottom="l">
                            <Systemtittel tag={'h2'}>
                                <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFortid" />
                            </Systemtittel>
                        </Box>
                    )}

                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fortid}
                        legend={intlHelper(
                            intl,
                            periodeFortidFremtid
                                ? 'steg.omsorgstilbud.erIOmsorgstilbudFortid.spm'
                                : 'steg.omsorgstilbud.erIOmsorgstilbudKunFortid.spm'
                        )}
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
                        useTwoColumns={false}
                        data-testid="erIOmsorgstilbud-fortid"
                    />
                </Box>
            )}
            {(periodeFremtid || periodeFortidFremtid) && (
                <Box margin="xl">
                    {periodeFortidFremtid && (
                        <Box padBottom="l">
                            <Systemtittel tag={'h2'}>
                                <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid" />
                            </Systemtittel>
                        </Box>
                    )}

                    <SøknadFormComponents.YesOrNoQuestion
                        name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fremtid}
                        legend={intlHelper(
                            intl,
                            periodeFortidFremtid
                                ? 'steg.omsorgstilbud.erIOmsorgstilbudFremtid.spm'
                                : 'steg.omsorgstilbud.erIOmsorgstilbudKunFremtid.spm'
                        )}
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
                        data-testid="erIOmsorgstilbud-fremtid"
                    />
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

            {omsorgstilbud && skalViseLiktHverUke && (
                <>
                    {inkluderFastPlan && (
                        <FormBlock>
                            {periodeFortidFremtid && (
                                <>
                                    <Box padBottom="l">
                                        <Systemtittel tag={'h2'}>
                                            <FormattedMessage id="steg.omsorgstilbud.erLiktHverUke.spm.tittel" />
                                        </Systemtittel>
                                        {omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES &&
                                            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW && (
                                                <Box margin="l">
                                                    <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.usikker" />
                                                </Box>
                                            )}
                                    </Box>
                                </>
                            )}
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, `steg.omsorgstilbud.erLiktHverUke.spm.${tekstLiktHverUke}`)}
                                useTwoColumns={false}
                                labels={{
                                    yes: intlHelper(intl, `steg.omsorgstilbud.erLiktHverUke.yes.${tekstLiktHverUke}`),
                                    no: intlHelper(intl, `steg.omsorgstilbud.erLiktHverUke.no.${tekstLiktHverUke}`),
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
                                data-testid="omsorgstilbud-erLiktHverUke"
                            />
                        </FormBlock>
                    )}
                    {inkluderFastPlan && omsorgstilbud.erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <ResponsivePanel>
                                <SøknadFormComponents.InputGroup
                                    legend={intlHelper(
                                        intl,
                                        periodeFremtid
                                            ? 'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud.kunFremtid'
                                            : 'steg.omsorgstilbud.hvorMyeTidIOmsorgstilbud'
                                    )}
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
                                        data-testid="fasteDager"
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
                                    tittel={intlHelper(
                                        intl,
                                        periodeFremtid
                                            ? 'steg.omsorgstilbud.hvormyetittel.kunFremtid'
                                            : 'steg.omsorgstilbud.hvormyetittel'
                                    )}
                                    formFieldName={SøknadFormField.omsorgstilbud__enkeltdager}
                                    periode={riktigSøknadsperiode}
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
