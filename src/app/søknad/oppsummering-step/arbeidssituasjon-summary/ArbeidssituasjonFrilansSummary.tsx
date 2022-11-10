import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
// import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Arbeidsgiver } from '../../../types';
import { FrilansApiData } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';
import { dateFormatter, ISODateToDate } from '@navikt/sif-common-utils/lib';

interface Props {
    frilans: FrilansApiData;
    frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonFrilansSummary = ({ frilans, frilansoppdrag }: Props) => {
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
                        values={{ dato: dateFormatter.full(ISODateToDate(frilans.startdato)) }}
                    />
                </li>
                {frilans.sluttdato && (
                    <li>
                        <FormattedMessage
                            id="oppsummering.arbeidssituasjon.frilans.sluttet"
                            values={{ dato: dateFormatter.full(ISODateToDate(frilans.sluttdato)) }}
                        />
                    </li>
                )}
                {frilans.jobberFortsattSomFrilans && (
                    <li>
                        <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.fortsattFrilanser" />
                    </li>
                )}
                {/* {frilans.arbeidsforhold?.normalarbeidstid.erLiktHverUke === false && ( */}
                <li>
                    <NormalarbeidstidSummary
                        erAnsatt={frilans.jobberFortsattSomFrilans}
                        normalarbeidstidApiData={frilans.arbeidsforhold.normalarbeidstid}
                    />
                </li>
                {/* Dersom bruker fortsatt er frilanser i perioden (arbeidsforhold finnes), og har frilansoppdrag */}
                {frilans.arbeidsforhold && frilansoppdrag && frilansoppdrag.length > 0 && (
                    <li>
                        <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.frilansoppdrag" />
                        <br />
                        <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
                            {frilansoppdrag.map((oppdrag) => (
                                <li key={oppdrag.id}>{oppdrag.navn}</li>
                            ))}
                        </ul>
                    </li>
                )}
            </ul>
        </SummaryBlock>
    );
};

export default ArbeidssituasjonFrilansSummary;
