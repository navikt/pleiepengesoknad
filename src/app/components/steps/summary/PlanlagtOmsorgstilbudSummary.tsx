import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { PlanlagtOmsorgstilbudApi, VetOmsorgstilbud } from '../../../types/PleiepengesøknadApiData';
import OmsorgstilbudEnkeltdagerSummary from './OmsorgstilbudEnkeltdagerSummary';
import OmsorgstilbudFasteDagerSummary from './OmsorgstilbudFasteDagerSummary';
import SummaryBlock from './SummaryBlock';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getPeriodeFraOgMedSøknadsdato } from '../../../utils/omsorgstilbudUtils';

interface Props {
    omsorgstilbud?: PlanlagtOmsorgstilbudApi;
    søknadsperiode: DateRange;
}

const PlanlagtOmsorgstilbudSummary = ({ omsorgstilbud, søknadsperiode }: Props) => {
    const intl = useIntl();

    const periodeFraOgMedSøknadsdato = getPeriodeFraOgMedSøknadsdato(søknadsperiode);
    if (!periodeFraOgMedSøknadsdato) {
        return null;
    }

    const svar = omsorgstilbud ? 'ja' : 'nei';

    return (
        <>
            <Box margin="l">
                <ContentWithHeader
                    header={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsynKommendePeriode.spm', {
                        fra: prettifyDateFull(periodeFraOgMedSøknadsdato.from),
                        til: prettifyDateFull(periodeFraOgMedSøknadsdato.to),
                    })}>
                    <FormattedMessage id={`tilsynsordning.svar.${svar}`} />
                </ContentWithHeader>
            </Box>
            {omsorgstilbud && (
                <>
                    <Box margin="l">
                        <ContentWithHeader
                            header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.hvorMyeTidOms.spm')}>
                            {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_ALLE_TIMER && (
                                <>
                                    <FormattedMessage
                                        id={`steg.oppsummering.tilsynsordning.hvorMyeTidOms.${omsorgstilbud.vetOmsorgstilbud}`}
                                    />
                                    <SummaryBlock
                                        header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.planlagt.header')}
                                        headerTag="h3">
                                        {omsorgstilbud.fasteDager && (
                                            <OmsorgstilbudFasteDagerSummary fasteDager={omsorgstilbud.fasteDager} />
                                        )}
                                        {omsorgstilbud.enkeltDager && (
                                            <OmsorgstilbudEnkeltdagerSummary dager={omsorgstilbud.enkeltDager} />
                                        )}
                                    </SummaryBlock>
                                </>
                            )}

                            {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_IKKE && (
                                <>
                                    <FormattedMessage id="steg.oppsummering.tilsynsordning.hvorMyeTidOms.nei" />
                                </>
                            )}
                        </ContentWithHeader>
                    </Box>
                </>
            )}
        </>
    );
};
export default PlanlagtOmsorgstilbudSummary;
