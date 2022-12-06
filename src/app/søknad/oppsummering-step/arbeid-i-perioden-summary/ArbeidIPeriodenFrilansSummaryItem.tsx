import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger';
import {
    decimalDurationToDuration,
    ISODateToDate,
    ISODurationToDecimalDuration,
    ISODurationToDuration,
} from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import { ArbeidsukeTimerApiData } from '../../../types/søknad-api-data/SøknadApiData';
import { getArbeidsukeInfoIPeriode } from '../../../utils/arbeidsukeInfoUtils';
import { ArbeidIPeriodenFrilansSummaryItemType } from './ArbeidIPeriodenSummary';
import { ArbeidIPeriodeFrilansApiData } from '../../../types/søknad-api-data/arbeidIPeriodeFrilansApiData';
import { OmsorgsstønadSvar, VervSvar } from '../../../types/ArbeidIPeriodeFormValues';

interface Props {
    periode: DateRange;
    arbeidsforhold: ArbeidIPeriodenFrilansSummaryItemType;
}

const ArbeidIPeriodeFrilansSummaryItem: React.FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const intl = useIntl();

    const timerNormaltNumber = ISODurationToDecimalDuration(arbeidsforhold.normalarbeidstid.timerPerUkeISnitt);

    if (arbeidsforhold.arbeidIPeriode === undefined || timerNormaltNumber === undefined) {
        return <>Informasjon om arbeid i perioden mangler</>;
    }

    const timerNormalt = formatTimerOgMinutter(intl, decimalDurationToDuration(timerNormaltNumber));

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
    const getFrilanserTekst = (frilansIPeriode: ArbeiderIPeriodenSvar) => (
        <li>
            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.frilanser.${frilansIPeriode}`} />
        </li>
    );

    const getOmsorgsstønadTekst = (omsorgsstønad: OmsorgsstønadSvar) => (
        <li>
            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.omsorgsstønad.${omsorgsstønad}`} />
        </li>
    );

    const getVervTekst = (verv: VervSvar) => (
        <li>
            <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.verv.${verv}`} />
        </li>
    );

    const getArbeidIPeriodenDetaljer = (arbeidIPeriode: ArbeidIPeriodeFrilansApiData) => {
        switch (arbeidIPeriode.type) {
            case ArbeidIPeriodeType.arbeiderIkkeEllerVanlig:
                return (
                    <ul>
                        {arbeidIPeriode.frilansIPeriode && getFrilanserTekst(arbeidIPeriode.frilansIPeriode)}
                        {arbeidIPeriode.omsorgsstønad && getOmsorgsstønadTekst(arbeidIPeriode.omsorgsstønad)}
                        {arbeidIPeriode.verv && getVervTekst(arbeidIPeriode.verv)}
                    </ul>
                );

            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return (
                    <>
                        <ul>
                            {arbeidIPeriode.frilansIPeriode && getFrilanserTekst(arbeidIPeriode.frilansIPeriode)}
                            {arbeidIPeriode.omsorgsstønad && getOmsorgsstønadTekst(arbeidIPeriode.omsorgsstønad)}
                            {arbeidIPeriode.verv && getVervTekst(arbeidIPeriode.verv)}
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
            case ArbeidIPeriodeType.arbeiderUlikeUkerTimer:
                return (
                    <div>
                        <ul>
                            {arbeidIPeriode.frilansIPeriode && getFrilanserTekst(arbeidIPeriode.frilansIPeriode)}
                            {arbeidIPeriode.omsorgsstønad && getOmsorgsstønadTekst(arbeidIPeriode.omsorgsstønad)}
                            {arbeidIPeriode.verv && getVervTekst(arbeidIPeriode.verv)}
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
