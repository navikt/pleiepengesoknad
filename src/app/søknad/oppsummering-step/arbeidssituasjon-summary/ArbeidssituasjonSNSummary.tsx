import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import { Element } from 'nav-frontend-typografi';
import { SelvstendigNæringsdrivendeApiData } from '../../../types/SøknadApiData';

interface Props {
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
}

function ArbeidssituasjonSNSummary({ selvstendigNæringsdrivende }: Props) {
    const intl = useIntl();
    const { arbeidsforhold, virksomhet } = selvstendigNæringsdrivende || {};
    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.selvstendig.header')} headerTag="h3">
            {selvstendigNæringsdrivende === undefined && (
                <ul>
                    <li>
                        <FormattedMessage id={'oppsummering.arbeidssituasjon.selvstendig.erIkkeSN'} tagName="p" />
                    </li>
                </ul>
            )}
            {virksomhet && arbeidsforhold && (
                <>
                    <ul>
                        <li>
                            <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.erSn" />
                        </li>
                        <li>
                            {virksomhet.harFlereAktiveVirksomheter ? (
                                <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.flereVirksomheter" />
                            ) : (
                                <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.enVirksomhet" />
                            )}
                        </li>
                        {arbeidsforhold.normalarbeidstid.erLiktHverUke === false && (
                            <>
                                <li>
                                    <FormattedMessage
                                        id={`oppsummering.arbeidssituasjon.tid`}
                                        values={{ timer: arbeidsforhold.normalarbeidstid.timerPerUke }}
                                    />
                                </li>
                                <li>
                                    <FormattedMessage
                                        id={
                                            arbeidsforhold.harFraværIPeriode
                                                ? `oppsummering.arbeidssituasjon.harFravær`
                                                : 'oppsummering.arbeidssituasjon.harIkkeFravær'
                                        }
                                    />
                                </li>
                            </>
                        )}
                    </ul>
                    <Element tag="h4">{intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}</Element>
                    <Box margin="m">
                        <div style={{ paddingLeft: '1rem' }}>
                            <VirksomhetSummary virksomhet={virksomhet} />
                        </div>
                    </Box>
                </>
            )}
        </SummaryBlock>
    );
}

export default ArbeidssituasjonSNSummary;
