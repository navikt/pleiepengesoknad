import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { formatTimerOgMinutter, TidFasteDager } from '@navikt/sif-common-pleiepenger';
import ArbeidstidEnkeltdagerListe from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-enkeltdager-liste/ArbeidstidEnkeltdagerListe';
import { decimalDurationToDuration, ISODurationToDuration } from '@navikt/sif-common-utils/lib';
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

    const getArbeidProsentTekst = (prosent: number, normalarbeidstid: NormalarbeidstidApiData) => {
        if (normalarbeidstid.erLiktHverUke === false) {
            return intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeiderIPerioden.prosent', {
                prosent: Intl.NumberFormat().format(prosent),
                timerPerUke: formatTimerOgMinutter(intl, ISODurationToDuration(normalarbeidstid.timerPerUkeISnitt)),
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
                            timer: formatTimerOgMinutter(intl, decimalDurationToDuration(arbeidIPeriode.timerPerUke)),
                        }}
                    />
                );
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
