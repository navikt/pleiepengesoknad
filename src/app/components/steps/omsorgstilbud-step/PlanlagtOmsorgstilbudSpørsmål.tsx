import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AlertStripe from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { VetOmsorgstilbud } from '../../../types';
import { AppFormField, Omsorgstilbud } from '../../../types/PleiepengesøknadFormData';
import { visSpørsmålOmTidErLikHverUke } from '../../../utils/tidsbrukUtils';
import {
    getOmsorgstilbudtimerValidatorFastDag,
    validateSkalIOmsorgstilbud,
} from '../../../validation/validateOmsorgstilbudFields';
import AppForm from '../../app-form/AppForm';
import OmsorgstilbudIPeriodeSpørsmål from '../../omsorgstilbud/OmsorgstilbudIPeriodeSpørsmål';
import TidFasteDagerInput from '../../tid-faste-dager-input/TidFasteDagerInput';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';

dayjs.extend(isBetween);

interface Props {
    tittel: string;
    periode: DateRange;
    omsorgstilbud?: Omsorgstilbud;
    søknadsdato: Date;
    onOmsorgstilbudChanged: () => void;
}

const PlanlagtOmsorgstilbudSpørsmål = ({
    periode,
    tittel,
    omsorgstilbud,
    søknadsdato,
    onOmsorgstilbudChanged,
}: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = visSpørsmålOmTidErLikHverUke(periode);

    return (
        <FormSection title={tittel}>
            <AppForm.YesOrNoQuestion
                name={AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periode.from),
                    til: prettifyDateFull(periode.to),
                })}
                validate={getYesOrNoValidator()}
            />

            {omsorgstilbud && omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <AppForm.RadioPanelGroup
                            legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.vetHvorMye.spm')}
                            name={AppFormField.omsorgstilbud__planlagt__vetHvorMyeTid}
                            radios={[
                                {
                                    label: intlHelper(intl, 'steg.omsorgstilbud.planlagt.vetHvorMye.ja'),
                                    value: VetOmsorgstilbud.VET_ALLE_TIMER,
                                },
                                {
                                    label: intlHelper(intl, 'steg.omsorgstilbud.planlagt.vetHvorMye.nei'),
                                    value: VetOmsorgstilbud.VET_IKKE,
                                },
                            ]}
                            validate={getRequiredFieldValidator()}
                            useTwoColumns={true}
                            description={
                                <div style={{ marginTop: '-.5rem' }}>
                                    <FormattedMessage id="steg.omsorgstilbud.planlagt.vetHvorMye.info" />
                                </div>
                            }
                        />
                    </FormBlock>

                    {omsorgstilbud.planlagt?.vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE && (
                        <FormBlock>
                            <AlertStripe type={'info'}>
                                <FormattedMessage id="steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.alertInfo.nei" />
                            </AlertStripe>
                        </FormBlock>
                    )}

                    {omsorgstilbud.planlagt?.vetHvorMyeTid === VetOmsorgstilbud.VET_ALLE_TIMER && (
                        <>
                            {inkluderFastPlan && (
                                <FormBlock>
                                    <AppForm.YesOrNoQuestion
                                        legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.spm')}
                                        name={AppFormField.omsorgstilbud__planlagt__erLiktHverUke}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'steg.omsorgstilbud.planlagt.erLiktHverUke.info.tittel'
                                                )}>
                                                <FormattedMessage id="steg.omsorgstilbud.planlagt.erLiktHverUke.info.1" />
                                                <br />
                                                <FormattedMessage id="steg.omsorgstilbud.planlagt.erLiktHverUke.info.2" />
                                            </ExpandableInfo>
                                        }
                                        validate={getYesOrNoValidator()}
                                    />
                                </FormBlock>
                            )}
                            {inkluderFastPlan && omsorgstilbud.planlagt?.erLiktHverUke === YesOrNo.YES && (
                                <FormBlock>
                                    <AppForm.InputGroup
                                        legend={intlHelper(
                                            intl,
                                            'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud'
                                        )}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel'
                                                )}>
                                                {intlHelper(
                                                    intl,
                                                    'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description'
                                                )}
                                            </ExpandableInfo>
                                        }
                                        validate={() => validateSkalIOmsorgstilbud(omsorgstilbud)}
                                        name={'omsorgstilbud_gruppe' as any}>
                                        <ResponsivePanel>
                                            <TidFasteDagerInput
                                                name={AppFormField.omsorgstilbud__planlagt__fasteDager}
                                                validator={getOmsorgstilbudtimerValidatorFastDag}
                                            />
                                        </ResponsivePanel>
                                    </AppForm.InputGroup>
                                </FormBlock>
                            )}
                            {(inkluderFastPlan === false || omsorgstilbud.planlagt?.erLiktHverUke === YesOrNo.NO) && (
                                <FormBlock>
                                    <ResponsivePanel>
                                        <OmsorgstilbudIPeriodeSpørsmål
                                            periode={periode}
                                            tidIOmsorgstilbud={omsorgstilbud.planlagt.enkeltdager || {}}
                                            onOmsorgstilbudChanged={() => {
                                                onOmsorgstilbudChanged();
                                            }}
                                            søknadsdato={søknadsdato}
                                        />
                                    </ResponsivePanel>
                                </FormBlock>
                            )}
                        </>
                    )}
                </>
            )}
        </FormSection>
    );
};

export default PlanlagtOmsorgstilbudSpørsmål;
