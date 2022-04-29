import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    DateDurationMap,
    DateRange,
    decimalDurationToDuration,
    durationToDecimalDuration,
    DurationWeekdays,
    getDateDurationMapFromDurationWeekdaysInDateRange,
    getDatesWithDurationLongerThanZero,
    // getDatesWithDurationLongerThanZero,
    getDurationsInDateRange,
    // numberDurationAsDuration,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { DurationText } from '@navikt/sif-common-pleiepenger/lib';

interface Props {
    headingLevel: number;
    måned: DateRange;
    faktiskArbeid: DateDurationMap;
    normalarbeidstidFasteUkedager: DurationWeekdays;
    // antallDagerMedTid: number;
}

const ArbeidstidMånedTittel: React.FunctionComponent<Props> = ({
    headingLevel,
    faktiskArbeid,
    normalarbeidstidFasteUkedager,
    måned,
}) => {
    const intl = useIntl();
    const arbeidIMåned = getDurationsInDateRange(faktiskArbeid, måned);
    const normaltArbeidIMåned = getDateDurationMapFromDurationWeekdaysInDateRange(måned, normalarbeidstidFasteUkedager);

    const antallDagerMedTid = getDatesWithDurationLongerThanZero(arbeidIMåned).length;
    const faktiskTimerIMåned = summarizeDateDurationMap(arbeidIMåned);
    const normaltTimerIMåned = summarizeDateDurationMap(normaltArbeidIMåned);
    const fravær = durationToDecimalDuration(normaltTimerIMåned) - durationToDecimalDuration(faktiskTimerIMåned);

    return (
        <Element tag={`h${headingLevel}`}>
            <span className="m-caps">
                {intlHelper(intl, 'arbeidstidMånedTittel.ukeOgÅr', {
                    ukeOgÅr: dayjs(måned.from).format('MMMM YYYY'),
                })}
            </span>
            <Normaltekst tag="div">
                {antallDagerMedTid === 0 ? (
                    <FormattedMessage id="arbeidstidMånedTittel.iPeriodePanel.info.ingenDager" />
                ) : (
                    <>
                        <FormattedMessage
                            id="arbeidstidMånedTittel.iPeriodePanel.info"
                            values={{ dager: antallDagerMedTid }}
                        />{' '}
                        Fravær:{' '}
                        <DurationText
                            duration={decimalDurationToDuration(fravær)}
                            fullText={true}
                            hideEmptyValues={true}
                        />
                        {/* <DurationText duration={numberDurationAsDuration(faktiskTimerIMåned)} />/
                        <DurationText duration={numberDurationAsDuration(normaltTimerIMåned)} /> */}
                    </>
                )}
            </Normaltekst>
        </Element>
    );
};

export default ArbeidstidMånedTittel;
