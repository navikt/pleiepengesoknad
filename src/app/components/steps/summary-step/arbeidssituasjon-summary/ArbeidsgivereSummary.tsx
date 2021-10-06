import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsgiverApiData } from '../../../../types/PleiepengesøknadApiData';
import { ArbeidsforholdSluttetNårSvar } from '../../../../types/PleiepengesøknadFormData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import { getArbeidsformOgTidSetning } from './arbeidssituasjon-summary-utils';

interface Props {
    arbeidsgivere?: ArbeidsgiverApiData[];
    søknadsperiode: DateRange;
}

const ArbeidsgivereSummary: React.FunctionComponent<Props> = ({ arbeidsgivere, søknadsperiode }) => {
    const intl = useIntl();
    if (arbeidsgivere === undefined || arbeidsgivere.length === 0) {
        return null;
    }
    return (
        <>
            {arbeidsgivere.map(({ navn, organisasjonsnummer, erAnsatt, arbeidsforhold, sluttetNår }) => {
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
                            {erAnsatt === false && (
                                <li>
                                    <FormattedMessage
                                        id={
                                            sluttetNår === ArbeidsforholdSluttetNårSvar.førSøknadsperiode
                                                ? 'oppsummering.arbeidssituasjon.avsluttet.sluttetNår.førPerioden'
                                                : 'oppsummering.arbeidssituasjon.avsluttet.sluttetNår.iPerioden'
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
