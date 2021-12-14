import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AlertStripe from 'nav-frontend-alertstriper';
import TidUkedagerInput from '../../components/tid-ukedager-input/TidUkedagerInput';
import { Omsorgstilbud, SøknadFormField } from '../../types/SøknadFormData';
import {
    getOmsorgstilbudtimerValidatorFastDag,
    validateSkalIOmsorgstilbud,
} from '../../validation/validateOmsorgstilbudFields';
import SøknadFormComponents from '../SøknadFormComponents';
import OmsorgstilbudVariert from './omsorgstilbud-i-periode/OmsorgstilbudVariert';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from './omsorgstilbudStepUtils';
import { Element } from 'nav-frontend-typografi';

dayjs.extend(isBetween);

interface Props {
    tittel: string;
    periode: DateRange;
    omsorgstilbud?: Omsorgstilbud;
    søknadsdato: Date;
    onOmsorgstilbudChanged: () => void;
}

const OmsorgstilbudSpørsmålHelePerioden = ({
    periode,
    tittel,
    omsorgstilbud,
    søknadsdato,
    onOmsorgstilbudChanged,
}: Props) => {
    const intl = useIntl();

    const inkluderFastPlan = skalViseSpørsmålOmProsentEllerLiktHverUke(periode);

    return (
        <FormSection title={tittel}>
            <SøknadFormComponents.YesOrNoQuestion
                name={SøknadFormField.omsorgstilbud__skalBarnIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.helePerioden.skalBarnetVæreIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periode.from),
                    til: prettifyDateFull(periode.to),
                })}
                description={
                    <ExpandableInfo
                        title={intlHelper(
                            intl,
                            'steg.omsorgstilbud.helePerioden.hvorMyeTidIOmsorgstilbud.description.tittel'
                        )}>
                        <p>
                            <FormattedMessage
                                id={'steg.omsorgstilbud.helePerioden.hvorMyeTidIOmsorgstilbud.description.info.1'}
                            />
                        </p>
                    </ExpandableInfo>
                }
                validate={getYesOrNoValidator()}
            />

            {omsorgstilbud && omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.NO && (
                <Box margin="l">
                    <AlertStripe type={'info'}>
                        <FormattedMessage id="steg.omsorgstilbud.helePerioden.skalBarnetVæreIOmsorgstilbud.nei.info" />
                    </AlertStripe>
                </Box>
            )}
            {omsorgstilbud && omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES && (
                <>
                    {inkluderFastPlan && (
                        <FormBlock>
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.omsorgstilbud.helePerioden.erLiktHverUke.spm', {
                                    fra: prettifyDateFull(periode.from),
                                    til: prettifyDateFull(periode.to),
                                })}
                                useTwoColumns={false}
                                labels={{
                                    yes: intlHelper(intl, 'steg.omsorgstilbud.helePerioden.erLiktHverUke.yes'),
                                    no: intlHelper(intl, 'steg.omsorgstilbud.helePerioden.erLiktHverUke.no'),
                                }}
                                name={SøknadFormField.omsorgstilbud__helePerioden__erLiktHverUke}
                                description={
                                    <ExpandableInfo
                                        title={intlHelper(
                                            intl,
                                            'steg.omsorgstilbud.helePerioden.erLiktHverUke.info.tittel'
                                        )}>
                                        <FormattedMessage id="steg.omsorgstilbud.helePerioden.erLiktHverUke.info.1" />
                                        <br />
                                        <FormattedMessage id="steg.omsorgstilbud.helePerioden.erLiktHverUke.info.2" />
                                    </ExpandableInfo>
                                }
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                    )}
                    {inkluderFastPlan && omsorgstilbud.helePerioden?.erLiktHverUke === YesOrNo.YES && (
                        <FormBlock>
                            <SøknadFormComponents.InputGroup
                                legend={intlHelper(intl, 'steg.omsorgstilbud.helePerioden.hvorMyeTidIOmsorgstilbud')}
                                description={
                                    <FormattedMessage id="steg.omsorgstilbud.helePerioden.hvorMyeTidIOmsorgstilbud.description.info.2" />
                                }
                                validate={() => validateSkalIOmsorgstilbud(omsorgstilbud)}
                                name={'omsorgstilbud_gruppe' as any}>
                                <TidUkedagerInput
                                    name={SøknadFormField.omsorgstilbud__helePerioden__fasteDager}
                                    validator={getOmsorgstilbudtimerValidatorFastDag}
                                />
                            </SøknadFormComponents.InputGroup>
                        </FormBlock>
                    )}
                    {(inkluderFastPlan === false || omsorgstilbud.helePerioden?.erLiktHverUke === YesOrNo.NO) && (
                        <FormBlock>
                            <Box padBottom="m">
                                <Element tag="h3">Hvor mye er barnet i et omsorgstilbud?</Element>
                            </Box>
                            <OmsorgstilbudVariert
                                periode={periode}
                                tidIOmsorgstilbud={omsorgstilbud.helePerioden?.enkeltdager || {}}
                                onOmsorgstilbudChanged={() => {
                                    onOmsorgstilbudChanged();
                                }}
                                søknadsdato={søknadsdato}
                            />
                        </FormBlock>
                    )}
                </>
            )}
        </FormSection>
    );
};

export default OmsorgstilbudSpørsmålHelePerioden;
