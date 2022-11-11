/* import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilansApiData } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';

interface Props {
    frilans: FrilansApiData;
}

const ArbeidssituasjonFrilansSummary = ({ frilans }: Props) => {
    const intl = useIntl();
    if (frilans.harInntektSomFrilanser === false) {
        return (
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
                <ul data-testid="arbeidssituasjon-frilanser">
                    <li>
                        <FormattedMessage id={'oppsummering.arbeidssituasjon.frilans.erIkkeFrilanser'} tagName="p" />
                    </li>
                </ul>
            </SummaryBlock>
        );
    }

    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
            <ul data-testid="arbeidssituasjon-frilanser">
                <li>
                    <FormattedMessage
                        id="oppsummering.arbeidssituasjon.frilans.startet"
                        values={{ dato: prettifyApiDate(frilans.startdato) }}
                    />
                </li>
                {frilans.sluttdato && (
                    <li>
                        <FormattedMessage
                            id="oppsummering.arbeidssituasjon.frilans.sluttet"
                            values={{ dato: prettifyApiDate(frilans.sluttdato) }}
                        />
                    </li>
                )}
                {frilans.jobberFortsattSomFrilans && (
                    <li>
                        <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.fortsattFrilanser" />
                    </li>
                )}
                 {frilans.arbeidsforhold?.normalarbeidstid.erLiktHverUke === false && ( 
                <li>
                    <NormalarbeidstidSummary
                        erAnsatt={frilans.jobberFortsattSomFrilans}
                        normalarbeidstidApiData={frilans.arbeidsforhold.normalarbeidstid}
                    />
                </li>
            </ul>
        </SummaryBlock>
    );
};

export default ArbeidssituasjonFrilansSummary;
*/
