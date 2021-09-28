import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import VirksomhetSummary from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetSummary';
import { SelvstendigNæringsdrivendeApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getArbeidsformOgTidSetning } from './arbeidssituasjon-summary-utils';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
}

function SelvstendigSummary({ selvstendigNæringsdrivende }: Props) {
    const intl = useIntl();
    const { arbeidsforhold, virksomhet } = selvstendigNæringsdrivende || {};
    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.selvstendig.header')} headerTag="h3">
            {selvstendigNæringsdrivende === undefined && (
                <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.erIkkeSN" tagName="p" />
            )}
            {virksomhet && arbeidsforhold && (
                <ul>
                    <li>
                        {virksomhet.harFlereAktiveVirksomheter ? (
                            <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.erSn.flereVirksomheter" />
                        ) : (
                            <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.erSn.enVirksomhet" />
                        )}
                    </li>
                    <li>{getArbeidsformOgTidSetning(intl, arbeidsforhold, true)}</li>
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
