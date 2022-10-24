import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    DateDurationMap,
    DateRange,
    dateToISODate,
    decimalDurationToDuration,
    Duration,
    durationToDecimalDuration,
    DurationWeekdays,
    getDateDurationMapFromDurationWeekdaysInDateRange,
    getDatesInDateRange,
    getDatesWithDurationLongerThanZero,
    getDurationsInDateRange,
    numberDurationAsDuration,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { Element } from 'nav-frontend-typografi';
import { DurationText } from '@navikt/sif-common-pleiepenger/lib';

interface Props {
    headingLevel: number;
    måned: DateRange;
    faktiskArbeid: DateDurationMap;
    normalarbeidstidFasteUkedager: DurationWeekdays;
    // antallDagerMedTid: number;
}

const summerFraværIPeriode = (periode: DateRange, normalt: DateDurationMap, faktisk: DateDurationMap): Duration => {
    const fravær: DateDurationMap = {};
    getDatesInDateRange(periode)
        .map((d) => dateToISODate(d))
        .forEach((isoDate) => {
            const dNormalt = normalt[isoDate];
            const dFaktisk = faktisk[isoDate];

            const tidNormalt = dNormalt ? durationToDecimalDuration(dNormalt) : 0;
            const tidFaktisk = dFaktisk ? durationToDecimalDuration(dFaktisk) : 0;
            fravær[isoDate] = decimalDurationToDuration(Math.max(tidNormalt - tidFaktisk, 0));
        });
    return numberDurationAsDuration(summarizeDateDurationMap(fravær));
};

const ArbeidstidMånedTittel: React.FunctionComponent<Props> = ({
    headingLevel,
    faktiskArbeid,
    normalarbeidstidFasteUkedager,
    måned,
}) => {
    const intl = useIntl();
    const faktiskArbeidIMåned = getDurationsInDateRange(faktiskArbeid, måned);
    const normaltArbeidIMåned = getDateDurationMapFromDurationWeekdaysInDateRange(måned, normalarbeidstidFasteUkedager);

    const antallDagerMedTid = getDatesWithDurationLongerThanZero(faktiskArbeidIMåned).length;
    const samletFravær = summerFraværIPeriode(måned, normaltArbeidIMåned, faktiskArbeidIMåned);

    return (
        <Element tag={`h${headingLevel}`}>
            <span className="m-caps">
                {intlHelper(intl, 'arbeidstidMånedTittel.ukeOgÅr', {
                    ukeOgÅr: dayjs(måned.from).format('MMMM YYYY'),
                })}
            </span>
            <div>
                {antallDagerMedTid === 0 ? (
                    <FormattedMessage id="arbeidstidMånedTittel.iPeriodePanel.info.ingenDager" />
                ) : (
                    <>
                        <FormattedMessage
                            id="arbeidstidMånedTittel.iPeriodePanel.info"
                            values={{ dager: antallDagerMedTid }}
                        />{' '}
                        {/* <DurationText duration={numberDurationAsDuration(faktiskTimerIMåned)} />/
                        <DurationText duration={numberDurationAsDuration(normaltTimerIMåned)} /> */}
                    </>
                )}{' '}
                <>
                    Fravær <DurationText duration={samletFravær} fullText={true} hideEmptyValues={true} />
                </>
            </div>
        </Element>
    );
};

export default ArbeidstidMånedTittel;
