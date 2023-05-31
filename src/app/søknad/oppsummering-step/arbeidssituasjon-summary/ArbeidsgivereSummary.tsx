import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import SummaryBlock from '@navikt/sif-common-soknad-ds/lib/components/summary-block/SummaryBlock';
import { dateFormatter, DateRange } from '@navikt/sif-common-utils';
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
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.arbeidsgivere.ingenIPeriode.header')}>
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
        <div data-testid="arbeidssituasjon-arbeidsgivere">
            {arbeidsgivere.map((arbeidsgiver) => {
                const { navn, organisasjonsnummer, erAnsatt } = arbeidsgiver;

                return (
                    <div data-testid={`arbeidssituasjon-ansatt-${organisasjonsnummer}`} key={organisasjonsnummer}>
                        <SummaryBlock
                            key={organisasjonsnummer}
                            header={intlHelper(intl, 'arbeidsgiver.tittel', { navn, organisasjonsnummer })}>
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
                                    <li>
                                        <NormalarbeidstidSummary
                                            erAnsatt={erAnsatt}
                                            normalarbeidstidApiData={arbeidsgiver.arbeidsforhold.normalarbeidstid}
                                        />
                                    </li>
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
                                                periodeFra: dateFormatter.full(søknadsperiode.from),
                                                periodeTil: dateFormatter.full(søknadsperiode.to),
                                            }}
                                        />
                                    </li>
                                )}
                            </ul>
                        </SummaryBlock>
                    </div>
                );
            })}
        </div>
    );
};

export default ArbeidsgivereSummary;
