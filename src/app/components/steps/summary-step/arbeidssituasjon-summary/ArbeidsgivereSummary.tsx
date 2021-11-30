import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    ArbeidsgiverApiData,
    ArbeidsgiverISøknadsperiodeApiData,
    ArbeidsgiverUtenforSøknadsperiodeApiData,
    isArbeidsgiverISøknadsperiodeApiData,
} from '../../../../types/SøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getTidSetning } from './arbeidssituasjon-summary-utils';

interface Props {
    arbeidsgivere?: ArbeidsgiverApiData[];
    søknadsperiode: DateRange;
}

const ArbeidsgivereSummary: React.FunctionComponent<Props> = ({ arbeidsgivere: arbeidsgivere, søknadsperiode }) => {
    const intl = useIntl();

    const arbeidsgivereISøknadsperiode: ArbeidsgiverISøknadsperiodeApiData[] = [];
    const arbeidsgivereUtenforSøknadsperiode: ArbeidsgiverUtenforSøknadsperiodeApiData[] = [];
    arbeidsgivere?.forEach((a) => {
        if (isArbeidsgiverISøknadsperiodeApiData(a)) {
            arbeidsgivereISøknadsperiode.push(a);
        } else {
            arbeidsgivereUtenforSøknadsperiode.push(a);
        }
    });

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
                            {isArbeidsgiverISøknadsperiodeApiData(arbeidsgiver) && (
                                <li>{getTidSetning(intl, arbeidsgiver.arbeidsforhold, erAnsatt)}</li>
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
