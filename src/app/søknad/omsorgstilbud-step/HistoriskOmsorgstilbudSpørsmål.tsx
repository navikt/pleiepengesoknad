import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { TidFasteUkedagerInput } from '@navikt/sif-common-pleiepenger/lib';
import { getOmsorgstilbudFastDagValidator } from '@navikt/sif-common-pleiepenger/lib/omsorgstilbud-periode/omsorgstilbud-periode-form/omsorgstilbudFormValidation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Omsorgstilbud, SøknadFormField } from '../../types/SøknadFormData';
import { validateHistoriskOmsorgstilbud } from '../../validation/validateOmsorgstilbudFields';
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

const HistoriskOmsorgstilbudSpørsmål = ({
    tittel,
    periode,
    omsorgstilbud,
    harBådeHistoriskOgPlanlagt,
    onOmsorgstilbudChanged,
}: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    return (
        <FormSection title={tittel}>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.omsorgstilbud__harBarnVærtIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.historisk.harBarnetVærtIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periode.from),
                    til: prettifyDateFull(periode.to),
                })}
                description={omsorgstilbudInfo.erIOmsorgstilbud('historisk')}
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
            {omsorgstilbud?.harBarnVærtIOmsorgstilbud === YesOrNo.YES && (
                <>
                    {inkluderFastPlan && (
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.omsorgstilbud.historisk.erLiktHverUke.spm', {
                                    fra: prettifyDateFull(periode.from),
                                    til: prettifyDateFull(periode.to),
                                })}
                                useTwoColumns={false}
                                labels={{
                                    yes: intlHelper(intl, 'steg.omsorgstilbud.historisk.erLiktHverUke.yes'),
                                    no: intlHelper(intl, 'steg.omsorgstilbud.historisk.erLiktHverUke.no'),
                                }}
                                name={SøknadFormField.omsorgstilbud__historisk__erLiktHverUke}
                                description={omsorgstilbudInfo.erLiktHverUke('historisk')}
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
                    {inkluderFastPlan && omsorgstilbud.historisk?.erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <ResponsivePanel>
                                <SøknadFormComponents.InputGroup
                                    legend={intlHelper(intl, 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud')}
                                    description={omsorgstilbudInfo.hvorMye('historisk')}
                                    validate={() => validateHistoriskOmsorgstilbud(omsorgstilbud)}
                                    name={'omsorgstilbud.historisk.fasteUkedager' as any}>
                                    <TidFasteUkedagerInput
                                        name={SøknadFormField.omsorgstilbud__historisk__fasteDager}
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
                                                                    'validation.omsorgstilbud.fastdag_part.når.historisk'
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
                    {(inkluderFastPlan === false || omsorgstilbud.historisk?.erLiktHverUke === YesOrNo.NO) && (
                        <FormBlock>
                            <ResponsivePanel>
                                <OmsorgstilbudVariert
                                    omsorgsdager={omsorgstilbud.historisk?.enkeltdager || {}}
                                    tittel={intlHelper(intl, 'steg.omsorgstilbud.historisk.hvorMyeTittel')}
                                    periode={periode}
                                    formFieldName={SøknadFormField.omsorgstilbud__historisk__enkeltdager}
                                    erHistorisk={true}
                                    tidIOmsorgstilbud={omsorgstilbud.historisk?.enkeltdager || {}}
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

export default HistoriskOmsorgstilbudSpørsmål;
