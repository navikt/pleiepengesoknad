import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SøknadApiData } from '../../../types/SøknadApiData';
import ArbeidsgivereSummary from './ArbeidsgivereSummary';
import FrilansSummary from './FrilansSummary';
import SelvstendigSummary from './SelvstendigSummary';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende, harVærtEllerErVernepliktig },
    søknadsperiode,
}) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
            <ArbeidsgivereSummary arbeidsgivere={arbeidsgivere} søknadsperiode={søknadsperiode} />

            <FrilansSummary frilans={frilans} />

            <SelvstendigSummary selvstendigNæringsdrivende={selvstendigNæringsdrivende} />

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
