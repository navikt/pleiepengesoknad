import React from 'react';
import { useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SøknadApiData } from '../../../types/søknad-api-data/SøknadApiData';
import ArbeidsgivereSummary from './ArbeidsgivereSummary';
// import ArbeidssituasjonFrilansSummary from './ArbeidssituasjonFrilansSummary';
import ArbeidssituasjonSelvstendigSummary from './ArbeidssituasjonSelvstendigSummary';
import OpptjeningIUtlandetSummary from './OpptjeningIUtlandetSummary';
import UtenlandskNæringSummary from './ArbeidssituasjonUtenlandskNæringSummary';
import ArbeidssituasjonFrilansSummary from './ArbeidssituasjonFrilansSummary';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
    // frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: {
        arbeidsgivere,
        frilanserOppdrag,
        selvstendigNæringsdrivende,
        harVærtEllerErVernepliktig,
        opptjeningIUtlandet,
        utenlandskNæring,
    },
    søknadsperiode,
    // frilansoppdrag,
}) => {
    const intl = useIntl();
    console.log('frilanserOppdrag: ', frilanserOppdrag);
    return (
        <div data-testid="oppsummering-arbeidssituasjon">
            <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
                <ArbeidsgivereSummary arbeidsgivere={arbeidsgivere} søknadsperiode={søknadsperiode} />

                <ArbeidssituasjonFrilansSummary frilansere={frilanserOppdrag.oppdrag} />

                <ArbeidssituasjonSelvstendigSummary selvstendig={selvstendigNæringsdrivende} />

                <OpptjeningIUtlandetSummary opptjeningUtland={opptjeningIUtlandet} />

                <UtenlandskNæringSummary utenlandskNæring={utenlandskNæring} />

                {/* Vernepliktig */}
                {harVærtEllerErVernepliktig !== undefined && (
                    <SummaryBlock header={intlHelper(intl, 'verneplikt.summary.header')} headerTag="h3">
                        <ul>
                            <li>
                                {intlHelper(
                                    intl,
                                    harVærtEllerErVernepliktig
                                        ? 'verneplikt.summary.harVærtVernepliktig'
                                        : 'verneplikt.summary.harIkkeVærtVernepliktig'
                                )}
                            </li>
                        </ul>
                    </SummaryBlock>
                )}
            </SummarySection>
        </div>
    );
};

export default ArbeidssituasjonSummary;
