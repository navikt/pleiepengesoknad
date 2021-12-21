import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import { HistoriskOmsorgstilbudApiData } from '../../../types/SøknadApiData';
import { getHistoriskPeriode } from '../../../utils/fortidFremtidUtils';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import TidFasteDager from '../../../components/dager-med-tid/TidFasteDager';

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
                <>
                    {historiskOmsorgstilbud.erLiktHverUke !== undefined && (
                        <SummaryBlock
                            header={intlHelper(intl, 'steg.omsorgstilbud.historisk.erLiktHverUke.spm', {
                                fra: prettifyDateFull(periodeFørSøknadsdato.from),
                                til: prettifyDateFull(periodeFørSøknadsdato.to),
                            })}>
                            <JaNeiSvar harSvartJa={historiskOmsorgstilbud.erLiktHverUke} />
                        </SummaryBlock>
                    )}
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.historisk.header')}
                        headerTag="h3">
                        {historiskOmsorgstilbud.ukedager && (
                            <TidFasteDager fasteDager={historiskOmsorgstilbud.ukedager} />
                        )}
                        {historiskOmsorgstilbud.enkeltdager && (
                            <TidEnkeltdager dager={historiskOmsorgstilbud.enkeltdager} />
                        )}
                    </SummaryBlock>
                </>
            )}
        </>
    );
};

export default HistoriskOmsorgstilbudSummary;
