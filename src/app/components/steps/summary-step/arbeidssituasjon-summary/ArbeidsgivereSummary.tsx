import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsgiverApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getArbeidsformOgTidSetning } from './arbeidssituasjon-summary-utils';

interface Props {
    arbeidsgivere?: ArbeidsgiverApiData[];
}

const ArbeidsgivereSummary: React.FunctionComponent<Props> = ({ arbeidsgivere }) => {
    const intl = useIntl();
    if (arbeidsgivere === undefined || arbeidsgivere.length === 0) {
        return null;
    }
    return (
        <>
            {arbeidsgivere.map(({ navn, organisasjonsnummer, erAnsatt, arbeidsforhold }) => {
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
                            <li>{getArbeidsformOgTidSetning(intl, arbeidsforhold, erAnsatt)}</li>
                        </ul>
                    </SummaryBlock>
                );
            })}
        </>
    );
};

export default ArbeidsgivereSummary;
