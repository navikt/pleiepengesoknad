import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilansApiData } from '../../../../types/PleiepengesøknadApiData';
import { prettifyApiDate } from '../enkeltsvar/DatoSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getArbeidsformOgTidSetning } from './arbeidssituasjon-summary-utils';

interface Props {
    frilans?: FrilansApiData;
}

const FrilansSummary = ({ frilans }: Props) => {
    const intl = useIntl();
    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
            {frilans === undefined && (
                <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.erIkkeFrilanser" tagName="p" />
            )}
            {frilans !== undefined && (
                <ul>
                    <li>
                        <FormattedMessage
                            id="oppsummering.arbeidssituasjon.frilans.startet"
                            values={{ dato: prettifyApiDate(frilans.startdato) }}
                        />
                    </li>
                    <li>
                        {frilans.jobberFortsattSomFrilans ? (
                            <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.fortsattFrilanser" />
                        ) : (
                            <FormattedMessage
                                id="oppsummering.arbeidssituasjon.frilans.sluttet"
                                values={{ dato: prettifyApiDate(frilans.startdato) }}
                            />
                        )}
                    </li>
                    <li>
                        {getArbeidsformOgTidSetning(intl, frilans.arbeidsforhold, frilans.jobberFortsattSomFrilans)}
                    </li>
                </ul>
            )}
        </SummaryBlock>
    );
};

export default FrilansSummary;
