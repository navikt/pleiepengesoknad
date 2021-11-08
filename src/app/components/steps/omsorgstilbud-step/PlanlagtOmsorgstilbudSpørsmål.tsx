import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AlertStripe from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { AppFormField, Omsorgstilbud } from '../../../types/PleiepengesøknadFormData';
import { visSpørsmålOmTidErLikHverUke } from '../../../utils/tidsbrukUtils';
import {
    getOmsorgstilbudtimerValidatorFastDag,
    validateSkalIOmsorgstilbud,
} from '../../../validation/validateOmsorgstilbudFields';
import AppForm from '../../app-form/AppForm';
import OmsorgstilbudIPeriodeSpørsmål from '../../omsorgstilbud/OmsorgstilbudIPeriodeSpørsmål';
import TidFasteDagerInput from '../../tid-faste-dager-input/TidFasteDagerInput';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

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
                description={
                    <ExpandableInfo
                        title={intlHelper(
                            intl,
                            'steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.spm.description.tittel'
                        )}>
                        <p>
                            <FormattedMessage />
                        </p>
                    </ExpandableInfo>
                }
                validate={getYesOrNoValidator()}
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
                            <AppForm.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.spm', {
                                    fra: prettifyDateFull(periode.from),
                                    til: prettifyDateFull(periode.to),
                                })}
                                useTwoColumns={false}
                                labels={{
                                    yes: intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.yes'),
                                    no: intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.no'),
                                }}
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
                                legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud')}
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
                                    tidIOmsorgstilbud={omsorgstilbud.planlagt?.enkeltdager || {}}
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
        </FormSection>
    );
};

export default PlanlagtOmsorgstilbudSpørsmål;
