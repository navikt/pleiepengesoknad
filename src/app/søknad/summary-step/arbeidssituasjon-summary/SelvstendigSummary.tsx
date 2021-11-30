import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import { SelvstendigNæringsdrivendeApiData } from '../../../types/SøknadApiData';
import SummaryBlock from '../../../components/summary-block/SummaryBlock';
import { getTidSetning } from './arbeidssituasjon-summary-utils';
import { Element } from 'nav-frontend-typografi';

interface Props {
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    søkerKunHistoriskPeriode: boolean;
}

function SelvstendigSummary({ selvstendigNæringsdrivende, søkerKunHistoriskPeriode }: Props) {
    const intl = useIntl();
    const { arbeidsforhold, virksomhet } = selvstendigNæringsdrivende || {};
    const Tid = arbeidsforhold ? getTidSetning(intl, arbeidsforhold, true) : undefined;
    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.selvstendig.header')} headerTag="h3">
            {selvstendigNæringsdrivende === undefined && (
                <ul>
                    <li>
                        <FormattedMessage
                            id={
                                søkerKunHistoriskPeriode
                                    ? 'oppsummering.arbeidssituasjon.selvstendig.historisk.erIkkeSN'
                                    : 'oppsummering.arbeidssituasjon.selvstendig.erIkkeSN'
                            }
                            tagName="p"
                        />
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
                        {Tid && <li>{Tid}</li>}
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

export default SelvstendigSummary;
