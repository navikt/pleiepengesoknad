import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import FrilansoppdragListe from '../../../components/frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../types';
import { FrilansApiData } from '../../../types/SøknadApiData';
import { prettifyApiDate } from '../enkeltsvar/DatoSvar';

interface Props {
    frilans?: FrilansApiData;
    frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonFrilansSummary = ({ frilans, frilansoppdrag }: Props) => {
    const intl = useIntl();
    if (frilans === undefined) {
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
                {frilans.arbeidsforhold && (
                    <>
                        <li>
                            <FormattedMessage
                                id={`oppsummering.arbeidssituasjon.tid`}
                                values={{ timer: frilans.arbeidsforhold.jobberNormaltTimer }}
                            />
                        </li>
                        <li>
                            <FormattedMessage
                                id={
                                    frilans.arbeidsforhold.harFraværIPeriode
                                        ? `oppsummering.arbeidssituasjon.harFravær`
                                        : 'oppsummering.arbeidssituasjon.harIkkeFravær'
                                }
                            />
                        </li>
                    </>
                )}
                {/* Dersom bruker fortsatt er frilanser i perioden (arbeidsforhold finnes), og har frilansoppdrag */}
                {frilans.arbeidsforhold && frilansoppdrag && frilansoppdrag.length > 0 && (
                    <li>
                        <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.frilansoppdrag" />
                        <br />
                        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} kompakt={true} />
                    </li>
                )}
            </ul>
        </SummaryBlock>
    );
};

export default ArbeidssituasjonFrilansSummary;
