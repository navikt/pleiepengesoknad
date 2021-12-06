import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SøknadApiData } from '../../../types/SøknadApiData';
import Sitat from '../enkeltsvar/Sitat';
import HistoriskOmsorgstilbudSummary from './HistoriskOmsorgstilbudSummary';
import PlanlagtOmsorgstilbudSummary from './PlanlagtOmsorgstilbudSummary';
import { getSøkerKunHistoriskPeriode } from '../../../utils/fortidFremtidUtils';

interface Props {
    søknadsperiode: DateRange;
    søknadsdato: Date;
    apiValues: SøknadApiData;
}

const OmsorgstilbudSummary: React.FunctionComponent<Props> = ({
    apiValues: { nattevåk, beredskap, omsorgstilbud: omsorgstilbud },
    søknadsperiode,
    søknadsdato,
}) => {
    const intl = useIntl();
    const søkerKunHistoriskPeriode = getSøkerKunHistoriskPeriode(søknadsperiode, søknadsdato);
    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.header')}>
            <HistoriskOmsorgstilbudSummary
                historiskOmsorgstilbud={omsorgstilbud?.historisk}
                søknadsperiode={søknadsperiode}
                søknadsdato={søknadsdato}
            />
            <PlanlagtOmsorgstilbudSummary
                omsorgstilbud={omsorgstilbud?.planlagt}
                søknadsperiode={søknadsperiode}
                søknadsdato={søknadsdato}
            />

            {nattevåk && (
                <Box margin="xl">
                    <ContentWithHeader
                        header={intlHelper(
                            intl,
                            søkerKunHistoriskPeriode
                                ? 'steg.nattevåkOgBeredskap.nattevåk.historisk.spm'
                                : 'steg.nattevåkOgBeredskap.nattevåk.spm'
                        )}>
                        {nattevåk.harNattevåk === true && intlHelper(intl, 'Ja')}
                        {nattevåk.harNattevåk === false && intlHelper(intl, 'Nei')}
                        {nattevåk.harNattevåk === true && nattevåk.tilleggsinformasjon && (
                            <Sitat>
                                <TextareaSummary text={nattevåk.tilleggsinformasjon} />
                            </Sitat>
                        )}
                    </ContentWithHeader>
                </Box>
            )}
            {beredskap && (
                <Box margin="xl">
                    <ContentWithHeader
                        header={intlHelper(
                            intl,
                            søkerKunHistoriskPeriode
                                ? 'steg.nattevåkOgBeredskap.beredskap.historisk.spm'
                                : 'steg.nattevåkOgBeredskap.beredskap.spm'
                        )}>
                        {beredskap.beredskap === true && intlHelper(intl, 'Ja')}
                        {beredskap.beredskap === false && intlHelper(intl, 'Nei')}
                        {beredskap.tilleggsinformasjon && (
                            <Sitat>
                                <TextareaSummary text={beredskap.tilleggsinformasjon} />
                            </Sitat>
                        )}
                    </ContentWithHeader>
                </Box>
            )}
        </SummarySection>
    );
};

export default OmsorgstilbudSummary;
