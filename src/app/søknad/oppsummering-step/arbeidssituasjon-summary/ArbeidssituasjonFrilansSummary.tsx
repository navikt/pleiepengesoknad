import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
// import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilanserApiData, FrilanserOppdragIPeriodenApi } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';
import { apiStringDateToDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    frilansere?: FrilanserApiData[];
}

const ArbeidssituasjonFrilansSummary = ({ frilansere = [] }: Props) => {
    const intl = useIntl();

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
                const { navn, harOppdragIPerioden, oppdragType, manuellOppføring, ansattFom, ansattTom } = frilans;
                const avsluttet =
                    (manuellOppføring === true && ansattTom !== undefined) ||
                    harOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN;

                return (
                    <SummaryBlock
                        key={index}
                        header={intlHelper(intl, 'frilans.tittel', { navn })}
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
                            {manuellOppføring === true && ansattFom && (
                                <li>
                                    <FormattedMessage
                                        id={`oppsummering.arbeidssituasjon.frilans.startet`}
                                        values={{
                                            ansattFom: prettifyDateFull(apiStringDateToDate(ansattFom)),
                                        }}
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
                            {avsluttet && ansattTom && (
                                <li>
                                    <FormattedMessage
                                        id={'oppsummering.arbeidssituasjon.frilans.avsluttetIPerioden'}
                                        values={{
                                            ansattTom: prettifyDateFull(apiStringDateToDate(ansattTom)),
                                        }}
                                    />
                                </li>
                            )}
                            {frilans.arbeidsforhold && (
                                <li>
                                    <NormalarbeidstidSummary
                                        erAnsatt={!avsluttet}
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
