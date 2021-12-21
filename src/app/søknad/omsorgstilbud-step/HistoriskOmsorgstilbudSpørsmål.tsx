import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Omsorgstilbud, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import OmsorgstilbudVariert from './omsorgstilbud-i-periode/OmsorgstilbudVariert';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Element } from 'nav-frontend-typografi';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { skalViseSpørsmålOmProsentEllerLiktHverUke } from './omsorgstilbudStepUtils';
import {
    getOmsorgstilbudtimerValidatorFastDag,
    validateharVærtIOmsorgstilbud,
} from '../../validation/validateOmsorgstilbudFields';
import TidUkedagerInput from '../../components/tid-ukedager-input/TidUkedagerInput';

dayjs.extend(isBetween);

interface Props {
    tittel: string;
    periode: DateRange;
    søknadsdato: Date;
    omsorgstilbud?: Omsorgstilbud;
    onOmsorgstilbudChanged: () => void;
}

const HistoriskOmsorgstilbudSpørsmål = ({
    tittel,
    periode,
    omsorgstilbud,
    søknadsdato,
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
                description={
                    <ExpandableInfo
                        title={intlHelper(
                            intl,
                            'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud.description.tittel'
                        )}>
                        <p>
                            <FormattedMessage
                                id={'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud.description.info.1'}
                            />
                        </p>
                    </ExpandableInfo>
                }
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
                                description={
                                    <ExpandableInfo
                                        title={intlHelper(
                                            intl,
                                            'steg.omsorgstilbud.historisk.erLiktHverUke.info.tittel'
                                        )}>
                                        <FormattedMessage id="steg.omsorgstilbud.historisk.erLiktHverUke.info.1" />
                                        <br />
                                        <FormattedMessage id="steg.omsorgstilbud.historisk.erLiktHverUke.info.2" />
                                    </ExpandableInfo>
                                }
                                validate={getYesOrNoValidator()}
                            />
                        </FormBlock>
                    )}
                    {inkluderFastPlan && omsorgstilbud.historisk?.erLiktHverUke === YesOrNo.YES && (
                        <FormBlock margin="l">
                            <ResponsivePanel>
                                <SøknadFormComponents.InputGroup
                                    legend={intlHelper(intl, 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud')}
                                    description={
                                        <p>
                                            <FormattedMessage id="steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud.description.info.2" />
                                        </p>
                                    }
                                    validate={() => validateharVærtIOmsorgstilbud(omsorgstilbud)}
                                    name={'omsorgstilbud_gruppe' as any}>
                                    <TidUkedagerInput
                                        name={SøknadFormField.omsorgstilbud__historisk__fasteDager}
                                        validator={getOmsorgstilbudtimerValidatorFastDag}
                                    />
                                </SøknadFormComponents.InputGroup>
                            </ResponsivePanel>
                        </FormBlock>
                    )}
                    {(inkluderFastPlan === false || omsorgstilbud.historisk?.erLiktHverUke === YesOrNo.NO) && (
                        <FormBlock margin="l">
                            <ResponsivePanel>
                                <Box padBottom="m">
                                    <Element tag="h3">
                                        <FormattedMessage id="steg.omsorgstilbud.historisk.hvorMyeTittel" />
                                    </Element>
                                </Box>
                                <OmsorgstilbudVariert
                                    periode={periode}
                                    tidIOmsorgstilbud={omsorgstilbud.historisk?.enkeltdager || {}}
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

export default HistoriskOmsorgstilbudSpørsmål;
