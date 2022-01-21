import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import TidEnkeltdager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidEnkeltdager';
import TidFasteDager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidFasteDager';
import { PlanlagtOmsorgstilbudApiData } from '../../../types/SøknadApiData';
import { getPlanlagtPeriode } from '../../../utils/fortidFremtidUtils';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';

interface Props {
    omsorgstilbud?: PlanlagtOmsorgstilbudApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const PlanlagtOmsorgstilbudSummary = ({ omsorgstilbud, søknadsperiode, søknadsdato }: Props) => {
    const intl = useIntl();

    const planlagtPeriode = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    if (!planlagtPeriode) {
        return null;
    }

    return (
        <SummarySection
            header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.planlagt.header', {
                fra: prettifyDateExtended(planlagtPeriode.from),
                til: prettifyDateExtended(planlagtPeriode.to),
            })}>
            {omsorgstilbud === undefined && (
                <SummaryBlock
                    header={intlHelper(intl, 'steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.spm', {
                        fra: prettifyDateExtended(planlagtPeriode.from),
                        til: prettifyDateExtended(planlagtPeriode.to),
                    })}>
                    <FormattedMessage id={`omsorgstilbud.svar.nei`} />
                </SummaryBlock>
            )}
            {omsorgstilbud !== undefined && omsorgstilbud.ukedager && (
                <SummaryBlock
                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.planlagt.fast.header')}
                    headerTag="h3">
                    <TidFasteDager fasteDager={omsorgstilbud.ukedager} />
                </SummaryBlock>
            )}
            {omsorgstilbud !== undefined && omsorgstilbud.enkeltdager && (
                <SummaryBlock
                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.planlagt.enkeltdager.header')}
                    headerTag="h3">
                    <TidEnkeltdager dager={omsorgstilbud.enkeltdager} />
                </SummaryBlock>
            )}
        </SummarySection>
    );
};
export default PlanlagtOmsorgstilbudSummary;
