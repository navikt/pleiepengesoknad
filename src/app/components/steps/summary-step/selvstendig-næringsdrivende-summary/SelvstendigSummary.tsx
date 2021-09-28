import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import SummarySection from '../../../summary-section/SummarySection';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';

interface Props {
    virksomhet?: VirksomhetApiData;
}

function SelvstendigSummary({ virksomhet }: Props) {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'summary.virksomhet.header')}>
            <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={virksomhet !== undefined} />
            </SummaryBlock>
            {virksomhet && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harFlereVirksomheter.header')}>
                        <JaNeiSvar harSvartJa={virksomhet.harFlereAktiveVirksomheter} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}>
                        <VirksomhetSummary virksomhet={virksomhet} />
                    </SummaryBlock>
                </>
            )}
        </SummarySection>
    );
}

export default SelvstendigSummary;
