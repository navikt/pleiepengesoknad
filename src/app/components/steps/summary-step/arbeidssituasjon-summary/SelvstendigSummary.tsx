import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import { SelvstendigNæringsdrivendeApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';

interface Props {
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
}

function SelvstendigSummary({ selvstendigNæringsdrivende }: Props) {
    const intl = useIntl();
    const { arbeidsforhold, virksomhet } = selvstendigNæringsdrivende || {};
    return (
        <SummaryBlock
            header={intlHelper(intl, 'arbeidsforhold.oppsummering.selvstendig')}
            headerTag="h3"
            indentChildren={true}>
            <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={virksomhet !== undefined} />
            </SummaryBlock>
            {virksomhet && arbeidsforhold && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.harFlereVirksomheter.header')}>
                        <JaNeiSvar harSvartJa={virksomhet.harFlereAktiveVirksomheter} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}>
                        <VirksomhetSummary virksomhet={virksomhet} />
                    </SummaryBlock>
                    <SummaryBlock
                        header={intlHelper(
                            intl,
                            arbeidsforhold.erAktivtArbeidsforhold === false
                                ? 'selvstendig.arbeidsforhold.arbeidsform.avsluttet.spm'
                                : 'selvstendig.arbeidsforhold.arbeidsform.spm'
                        )}>
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsforhold.arbeidsform}`}
                        />
                    </SummaryBlock>
                    <SummaryBlock
                        header={intlHelper(
                            intl,
                            arbeidsforhold.erAktivtArbeidsforhold === false
                                ? `snFrilanser.arbeidsforhold.${arbeidsforhold.arbeidsform}.avsluttet.spm`
                                : `snFrilanser.arbeidsforhold.${arbeidsforhold.arbeidsform}.spm`
                        )}>
                        <FormattedMessage
                            id="timer.ikkeTall"
                            values={{
                                timer: arbeidsforhold.jobberNormaltTimer,
                            }}
                        />
                    </SummaryBlock>
                </>
            )}
        </SummaryBlock>
    );
}

export default SelvstendigSummary;
