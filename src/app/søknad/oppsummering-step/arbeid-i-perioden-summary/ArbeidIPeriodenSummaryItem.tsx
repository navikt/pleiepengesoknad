import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { formatTimerOgMinutter, TidFasteDager } from '@navikt/sif-common-pleiepenger/lib';
import ArbeidstidEnkeltdagerListe from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/ArbeidstidEnkeltdagerListe';
import { decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdApiData, NormalarbeidstidApiData } from '../../../types/søknad-api-data/SøknadApiData';
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

    const getArbeidProsentTekst = (prosent: number, normalarbeidstid: NormalarbeidstidApiData) => {
        if (normalarbeidstid.erLiktHverUke === false) {
            return intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeiderIPerioden.prosent', {
                prosent: Intl.NumberFormat().format(prosent),
                timerPerUke: formatTimerOgMinutter(intl, decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)),
            });
        }
        return undefined;
    };

    const { arbeidIPeriode, normalarbeidstid } = arbeidsforhold;

    if (arbeidIPeriode) {
        switch (arbeidIPeriode.type) {
            case ArbeidIPeriodeType.arbeiderVanlig:
                return (
                    <p style={{ marginTop: 0 }}>
                        <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.somVanlig`} />
                    </p>
                );
            case ArbeidIPeriodeType.arbeiderIkke:
                return (
                    <p style={{ marginTop: 0 }}>
                        <FormattedMessage id={`oppsummering.arbeidIPeriode.arbeiderIPerioden.nei`} />
                    </p>
                );
            case ArbeidIPeriodeType.arbeiderEnkeltdager:
                return (
                    <Box margin="m">
                        <ArbeidstidEnkeltdagerListe dager={arbeidIPeriode.enkeltdager} visNormaltid={false} />
                    </Box>
                );
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
                        <Box margin="m">
                            {arbeidIPeriode.type === ArbeidIPeriodeType.arbeiderProsentAvNormalt && (
                                <>{getArbeidProsentTekst(arbeidIPeriode.prosentAvNormalt, normalarbeidstid)}</>
                            )}
                        </Box>
                    </>
                );
            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return (
                    <>
                        <Box margin="m">
                            <FormattedMessage
                                id="oppsummering.arbeidIPeriode.arbeiderIPerioden.timerPerUke"
                                values={{
                                    timer: formatTimerOgMinutter(
                                        intl,
                                        decimalDurationToDuration(arbeidIPeriode.timerPerUke)
                                    ),
                                }}
                            />
                        </Box>
                    </>
                );
        }
    }
    return <>Informasjon om arbeid i perioden mangler</>;
};

export default ArbeidIPeriodeSummaryItem;
