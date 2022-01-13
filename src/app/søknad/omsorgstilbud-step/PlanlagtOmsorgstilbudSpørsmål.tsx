import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { getOmsorgstilbudFastDagValidator } from '@navikt/sif-common-pleiepenger/lib/omsorgstilbud-periode/omsorgstilbud-periode-form/omsorgstilbudFormValidation';
import TidFasteUkedagerInput from '@navikt/sif-common-pleiepenger/lib/tid-faste-ukedager-input/TidFasteUkedagerInput';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AlertStripe from 'nav-frontend-alertstriper';
import { Omsorgstilbud, SøknadFormField } from '../../types/SøknadFormData';
import { validatePlanlagtOmsorgstilbud } from '../../validation/validateOmsorgstilbudFields';
import SøknadFormComponents from '../SøknadFormComponents';
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import OmsorgstilbudVariert from './omsorgstilbud-variert/OmsorgstilbudVariert';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from './omsorgstilbudStepUtils';

dayjs.extend(isBetween);

interface Props {
    tittel: string;
    periode: DateRange;
    omsorgstilbud?: Omsorgstilbud;
    harBådeHistoriskOgPlanlagt: boolean;
    onOmsorgstilbudChanged: () => void;
}

const PlanlagtOmsorgstilbudSpørsmål = ({
    periode,
    tittel,
    omsorgstilbud,
    harBådeHistoriskOgPlanlagt,
    onOmsorgstilbudChanged,
}: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    return (
        <FormSection title={tittel}>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.omsorgstilbud__skalBarnIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periode.from),
                    til: prettifyDateFull(periode.to),
                })}
                description={omsorgstilbudInfo.erIOmsorgstilbud('planlagt')}
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
            />

            {omsorgstilbud && omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.NO && (
                <Box margin="l">
                    <AlertStripe type={'info'}>
                        <FormattedMessage id="steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.nei.info" />
                    </AlertStripe>
                </Box>
            )}
            {omsorgstilbud && omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES && (
                <>
                    {inkluderFastPlan && (
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.spm', {
                                    fra: prettifyDateFull(periode.from),
                                    til: prettifyDateFull(periode.to),
                                })}
                                useTwoColumns={false}
                                labels={{
                                    yes: intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.yes'),
                                    no: intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.no'),
                                }}
                                name={SøknadFormField.omsorgstilbud__planlagt__erLiktHverUke}
                                description={omsorgstilbudInfo.erLiktHverUke('planlagt')}
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
                    {inkluderFastPlan && omsorgstilbud.planlagt?.erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <ResponsivePanel>
                                <SøknadFormComponents.InputGroup
                                    legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud')}
                                    description={omsorgstilbudInfo.hvorMye('planlagt')}
                                    validate={() => validatePlanlagtOmsorgstilbud(omsorgstilbud)}
                                    name={'omsorgstilbud.planlagt.gruppe' as any}>
                                    <TidFasteUkedagerInput
                                        name={SøknadFormField.omsorgstilbud__planlagt__fasteDager}
                                        validateDag={(dag, value) => {
                                            const error = getOmsorgstilbudFastDagValidator()(value);
                                            return error
                                                ? {
                                                      key: `validation.omsorgstilbud.fastdag.tid.${error}`,
                                                      keepKeyUnaltered: true,
                                                      values: {
                                                          dag,
                                                          når: harBådeHistoriskOgPlanlagt
                                                              ? intlHelper(
                                                                    intl,
                                                                    'validation.omsorgstilbud.fastdag_part.når.planlagt'
                                                                )
                                                              : '',
                                                      },
                                                  }
                                                : undefined;
                                        }}
                                    />
                                </SøknadFormComponents.InputGroup>
                            </ResponsivePanel>
                        </FormBlock>
                    )}
                    {(inkluderFastPlan === false || omsorgstilbud.planlagt?.erLiktHverUke === YesOrNo.NO) && (
                        <FormBlock>
                            <ResponsivePanel>
                                <OmsorgstilbudVariert
                                    omsorgsdager={omsorgstilbud.planlagt?.enkeltdager || {}}
                                    tittel={intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvormyetittel')}
                                    formFieldName={SøknadFormField.omsorgstilbud__planlagt__enkeltdager}
                                    periode={periode}
                                    erHistorisk={false}
                                    tidIOmsorgstilbud={omsorgstilbud.planlagt?.enkeltdager || {}}
                                    onOmsorgstilbudChanged={() => {
                                        onOmsorgstilbudChanged();
                                    }}
                                />
                            </ResponsivePanel>
                        </FormBlock>
                    )}
                </>
            )}
        </FormSection>
    );
};

export default PlanlagtOmsorgstilbudSpørsmål;
