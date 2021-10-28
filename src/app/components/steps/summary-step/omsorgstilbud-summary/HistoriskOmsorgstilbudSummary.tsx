import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { HistoriskOmsorgstilbudApiData } from '../../../../types/PleiepengesøknadApiData';
import TidEnkeltdager from '../../../dager-med-tid/TidEnkeltdager';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getHistoriskPeriode } from '../../../../utils/tidsbrukUtils';

interface Props {
    historiskOmsorgstilbud?: HistoriskOmsorgstilbudApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const HistoriskOmsorgstilbudSummary = ({ historiskOmsorgstilbud, søknadsperiode, søknadsdato }: Props) => {
    const intl = useIntl();
    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, søknadsdato);
    if (!periodeFørSøknadsdato) {
        return null;
    }

    const svar = historiskOmsorgstilbud ? 'ja' : 'nei';
    return (
        <>
            <Box margin="xl">
                <ContentWithHeader
                    header={intlHelper(intl, 'steg.omsorgstilbud.historisk.harBarnetVærtIOmsorgstilbud.spm', {
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
                    <TidEnkeltdager dager={historiskOmsorgstilbud.enkeltdager} />
                </SummaryBlock>
            )}
        </>
    );
};

export default HistoriskOmsorgstilbudSummary;
