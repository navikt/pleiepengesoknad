import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { OmsorgstilbudApi, VetOmsorgstilbud } from '../../../types/PleiepengesøknadApiData';
import OmsorgstilbudEnkeltdagerSummary from './OmsorgstilbudEnkeltdagerSummary';
import OmsorgstilbudFasteDagerSummary from './OmsorgstilbudFasteDagerSummary';
import SummaryBlock from './SummaryBlock';

interface Props {
    omsorgstilbud?: OmsorgstilbudApi;
}

const TilsynsordningSummary = ({ omsorgstilbud }: Props) => {
    const intl = useIntl();
    const svar = omsorgstilbud ? 'ja' : 'nei';

    return (
        <>
            <Box margin="l">
                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.spm')}>
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
                                        header={intlHelper(
                                            intl,
                                            'steg.oppsummering.tilsynsordning.hvorMyeTidOms.fasteDager.header'
                                        )}
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

export default TilsynsordningSummary;
