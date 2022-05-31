import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsgiverApiData } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';

interface Props {
    arbeidsgivere?: ArbeidsgiverApiData[];
    søknadsperiode: DateRange;
}

const ArbeidsgivereSummary: React.FunctionComponent<Props> = ({ arbeidsgivere, søknadsperiode }) => {
    const intl = useIntl();

    if (arbeidsgivere === undefined || arbeidsgivere.length === 0) {
        return (
            <SummaryBlock
                header={intlHelper(intl, 'oppsummering.arbeidssituasjon.arbeidsgivere.ingenIPeriode.header')}
                headerTag="h3">
                <ul>
                    <li>
                        <FormattedMessage
                            id="oppsummering.arbeidssituasjon.arbeidsgivere.ingenIPeriode.tekst"
                            tagName="p"
                        />
                    </li>
                </ul>
            </SummaryBlock>
        );
    }

    return (
        <>
            {arbeidsgivere.map((arbeidsgiver) => {
                const { navn, organisasjonsnummer, erAnsatt } = arbeidsgiver;
                const normalarbeidstid = arbeidsgiver.arbeidsforhold?.normalarbeidstid;
                return (
                    <SummaryBlock
                        key={organisasjonsnummer}
                        header={intlHelper(intl, 'arbeidsgiver.tittel', { navn, organisasjonsnummer })}
                        headerTag="h3"
                        indentChildren={false}>
                        <ul>
                            <li>
                                <FormattedMessage
                                    id={
                                        erAnsatt
                                            ? `oppsummering.arbeidssituasjon.arbeidsgiver.ansatt`
                                            : 'oppsummering.arbeidssituasjon.avsluttet.arbeidsgiver.ansatt'
                                    }
                                />
                            </li>
                            {arbeidsgiver.arbeidsforhold && (
                                <>
                                    <li>
                                        <NormalarbeidstidSummary
                                            erAnsatt={erAnsatt}
                                            normalarbeidstidApiData={arbeidsgiver.arbeidsforhold.normalarbeidstid}
                                        />
                                    </li>
                                    {normalarbeidstid && normalarbeidstid.erLiktHverUke === false && (
                                        <>
                                            <li>
                                                {normalarbeidstid._arbeiderHelg ? (
                                                    <FormattedMessage id="oppsummering.arbeidssituasjon.arbeiderFastHelg" />
                                                ) : (
                                                    <FormattedMessage id="oppsummering.arbeidssituasjon.arbeiderIkkeFastHelg" />
                                                )}
                                            </li>
                                            {normalarbeidstid._arbeiderHelg === false && (
                                                <li>
                                                    {normalarbeidstid._arbeiderDeltid ? (
                                                        <FormattedMessage id="oppsummering.arbeidssituasjon.arbeiderFastDeltid" />
                                                    ) : (
                                                        <FormattedMessage id="oppsummering.arbeidssituasjon.arbeiderIkkeFastDeltid" />
                                                    )}
                                                </li>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                            {erAnsatt === false && (
                                <li>
                                    <FormattedMessage
                                        id={
                                            arbeidsgiver.sluttetFørSøknadsperiode
                                                ? 'oppsummering.arbeidssituasjon.avsluttet.sluttetFørSøknadsperiode'
                                                : 'oppsummering.arbeidssituasjon.avsluttet.sluttetISøknadsperiode'
                                        }
                                        values={{
                                            periodeFra: prettifyDateFull(søknadsperiode.from),
                                            periodeTil: prettifyDateFull(søknadsperiode.to),
                                        }}
                                    />
                                </li>
                            )}
                        </ul>
                    </SummaryBlock>
                );
            })}
        </>
    );
};

export default ArbeidsgivereSummary;
