import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import {
    formatTimerOgMinutter,
    getRedusertArbeidstidSomDuration,
    TidFasteDager,
} from '@navikt/sif-common-pleiepenger/lib';
import ArbeidstidEnkeltdagerListe from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/ArbeidstidEnkeltdagerListe';
import { ArbeidsforholdApiData } from '../../../types/SøknadApiData';

interface Props {
    periode: DateRange;
    arbeidsforhold: ArbeidIPeriodenSummaryItemType;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidsforhold }) => {
    const intl = useIntl();

    const getArbeidProsentTekst = (prosent: number, normaltimerUke: number) => {
        const tid = getRedusertArbeidstidSomDuration(prosent, normaltimerUke / 5);
        return intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.prosent', {
            prosent: Intl.NumberFormat().format(prosent),
            timer: formatTimerOgMinutter(intl, tid),
        });
    };

    const { arbeidIPeriode, harFraværIPeriode, normalarbeidstid } = arbeidsforhold;

    if (harFraværIPeriode === false) {
        return <p style={{ marginTop: 0 }}>Arbeider som normalt i perioden.</p>;
    }
    if (arbeidIPeriode) {
        return (
            <>
                {arbeidIPeriode.type === 'jobberIkkeIPerioden' && (
                    <p style={{ marginTop: 0 }}>
                        <FormattedMessage id={`oppsummering.arbeidIPeriode.jobberIPerioden.nei`} />
                    </p>
                )}
                {arbeidIPeriode.type === 'jobberVariert' && (
                    <Box margin="m">
                        <ArbeidstidEnkeltdagerListe dager={arbeidIPeriode.enkeltdager} visNormaltid={false} />
                    </Box>
                )}
                {(arbeidIPeriode.type === 'jobberFasteDager' || arbeidIPeriode.type === 'jobberProsent') && (
                    <>
                        <div>{intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke')}:</div>
                        <Box margin="m">
                            {arbeidIPeriode.type === 'jobberProsent' && (
                                <>{getArbeidProsentTekst(arbeidIPeriode.jobberProsent, normalarbeidstid.timerPerUke)}</>
                            )}
                            <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                        </Box>
                    </>
                )}
            </>
        );
    }
    return <>Informasjon om arbeid i perioden mangler</>;
};

export default ArbeidIPeriodeSummaryItem;
