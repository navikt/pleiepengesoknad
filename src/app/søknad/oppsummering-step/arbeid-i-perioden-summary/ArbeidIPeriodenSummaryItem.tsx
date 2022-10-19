import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger';
import {
    decimalDurationToDuration,
    ISODateToDate,
    ISODurationToDecimalDuration,
    ISODurationToDuration,
} from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    ArbeidsukeProsentApiData,
    ArbeidsukeTimerApiData,
    NormalarbeidstidApiData,
} from '../../../types/søknad-api-data/SøknadApiData';
import { getWeekOfYearInfoFromDateRange } from '../../../utils/weekOfYearUtils';

interface Props {
    periode: DateRange;
    arbeidsforhold: ArbeidIPeriodenSummaryItemType;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const intl = useIntl();

    const timerNormaltNumber = ISODurationToDecimalDuration(arbeidsforhold.normalarbeidstid.timerPerUkeISnitt);

    if (arbeidsforhold.arbeidIPeriode === undefined || timerNormaltNumber === undefined) {
        return <>Informasjon om arbeid i perioden mangler</>;
    }

    const timerNormalt = formatTimerOgMinutter(intl, decimalDurationToDuration(timerNormaltNumber));

    const getTimerFraProsentAvNormalt = (prosent: number): string => {
        return formatTimerOgMinutter(intl, decimalDurationToDuration((timerNormaltNumber / 100) * prosent));
    };

    const getArbeidProsentTekst = (prosent: number, normalarbeidstid: NormalarbeidstidApiData) => {
        const timer = ISODurationToDecimalDuration(normalarbeidstid.timerPerUkeISnitt);
        if (!timer) {
            return undefined;
        }
        return intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeiderIPerioden.prosent', {
            prosent: Intl.NumberFormat().format(prosent),
            timerNormalt,
            timerIPeriode: getTimerFraProsentAvNormalt(prosent),
        });
    };

    const getArbeiderUlikeUkerProsentSummary = (arbeidsuker: ArbeidsukeProsentApiData[]) => {
        return (
            <ul>
                {arbeidsuker.map((uke) => {
                    const dateRange: DateRange = {
                        from: ISODateToDate(uke.periode.fraOgMed),
                        to: ISODateToDate(uke.periode.tilOgMed),
                    };
                    const week = getWeekOfYearInfoFromDateRange(dateRange);
                    return (
                        <li key={week.weekNumber}>
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.prosent.uke"
                                values={{
                                    ukenummer: week.weekNumber,
                                    timerIPeriode: getTimerFraProsentAvNormalt(uke.prosentAvNormalt),
                                    prosent: Intl.NumberFormat().format(uke.prosentAvNormalt),
                                    timerNormalt: timerNormalt,
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    };

    const getArbeiderUlikeUkerTimerSummary = (arbeidsuker: ArbeidsukeTimerApiData[]) => {
        return (
            <ul>
                {arbeidsuker.map((uke) => {
                    const dateRange: DateRange = {
                        from: ISODateToDate(uke.periode.fraOgMed),
                        to: ISODateToDate(uke.periode.tilOgMed),
                    };
                    const week = getWeekOfYearInfoFromDateRange(dateRange);
                    return (
                        <li key={week.weekNumber}>
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.timer.uke"
                                values={{
                                    ukenummer: week.weekNumber,
                                    timer: formatTimerOgMinutter(intl, ISODurationToDuration(uke.timer)),
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    };

    const getArbeidIPeriodenDetaljer = (arbeidIPeriode: ArbeidIPeriodeApiData) => {
        switch (arbeidIPeriode.type) {
            case ArbeidIPeriodeType.arbeiderVanlig:
                return (
                    <ul>
                        <li>
                            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.somVanlig`} />
                        </li>
                    </ul>
                );
            case ArbeidIPeriodeType.arbeiderIkke:
                return (
                    <ul>
                        <li>
                            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.nei`} />
                        </li>
                    </ul>
                );
            case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
                return (
                    <ul>
                        <li>
                            {arbeidIPeriode.type === ArbeidIPeriodeType.arbeiderProsentAvNormalt && (
                                <>
                                    {getArbeidProsentTekst(
                                        arbeidIPeriode.prosentAvNormalt,
                                        arbeidsforhold.normalarbeidstid
                                    )}
                                </>
                            )}
                        </li>
                    </ul>
                );
            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return (
                    <ul>
                        <li>
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.timerPerUke"
                                values={{
                                    timer: formatTimerOgMinutter(
                                        intl,
                                        ISODurationToDuration(arbeidIPeriode.timerPerUke)
                                    ),
                                }}
                            />
                        </li>
                    </ul>
                );
            case ArbeidIPeriodeType.arbeiderUlikeUkerProsent:
                return (
                    <div>
                        <p>
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.prosent.tittel"
                                values={{
                                    timerNormalt: timerNormalt,
                                }}
                            />
                        </p>
                        {getArbeiderUlikeUkerProsentSummary(arbeidIPeriode.arbeidsuker)}
                    </div>
                );

            case ArbeidIPeriodeType.arbeiderUlikeUkerTimer:
                return (
                    <div>
                        <p>
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.timer.tittel"
                                values={{ timerNormalt: timerNormalt }}
                            />
                        </p>
                        {getArbeiderUlikeUkerTimerSummary(arbeidIPeriode.arbeidsuker)}
                    </div>
                );
        }
    };

    return getArbeidIPeriodenDetaljer(arbeidsforhold.arbeidIPeriode);
};

export default ArbeidIPeriodeSummaryItem;
