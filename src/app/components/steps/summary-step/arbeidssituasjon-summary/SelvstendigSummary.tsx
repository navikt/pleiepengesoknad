import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import { SelvstendigNæringsdrivendeApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getArbeidsformOgTidSetning } from './arbeidssituasjon-summary-utils';

interface Props {
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    søkerKunHistoriskPeriode: boolean;
}

function SelvstendigSummary({ selvstendigNæringsdrivende, søkerKunHistoriskPeriode }: Props) {
    const intl = useIntl();
    const { arbeidsforhold, virksomhet } = selvstendigNæringsdrivende || {};
    const arbeidsformOgTid = arbeidsforhold ? getArbeidsformOgTidSetning(intl, arbeidsforhold, true) : undefined;
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
                    {arbeidsformOgTid && <li>{arbeidsformOgTid}</li>}
                    <li>
                        {intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}
                        <Box margin="m">
                            <VirksomhetSummary virksomhet={virksomhet} />
                        </Box>
                    </li>
                </ul>
            )}
        </SummaryBlock>
    );
}

export default SelvstendigSummary;
