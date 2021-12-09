import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import TidEnkeltdager from '../../../components/dager-med-tid/TidEnkeltdager';
import TidFasteDager from '../../../components/dager-med-tid/TidFasteDager';
import { PlanlagtOmsorgstilbudApiData } from '../../../types/SøknadApiData';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import { getPlanlagtPeriode } from '../../../utils/fortidFremtidUtils';

interface Props {
    omsorgstilbud?: PlanlagtOmsorgstilbudApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const PlanlagtOmsorgstilbudSummary = ({ omsorgstilbud, søknadsperiode, søknadsdato }: Props) => {
    const intl = useIntl();

    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    if (!periodeFraOgMedSøknadsdato) {
        return null;
    }

    const svar = omsorgstilbud ? 'ja' : 'nei';

    return (
        <>
            <SummaryBlock
                header={intlHelper(intl, 'steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periodeFraOgMedSøknadsdato.from),
                    til: prettifyDateFull(periodeFraOgMedSøknadsdato.to),
                })}>
                <FormattedMessage id={`omsorgstilbud.svar.${svar}`} />
            </SummaryBlock>
            {omsorgstilbud && (
                <>
                    {omsorgstilbud.erLiktHverUke !== undefined && (
                        <SummaryBlock header={intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.spm')}>
                            <JaNeiSvar harSvartJa={omsorgstilbud.erLiktHverUke} />
                        </SummaryBlock>
                    )}
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.planlagt.header')}
                        headerTag="h3">
                        {omsorgstilbud.ukedager && <TidFasteDager fasteDager={omsorgstilbud.ukedager} />}
                        {omsorgstilbud.enkeltdager && <TidEnkeltdager dager={omsorgstilbud.enkeltdager} />}
                    </SummaryBlock>
                </>
            )}
        </>
    );
};
export default PlanlagtOmsorgstilbudSummary;
