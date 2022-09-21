import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { formatTimerOgMinutter, TidFasteDager } from '@navikt/sif-common-pleiepenger';
import ArbeidstidEnkeltdagerListe from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-enkeltdager-liste/ArbeidstidEnkeltdagerListe';
import {
    decimalDurationToDuration,
    ISODurationToDecimalDuration,
    ISODurationToDuration,
} from '@navikt/sif-common-utils/lib';
import {
    ArbeidsforholdApiData,
    NormalarbeidstidApiData,
    ArbeidIPeriodeApiData,
} from '../../../types/søknad-api-data/SøknadApiData';
import { ArbeidIPeriodeType } from '../../../types/søknadsdata/Søknadsdata';

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
        if (normalarbeidstid.erLiktHverUke === false) {
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
        }
        return undefined;
    };

    const getArbeidIPeriodenDetaljer = (arbeidIPeriode: ArbeidIPeriodeApiData) => {
        switch (arbeidIPeriode.type) {
            case ArbeidIPeriodeType.arbeiderVanlig:
                return <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.somVanlig`} />;
            case ArbeidIPeriodeType.arbeiderIkke:
                return <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.nei`} />;
            case ArbeidIPeriodeType.arbeiderEnkeltdager:
                return <ArbeidstidEnkeltdagerListe dager={arbeidIPeriode.enkeltdager} visNormaltid={false} />;
            case ArbeidIPeriodeType.arbeiderFasteUkedager:
                return (
                    <>
                        <div>
                            <FormattedMessage id="oppsummering.arbeidIPeriode.arbeiderIPerioden.liktHverUke" />:
                        </div>
                        <Box margin="m">
                            <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                        </Box>
                    </>
                );
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
                            timer: formatTimerOgMinutter(intl, ISODurationToDuration(arbeidIPeriode.timerPerUke)),
                        }}
                    />
                );
            case ArbeidIPeriodeType.arbeiderKunSmåoppdrag:
                return null; // Dette vises ikke på oppsummeringen
        }
    };
    const wrapInList = arbeidsforhold.arbeidIPeriode?.type !== ArbeidIPeriodeType.arbeiderEnkeltdager;

    return wrapInList ? (
        <ul>
            <li>{getArbeidIPeriodenDetaljer(arbeidsforhold.arbeidIPeriode)}</li>
        </ul>
    ) : (
        getArbeidIPeriodenDetaljer(arbeidsforhold.arbeidIPeriode)
    );
};

export default ArbeidIPeriodeSummaryItem;
