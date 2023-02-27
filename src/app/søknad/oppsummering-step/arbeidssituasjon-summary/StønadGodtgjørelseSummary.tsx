import React from 'react';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import { StønadGodtgjørelseApiData } from 'app/types/søknad-api-data/stønadGodtgjørelseApiData';
import { dateFormatter, ISODateToDate } from '@navikt/sif-common-utils/lib';

interface Props {
    stønadGodtgjørelse: StønadGodtgjørelseApiData;
}

const StønadGodtgjørelseSummary = ({ stønadGodtgjørelse }: Props) => {
    // const intl = useIntl();
    const {
        mottarStønadGodtgjørelse,
        mottarStønadGodtgjørelseIHelePeroden,
        starterUndeveis,
        startDato,
        slutterUnderveis,
        sluttDato,
    } = stønadGodtgjørelse;

    if (mottarStønadGodtgjørelse === false) {
        return (
            <SummaryBlock header={'Omsorgsstønad eller fosterhjemsgodtgjørelse'}>
                <ul>
                    <li>Jeg mottar ikke omsorgsstønad eller fosterhjemsgodtgjørelse</li>
                </ul>
            </SummaryBlock>
        );
    }

    return (
        <SummaryBlock header={'Omsorgsstønad eller fosterhjemsgodtgjørelse'} headerTag="h3">
            <ul>
                {mottarStønadGodtgjørelseIHelePeroden ? (
                    <li>{'Jeg mottar stønad/godtgjørelse i hele perioden jeg søker for'}</li>
                ) : (
                    <li>{'Jeg mottar stønad/godtgjørelse i deler av perioden jeg søker for'}</li>
                )}
                {mottarStønadGodtgjørelseIHelePeroden === false && starterUndeveis && startDato && (
                    <li>{`Startet ${dateFormatter.full(ISODateToDate(startDato))}`}</li>
                )}
                {mottarStønadGodtgjørelseIHelePeroden === false && slutterUnderveis && sluttDato && (
                    <li>{`Sluttet ${dateFormatter.full(ISODateToDate(sluttDato))}`}</li>
                )}
            </ul>
        </SummaryBlock>
    );
};

export default StønadGodtgjørelseSummary;
