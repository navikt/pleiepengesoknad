import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
// import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilanserApiData } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';
// import NormalarbeidstidSummary from './NormalarbeidstidSummary';

interface Props {
    frilansere?: FrilanserApiData[];
}

const ArbeidssituasjonFrilansSummary = ({ frilansere = [] }: Props) => {
    const intl = useIntl();
    console.log(frilansere);
    if (frilansere.length === 0) {
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
        <div data-testid="arbeidssituasjon-frilansere">
            {frilansere.map((frilans, index) => {
                const { navn, organisasjonsnummer, harOppdragIPerioden, oppdragType, manuellOppføring } = frilans;
                {
                    console.log('Frilans: ', frilans);
                }
                return (
                    <SummaryBlock
                        key={index}
                        header={intlHelper(intl, 'arbeidsgiver.tittel', { navn, organisasjonsnummer })}
                        headerTag="h3"
                        indentChildren={false}>
                        <ul>
                            {manuellOppføring === false && (
                                <li>
                                    <FormattedMessage
                                        id={`oppsummering.arbeidssituasjon.frilans.harOppdragIPerioden.${harOppdragIPerioden}`}
                                    />
                                </li>
                            )}
                            {oppdragType && (
                                <li>
                                    <FormattedMessage
                                        id={`oppsummering.arbeidssituasjon.frilans.oppdragType.${oppdragType}`}
                                    />
                                </li>
                            )}

                            {frilans.arbeidsforhold && (
                                <li>
                                    <NormalarbeidstidSummary
                                        erAnsatt={true} //TODO
                                        normalarbeidstidApiData={frilans.arbeidsforhold.normalarbeidstid}
                                    />
                                </li>
                            )}
                        </ul>
                    </SummaryBlock>
                );
            })}
        </div>
    );
};
export default ArbeidssituasjonFrilansSummary;
