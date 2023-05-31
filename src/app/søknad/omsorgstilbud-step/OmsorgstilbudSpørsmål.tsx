import { Alert, Heading } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import FormBlock from '@navikt/sif-common-core-ds/lib/atoms/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core-ds/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik-ds/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik-ds/lib/validation';
import { dateFormatter } from '@navikt/sif-common-utils/lib';
import ResponsivePanel from '../../components/responsive-panel/ResponsivePanel';
import { getOmsorgstilbudFastDagValidator } from '../../local-sif-common-pleiepenger/components/omsorgstilbud-periode/components/omsorgstilbud-periode-form/omsorgstilbudFormValidation';
import TidFasteUkedagerInput from '../../local-sif-common-pleiepenger/components/tid-faste-ukedager-input/TidFasteUkedagerInput';
import { OmsorgstilbudFormValues, SøknadFormField } from '../../types/SøknadFormValues';
import { YesOrNoOrDoNotKnow } from '../../types/YesOrNoOrDoNotKnow';
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
                <Block margin="xl">
                    {periodeFortidFremtid && (
                        <Block padBottom="l">
                            <Heading level="2" size="medium">
                                <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFortid" />
                            </Heading>
                        </Block>
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
                                        fra: dateFormatter.full(periode.from),
                                        til: dateFormatter.full(periode.to),
                                    },
                                };
                            }
                            return undefined;
                        }}
                        labels={{ yes: 'Ja, i hele eller deler av perioden' }}
                        data-testid="erIOmsorgstilbud-fortid"
                    />
                </Block>
            )}
            {(periodeFremtid || periodeFortidFremtid) && (
                <Block margin="xl">
                    {periodeFortidFremtid && (
                        <Block padBottom="l">
                            <Heading level="2" size="medium">
                                <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid" />
                            </Heading>
                        </Block>
                    )}

                    <SøknadFormComponents.RadioGroup
                        name={SøknadFormField.omsorgstilbud__erIOmsorgstilbud_fremtid}
                        legend={intlHelper(
                            intl,
                            periodeFortidFremtid
                                ? 'steg.omsorgstilbud.erIOmsorgstilbudFremtid.spm'
                                : 'steg.omsorgstilbud.erIOmsorgstilbudKunFremtid.spm'
                        )}
                        validate={(value) => {
                            const error = value === undefined ? 'yesOrNoIsUnanswered' : undefined;
                            if (error) {
                                return {
                                    key: error,
                                    values: {
                                        fra: dateFormatter.full(periode.from),
                                        til: dateFormatter.full(periode.to),
                                    },
                                };
                            }
                            return undefined;
                        }}
                        radios={[
                            {
                                label: 'Ja, i hele eller deler av perioden',
                                value: YesOrNo.YES,
                            },
                            {
                                label: 'Nei',
                                value: YesOrNo.NO,
                            },
                            {
                                label: 'Usikker',
                                value: YesOrNoOrDoNotKnow.DO_NOT_KNOW,
                            },
                        ]}
                        data-testid="erIOmsorgstilbud-fremtid"
                    />
                </Block>
            )}

            {omsorgstilbud &&
                omsorgstilbud.erIOmsorgstilbudFortid === YesOrNoOrDoNotKnow.NO &&
                omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNoOrDoNotKnow.DO_NOT_KNOW && (
                    <Block margin="l">
                        <Alert variant="info">
                            <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.neiUsikker" />
                        </Alert>
                    </Block>
                )}
            {omsorgstilbud &&
                periodeFremtid &&
                omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNoOrDoNotKnow.DO_NOT_KNOW && (
                    <Block margin="l">
                        <Alert variant="info">
                            <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.neiUsikker" />
                        </Alert>
                    </Block>
                )}

            {omsorgstilbud && skalViseLiktHverUke && (
                <>
                    {inkluderFastPlan && (
                        <FormBlock>
                            {periodeFortidFremtid && (
                                <>
                                    <Block padBottom="l">
                                        <Heading level="2" size="medium">
                                            <FormattedMessage id="steg.omsorgstilbud.erLiktHverUke.spm.tittel" />
                                        </Heading>
                                        {omsorgstilbud.erIOmsorgstilbudFortid === YesOrNoOrDoNotKnow.YES &&
                                            omsorgstilbud.erIOmsorgstilbudFremtid ===
                                                YesOrNoOrDoNotKnow.DO_NOT_KNOW && (
                                                <Block margin="l">
                                                    <FormattedMessage id="steg.omsorgstilbud.erIOmsorgstilbudFremtid.usikker" />
                                                </Block>
                                            )}
                                    </Block>
                                </>
                            )}
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, `steg.omsorgstilbud.erLiktHverUke.spm.${tekstLiktHverUke}`)}
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
                                                  fra: dateFormatter.full(periode.from),
                                                  til: dateFormatter.full(periode.to),
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
                        (omsorgstilbud.erIOmsorgstilbudFortid === YesOrNoOrDoNotKnow.YES ||
                            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNoOrDoNotKnow.YES)) ||
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
