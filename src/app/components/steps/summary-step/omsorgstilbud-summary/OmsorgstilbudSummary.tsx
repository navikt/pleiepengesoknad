import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { PleiepengesøknadApiData } from '../../../../types/PleiepengesøknadApiData';
import { Feature, isFeatureEnabled } from '../../../../utils/featureToggleUtils';
import SummarySection from '../../../summary-section/SummarySection';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import HistoriskOmsorgstilbudSummary from './HistoriskOmsorgstilbudSummary';
import PlanlagtOmsorgstilbudSummary from './PlanlagtOmsorgstilbudSummary';
import Sitat from '../enkeltsvar/Sitat';

interface Props {
    søknadsperiode: DateRange;
    apiValues: PleiepengesøknadApiData;
}

const OmsorgstilbudSummary: React.FunctionComponent<Props> = ({
    apiValues: {
        nattevåk,
        beredskap,
        omsorgstilbudV2,
        skalBekrefteOmsorg,
        skalPassePåBarnetIHelePerioden,
        beskrivelseOmsorgsrollen,
    },
    søknadsperiode,
}) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.header')}>
            <HistoriskOmsorgstilbudSummary
                historiskOmsorgstilbud={omsorgstilbudV2?.historisk}
                søknadsperiode={søknadsperiode}
            />
            <PlanlagtOmsorgstilbudSummary omsorgstilbud={omsorgstilbudV2?.planlagt} søknadsperiode={søknadsperiode} />

            {nattevåk && (
                <Box margin="xl">
                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.nattevåk.header')}>
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
                    <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.beredskap.header')}>
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

            {isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG) && skalBekrefteOmsorg && (
                <Box margin="xl">
                    <ContentWithHeader
                        header={intlHelper(intl, 'steg.oppsummering.skalPassePåBarnetIHelePerioden.header')}>
                        <JaNeiSvar harSvartJa={skalPassePåBarnetIHelePerioden} />
                    </ContentWithHeader>
                    {hasValue(beskrivelseOmsorgsrollen) && (
                        <Box margin="l">
                            <ContentWithHeader
                                header={intlHelper(intl, 'steg.oppsummering.bekreftOmsorgEkstrainfo.header')}>
                                <Sitat>
                                    <TextareaSummary text={beskrivelseOmsorgsrollen} />
                                </Sitat>
                            </ContentWithHeader>
                        </Box>
                    )}
                </Box>
            )}
        </SummarySection>
    );
};

export default OmsorgstilbudSummary;
