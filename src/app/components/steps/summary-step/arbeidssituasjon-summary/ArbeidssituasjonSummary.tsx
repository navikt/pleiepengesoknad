import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { useIntl } from 'react-intl';
import { PleiepengesøknadApiData } from '../../../../types/PleiepengesøknadApiData';
import SummarySection from '../../../summary-section/SummarySection';
import SelvstendigSummary from './SelvstendigSummary';
import FrilansSummary from './FrilansSummary';
import ArbeidsgivereSummary from './ArbeidsgivereSummary';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende, harVærtEllerErVernepliktig },
}) => {
    const intl = useIntl();
    const harRegistrerArbeid =
        (arbeidsgivere && arbeidsgivere.length > 0) ||
        frilans !== undefined ||
        selvstendigNæringsdrivende !== undefined;
    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
            {harRegistrerArbeid && (
                <>
                    <ArbeidsgivereSummary arbeidsgivere={arbeidsgivere} />

                    <FrilansSummary frilans={frilans} />

                    <SelvstendigSummary selvstendigNæringsdrivende={selvstendigNæringsdrivende} />

                    {/* Vernepliktig */}
                    {harVærtEllerErVernepliktig !== undefined && (
                        <SummaryBlock header={intlHelper(intl, 'verneplikt.summary.header')} indentChildren={true}>
                            <SummaryBlock
                                header={intlHelper(intl, 'verneplikt.summary.harVærtEllerErVernepliktig.header')}>
                                <JaNeiSvar harSvartJa={harVærtEllerErVernepliktig} />
                            </SummaryBlock>
                        </SummaryBlock>
                    )}
                </>
            )}
            {harRegistrerArbeid === false && <>Arbeid ikke registrert</>}
        </SummarySection>
    );
};

export default ArbeidssituasjonSummary;
