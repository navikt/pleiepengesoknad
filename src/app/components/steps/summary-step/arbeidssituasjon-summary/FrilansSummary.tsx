import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilansApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { prettifyApiDate } from '../enkeltsvar/DatoSvar';
import { getArbeidsformOgTidSetning } from './arbeidssituasjon-summary-utils';

interface Props {
    frilans?: FrilansApiData;
}

const FrilansSummary = ({ frilans }: Props) => {
    const intl = useIntl();
    if (frilans === undefined) {
        return (
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
                <ul>
                    <li>
                        <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.erIkkeFrilanser" tagName="p" />
                    </li>
                </ul>
            </SummaryBlock>
        );
    }

    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
            {frilans === undefined && (
                <ul>
                    <li>
                        <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.erIkkeFrilanser" tagName="p" />
                    </li>
                </ul>
            )}
            {frilans !== undefined && (
                <ul>
                    <li>
                        <FormattedMessage
                            id="oppsummering.arbeidssituasjon.frilans.startet"
                            values={{ dato: prettifyApiDate(frilans.startdato) }}
                        />
                    </li>
                    {frilans.jobberFortsattSomFrilans && (
                        <li>
                            <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.fortsattFrilanser" />
                        </li>
                    )}

                    {frilans.sluttdato && (
                        <li>
                            <FormattedMessage
                                id="oppsummering.arbeidssituasjon.frilans.sluttet"
                                values={{ dato: prettifyApiDate(frilans.sluttdato) }}
                            />
                        </li>
                    )}
                    <li>
                        {getArbeidsformOgTidSetning(intl, frilans.arbeidsforhold, frilans.jobberFortsattSomFrilans)}
                    </li>
                </ul>
            )}
        </SummaryBlock>
    );
};

export default FrilansSummary;
