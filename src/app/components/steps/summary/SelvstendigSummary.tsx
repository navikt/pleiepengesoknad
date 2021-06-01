import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import ArbeidsforholdSNFSummary from '../../../components/arbeidsforholdSNF-summary/ArbeidsforholdSNFSummary';
import SummarySection from '../../../components/summary-section/SummarySection';
import { ArbeidsforholdSNFApi } from '../../../types/PleiepengesøknadApiData';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    virksomhet?: VirksomhetApiData;
    harFlereVirksomheter: boolean | undefined;
    arbeidsforholdSN?: ArbeidsforholdSNFApi;
}

function SelvstendigSummary({ virksomhet, harFlereVirksomheter, arbeidsforholdSN }: Props) {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'summary.virksomhet.header')}>
            <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={virksomhet !== undefined} />
            </SummaryBlock>

            {virksomhet && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harFlereVirksomheter.header')}>
                        <JaNeiSvar harSvartJa={harFlereVirksomheter} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}>
                        <VirksomhetSummary virksomhet={virksomhet} />
                    </SummaryBlock>
                </>
            )}
            {arbeidsforholdSN && (
                <SummaryBlock header={intlHelper(intl, 'selvstendig.summary.arbeidsforhold.header')}>
                    <ArbeidsforholdSNFSummary arbeidsforhold={arbeidsforholdSN} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
}

export default SelvstendigSummary;
