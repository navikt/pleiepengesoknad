import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { PlanlagtOmsorgstilbudApi, VetOmsorgstilbud } from '../../../types/PleiepengesøknadApiData';
import OmsorgstilbudEnkeltdagerSummary from './OmsorgstilbudEnkeltdagerSummary';
import OmsorgstilbudFasteDagerSummary from './OmsorgstilbudFasteDagerSummary';
import SummaryBlock from './SummaryBlock';
import { DateRange, dateToday, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getPlanlagtPeriode } from '../../../utils/omsorgstilbudUtils';
import JaNeiSvar from './JaNeiSvar';

interface Props {
    omsorgstilbud?: PlanlagtOmsorgstilbudApi;
    søknadsperiode: DateRange;
}

const PlanlagtOmsorgstilbudSummary = ({ omsorgstilbud, søknadsperiode }: Props) => {
    const intl = useIntl();

    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, dateToday);
    if (!periodeFraOgMedSøknadsdato) {
        return null;
    }

    const svar = omsorgstilbud ? 'ja' : 'nei';

    return (
        <>
            <Box margin="xl">
                <ContentWithHeader
                    header={intlHelper(intl, 'steg.omsorgstilbud.skalBarnetIOmsorgstilbud.spm', {
                        fra: prettifyDateFull(periodeFraOgMedSøknadsdato.from),
                        til: prettifyDateFull(periodeFraOgMedSøknadsdato.to),
                    })}>
                    <FormattedMessage id={`omsorgstilbud.svar.${svar}`} />
                </ContentWithHeader>
            </Box>
            {omsorgstilbud && (
                <>
                    <Box margin="xl">
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.hvorMyeTidOms.spm')}>
                            {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_ALLE_TIMER && (
                                <>
                                    <FormattedMessage
                                        id={`steg.oppsummering.omsorgstilbud.hvorMyeTidOms.${omsorgstilbud.vetOmsorgstilbud}`}
                                    />
                                </>
                            )}

                            {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_IKKE && (
                                <>
                                    <FormattedMessage
                                        id={`steg.oppsummering.omsorgstilbud.hvorMyeTidOms.${omsorgstilbud.vetOmsorgstilbud}`}
                                    />
                                </>
                            )}
                        </SummaryBlock>
                        {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_ALLE_TIMER && (
                            <>
                                {omsorgstilbud.erLiktHverDag !== undefined && (
                                    <SummaryBlock
                                        header={intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverDag.spm')}>
                                        <JaNeiSvar harSvartJa={omsorgstilbud.erLiktHverDag} />
                                    </SummaryBlock>
                                )}
                                <SummaryBlock
                                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.planlagt.header')}
                                    headerTag="h3">
                                    {omsorgstilbud.ukedager && (
                                        <OmsorgstilbudFasteDagerSummary fasteDager={omsorgstilbud.ukedager} />
                                    )}
                                    {omsorgstilbud.enkeltdager && (
                                        <OmsorgstilbudEnkeltdagerSummary dager={omsorgstilbud.enkeltdager} />
                                    )}
                                </SummaryBlock>
                            </>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};
export default PlanlagtOmsorgstilbudSummary;
