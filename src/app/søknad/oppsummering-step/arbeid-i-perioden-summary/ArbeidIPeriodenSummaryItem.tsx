import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger';
import {
    decimalDurationToDuration,
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

interface Props {
    periode: DateRange;
    arbeidsforhold: ArbeidIPeriodenSummaryItemType;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const intl = useIntl();

    if (arbeidsforhold.arbeidIPeriode === undefined) {
        return <>Informasjon om arbeid i perioden mangler</>;
    }

    const getProsentAvNormaltTekstParts = (
        timer: number,
        prosent: number
    ): {
        timerNormalt: string;
        timerIPeriode: string;
    } => {
        const timerNormalt = formatTimerOgMinutter(intl, decimalDurationToDuration(timer));
        const timerIPeriode = formatTimerOgMinutter(intl, decimalDurationToDuration((timer / 100) * prosent));
        return {
            timerNormalt,
            timerIPeriode,
        };
    };

    const getArbeidProsentTekst = (prosent: number, normalarbeidstid: NormalarbeidstidApiData) => {
        const timer = ISODurationToDecimalDuration(normalarbeidstid.timerPerUkeISnitt);
        if (!timer) {
            return undefined;
        }
        const { timerNormalt, timerIPeriode } = getProsentAvNormaltTekstParts(timer, prosent);

        return intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeiderIPerioden.prosent', {
            prosent: Intl.NumberFormat().format(prosent),
            timerNormalt,
            timerIPeriode,
        });
    };

    const getArbeiderUlikeUkerProsentSummary = (arbeidsuker: ArbeidsukeProsentApiData[]) => {
        return (
            <>
                {arbeidsuker.forEach((uke) => {
                    return <>Uke {uke.prosentAvNormalt}</>;
                })}
            </>
        );
    };

    const getArbeiderUlikeUkerTimerSummary = (arbeidsuker: ArbeidsukeTimerApiData[]) => {
        return (
            <>
                {arbeidsuker.forEach((uke) => {
                    return <>Uke {uke.timer}</>;
                })}
            </>
        );
    };

    const getArbeidIPeriodenDetaljer = (arbeidIPeriode: ArbeidIPeriodeApiData) => {
        switch (arbeidIPeriode.type) {
            case ArbeidIPeriodeType.arbeiderVanlig:
                return <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.somVanlig`} />;
            case ArbeidIPeriodeType.arbeiderIkke:
                return <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.nei`} />;
            case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
                return (
                    <>
                        {arbeidIPeriode.type === ArbeidIPeriodeType.arbeiderProsentAvNormalt && (
                            <>
                                {getArbeidProsentTekst(
                                    arbeidIPeriode.prosentAvNormalt,
                                    arbeidsforhold.normalarbeidstid
                                )}
                            </>
                        )}
                    </>
                );
            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return (
                    <FormattedMessage
                        id="oppsummering.arbeidIPeriode.arbeiderIPerioden.timerPerUke"
                        values={{
                            timer: formatTimerOgMinutter(intl, ISODurationToDuration(arbeidIPeriode.snittTimerPerUke)),
                        }}
                    />
                );
            case ArbeidIPeriodeType.arbeiderUlikeUkerProsent:
                return getArbeiderUlikeUkerProsentSummary(arbeidIPeriode.arbeidsuker);
            case ArbeidIPeriodeType.arbeiderUlikeUkerTimer:
                return getArbeiderUlikeUkerTimerSummary(arbeidIPeriode.arbeidsuker);
        }
    };

    return (
        <ul>
            <li>{getArbeidIPeriodenDetaljer(arbeidsforhold.arbeidIPeriode)}</li>
        </ul>
    );
};

export default ArbeidIPeriodeSummaryItem;
