import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger';
import {
    decimalDurationToDuration,
    ISODateToDate,
    ISODurationToDecimalDuration,
    ISODurationToDuration,
} from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import { getArbeidsukeInfoIPeriode } from '../../../utils/arbeidsukeInfoUtils';
import { ArbeidIPeriodenFrilansSummaryItemType } from './ArbeidIPeriodenSummary';
import { ArbeidIPeriodeFrilansApiData } from '../../../types/søknad-api-data/arbeidIPeriodeFrilansApiData';
import { MisterHonorarerFraVervIPerioden } from '../../../types/ArbeidIPeriodeFormValues';
import { ArbeidsukeTimerApiData } from '../../../types/søknad-api-data/arbeidIPeriodeApiData';
import { NormalarbeidstidApiData } from 'app/types/søknad-api-data/normalarbeidstidApiData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    arbeidsforhold: ArbeidIPeriodenFrilansSummaryItemType;
    misterHonorarerIPerioden?: MisterHonorarerFraVervIPerioden;
}

const ArbeidIPeriodeFrilansSummaryItem: React.FunctionComponent<Props> = ({
    arbeidsforhold,
    misterHonorarerIPerioden,
}) => {
    const intl = useIntl();

    const timerNormaltNumber = ISODurationToDecimalDuration(arbeidsforhold.normalarbeidstid.timerPerUkeISnitt);

    if (arbeidsforhold.arbeidIPeriode === undefined || timerNormaltNumber === undefined) {
        return <>Informasjon om arbeid i perioden mangler</>;
    }

    const timerNormalt = formatTimerOgMinutter(intl, decimalDurationToDuration(timerNormaltNumber));

    const getTimerFraProsentAvNormalt = (prosent: number): string => {
        return formatTimerOgMinutter(intl, decimalDurationToDuration((timerNormaltNumber / 100) * prosent));
    };
    const getArbeiderUlikeUkerTimerSummary = (arbeidsuker: ArbeidsukeTimerApiData[]) => {
        return (
            <ul>
                {arbeidsuker.map((uke) => {
                    const dateRange: DateRange = {
                        from: ISODateToDate(uke.periode.fraOgMed),
                        to: ISODateToDate(uke.periode.tilOgMed),
                    };
                    const week = getArbeidsukeInfoIPeriode(dateRange);
                    return (
                        <li key={week.ukenummer}>
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.timer.uke"
                                values={{
                                    ukenummer: week.ukenummer,
                                    timer: formatTimerOgMinutter(intl, ISODurationToDuration(uke.timer)),
                                }}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    };
    const getFrilanserTekst = (arbeiderIPerioden: ArbeiderIPeriodenSvar) => (
        <li>
            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.frilanser.${arbeiderIPerioden}`} />
        </li>
    );

    const getVervTekst = (verv: MisterHonorarerFraVervIPerioden) => (
        <li>
            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.verv.${verv}`} />
        </li>
    );

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

    const getArbeidIPeriodenDetaljer = (arbeidIPeriode: ArbeidIPeriodeFrilansApiData) => {
        switch (arbeidIPeriode.type) {
            case ArbeidIPeriodeType.arbeiderIkke:
                return (
                    <ul>
                        {arbeidIPeriode.arbeiderIPerioden && getFrilanserTekst(arbeidIPeriode.arbeiderIPerioden)}
                        {misterHonorarerIPerioden && getVervTekst(misterHonorarerIPerioden)}
                    </ul>
                );
            case ArbeidIPeriodeType.arbeiderVanlig:
                return (
                    <ul>
                        {arbeidIPeriode.arbeiderIPerioden && getFrilanserTekst(arbeidIPeriode.arbeiderIPerioden)}
                        {misterHonorarerIPerioden && getVervTekst(misterHonorarerIPerioden)}
                    </ul>
                );
            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return (
                    <>
                        <ul>
                            {arbeidIPeriode.arbeiderIPerioden && getFrilanserTekst(arbeidIPeriode.arbeiderIPerioden)}
                            {misterHonorarerIPerioden && getVervTekst(misterHonorarerIPerioden)}
                        </ul>
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
                    </>
                );
            case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
                return (
                    <>
                        <ul>
                            {arbeidIPeriode.arbeiderIPerioden && getFrilanserTekst(arbeidIPeriode.arbeiderIPerioden)}
                            {misterHonorarerIPerioden && getVervTekst(misterHonorarerIPerioden)}
                        </ul>

                        <ul>
                            <li>
                                {getArbeidProsentTekst(
                                    arbeidIPeriode.prosentAvNormalt,
                                    arbeidsforhold.normalarbeidstid
                                )}
                            </li>
                        </ul>
                    </>
                );
            case ArbeidIPeriodeType.arbeiderUlikeUkerTimer:
                return (
                    <div>
                        <ul>
                            {arbeidIPeriode.arbeiderIPerioden && getFrilanserTekst(arbeidIPeriode.arbeiderIPerioden)}
                            {misterHonorarerIPerioden && getVervTekst(misterHonorarerIPerioden)}
                        </ul>
                        <p>
                            <FormattedMessage
                                id={
                                    arbeidIPeriode.arbeidsuker.length === 1
                                        ? 'oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.enkeltuke.timer.tittel'
                                        : 'oppsummering.arbeidIPeriode.arbeiderIPerioden.ulikeUker.timer.tittel'
                                }
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

export default ArbeidIPeriodeFrilansSummaryItem;
