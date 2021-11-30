import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SøknadApiData } from '../../../types/SøknadApiData';
import SummaryBlock from '../../../components/summary-block/SummaryBlock';
import SummarySection from '../../../components/summary-section/SummarySection';
import ArbeidsgivereSummary from './ArbeidsgivereSummary';
import FrilansSummary from './FrilansSummary';
import SelvstendigSummary from './SelvstendigSummary';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
    søkerKunHistoriskPeriode: boolean;
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende, harVærtEllerErVernepliktig },
    søknadsperiode,
    søkerKunHistoriskPeriode,
}) => {
    const intl = useIntl();

    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
            <ArbeidsgivereSummary arbeidsgivere={arbeidsgivere} søknadsperiode={søknadsperiode} />

            <FrilansSummary frilans={frilans} søkerKunHistoriskPeriode={søkerKunHistoriskPeriode} />

            <SelvstendigSummary
                selvstendigNæringsdrivende={selvstendigNæringsdrivende}
                søkerKunHistoriskPeriode={søkerKunHistoriskPeriode}
            />

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
