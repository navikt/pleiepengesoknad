import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { TidFasteDager } from '@navikt/sif-common-pleiepenger';
import TidEnkeltdager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidEnkeltdager';
import { HistoriskOmsorgstilbudApiData } from '../../../types/SøknadApiData';
import { getHistoriskPeriode } from '../../../utils/fortidFremtidUtils';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';

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

    return (
        <SummarySection
            header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.historisk.header', {
                fra: prettifyDateExtended(periodeFørSøknadsdato.from),
                til: prettifyDateExtended(periodeFørSøknadsdato.to),
            })}>
            {historiskOmsorgstilbud === undefined && (
                <ContentWithHeader
                    header={intlHelper(intl, 'steg.omsorgstilbud.historisk.harBarnetVærtIOmsorgstilbud.spm', {
                        fra: prettifyDateExtended(periodeFørSøknadsdato.from),
                        til: prettifyDateExtended(periodeFørSøknadsdato.to),
                    })}>
                    <FormattedMessage id={`omsorgstilbud.svar.nei`} />
                </ContentWithHeader>
            )}
            {historiskOmsorgstilbud !== undefined && historiskOmsorgstilbud.ukedager && (
                <SummaryBlock
                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.historisk.fast.header')}
                    headerTag="h3">
                    <TidFasteDager fasteDager={historiskOmsorgstilbud.ukedager} />
                </SummaryBlock>
            )}
            {historiskOmsorgstilbud !== undefined && historiskOmsorgstilbud.enkeltdager && (
                <SummaryBlock
                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.historisk.enkeltdager.header')}
                    headerTag="h3">
                    <TidEnkeltdager dager={historiskOmsorgstilbud.enkeltdager} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
    return <></>;
};

export default HistoriskOmsorgstilbudSummary;
