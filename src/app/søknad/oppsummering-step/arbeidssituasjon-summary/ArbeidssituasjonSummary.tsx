import React from 'react';
import { useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SøknadApiData } from '../../../types/søknad-api-data/SøknadApiData';
import ArbeidsgivereSummary from './ArbeidsgivereSummary';
import ArbeidssituasjonFrilansSummary from './ArbeidssituasjonFrilansSummary';
import ArbeidssituasjonSelvstendigSummary from './ArbeidssituasjonSelvstendigSummary';
import { Arbeidsgiver } from '../../../types';
import OpptjeningIUtlandetSummary from './OpptjeningIUtlandetSummary';
import UtenlandskNæringSummary from './ArbeidssituasjonUtenlandskNæringSummary';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
    frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: {
        arbeidsgivere,
        frilans,
        selvstendigNæringsdrivende,
        harVærtEllerErVernepliktig,
        opptjeningIUtlandet,
        utenlandskNæring,
    },
    søknadsperiode,
    frilansoppdrag,
}) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
            <ArbeidsgivereSummary arbeidsgivere={arbeidsgivere} søknadsperiode={søknadsperiode} />

            <ArbeidssituasjonFrilansSummary frilans={frilans} frilansoppdrag={frilansoppdrag} />

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
    );
};

export default ArbeidssituasjonSummary;
