import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import { DateRange, dateToday, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { HistoriskOmsorgstilbudApi } from '../../../types/PleiepengesøknadApiData';
import { getPeriodeFørSøknadsdato } from '../../../utils/omsorgstilbudUtils';
import OmsorgstilbudEnkeltdagerSummary from './OmsorgstilbudEnkeltdagerSummary';
import SummaryBlock from './SummaryBlock';

interface Props {
    historiskOmsorgstilbud?: HistoriskOmsorgstilbudApi;
    søknadsperiode: DateRange;
}

const HistoriskOmsorgstilbudSummary = ({ historiskOmsorgstilbud, søknadsperiode }: Props) => {
    const intl = useIntl();
    const periodeFørSøknadsdato = getPeriodeFørSøknadsdato(søknadsperiode, dateToday);
    if (!periodeFørSøknadsdato) {
        return null;
    }

    const svar = historiskOmsorgstilbud ? 'ja' : 'nei';
    return (
        <>
            <Box margin="l">
                <ContentWithHeader
                    header={intlHelper(intl, 'steg.omsorgstilbud.harBarnetVærtIOmsorgstilbud.spm', {
                        fra: prettifyDateFull(periodeFørSøknadsdato.from),
                        til: prettifyDateFull(periodeFørSøknadsdato.to),
                    })}>
                    <FormattedMessage id={`omsorgstilbud.svar.${svar}`} />
                </ContentWithHeader>
            </Box>
            {historiskOmsorgstilbud && (
                <SummaryBlock
                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.historisk.header')}
                    headerTag="h3">
                    <OmsorgstilbudEnkeltdagerSummary dager={historiskOmsorgstilbud.enkeltdager} />
                </SummaryBlock>
            )}
        </>
    );
};

export default HistoriskOmsorgstilbudSummary;