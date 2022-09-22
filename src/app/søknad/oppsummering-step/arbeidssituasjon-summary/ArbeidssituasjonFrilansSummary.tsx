import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Arbeidsgiver } from '../../../types';
import { FrilansApiData } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';

interface Props {
    frilans: FrilansApiData;
    frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonFrilansSummary = ({ frilans, frilansoppdrag }: Props) => {
    const intl = useIntl();
    if (frilans.harInntektSomFrilanser === false) {
        return (
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
                <ul>
                    <li>
                        <FormattedMessage id={'oppsummering.arbeidssituasjon.frilans.erIkkeFrilanser'} tagName="p" />
                    </li>
                </ul>
            </SummaryBlock>
        );
    }
    if (
        frilans.harInntektSomFrilanser === true &&
        frilans.mottarFosterhjemsgodtgjørelse &&
        frilans.harAndreOppdragEnnFosterhjemsgodtgjørelse === false
    ) {
        return (
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
                <ul>
                    <li>Startet å motta fosterhjemsgodtgjørsel {prettifyApiDate(frilans.startdato)}</li>
                    {frilans.sluttdato && (
                        <li>Sluttet å motta fosterhjemsgodtgjørsel {prettifyApiDate(frilans.sluttdato)}</li>
                    )}
                    {frilansoppdrag.length === 1 ? (
                        <>
                            <li>Mottar fosterhjemsgodtgjørsel fra {frilansoppdrag[0].navn}</li>
                            <li>Har ingen andre frilansoppdrag i perioden</li>
                        </>
                    ) : (
                        <li>Mottar kun fosterhjemsgodtgjørsel</li>
                    )}
                </ul>
            </SummaryBlock>
        );
    }

    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
            <ul>
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
                <li>
                    {frilans.mottarFosterhjemsgodtgjørelse ? (
                        <>Mottar fosterhjemsgodtgjørsel.</>
                    ) : (
                        <>Mottar ikke fosterhjemsgodtgjørsel.</>
                    )}
                </li>
                {frilans.mottarFosterhjemsgodtgjørelse && frilans.harAndreOppdragEnnFosterhjemsgodtgjørelse && (
                    <li>Har andre frilansoppdrag i tillegg til fosterhjemsgodtgjørsel</li>
                )}
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
