import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { TidFasteDager } from '@navikt/sif-common-pleiepenger/lib';
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

    // const getArbeidProsentTekst = (prosent: number, normaltimerUke: number) => {
    //     const tid = getRedusertArbeidstidSomDuration(prosent, normaltimerUke / 5);
    //     return intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.prosent', {
    //         prosent: Intl.NumberFormat().format(prosent),
    //         timer: formatTimerOgMinutter(intl, tid),
    //     });
    // };

    const { arbeidIPeriode, harFraværIPeriode } = arbeidsforhold;

    if (harFraværIPeriode === false) {
        return <p style={{ marginTop: 0 }}>Arbeider som normalt i perioden.</p>;
    }
    if (arbeidIPeriode) {
        return (
            <>
                {arbeidIPeriode.jobberIPerioden === 'NEI' && (
                    <p style={{ marginTop: 0 }}>
                        <FormattedMessage id={`oppsummering.arbeidIPeriode.jobberIPerioden.nei`} />
                    </p>
                )}

                {arbeidIPeriode.enkeltdager && (
                    <Box margin="m">
                        <ArbeidstidEnkeltdagerListe dager={arbeidIPeriode.enkeltdager} visNormaltid={false} />
                    </Box>
                )}

                {/* Bruker har valgt faste dager eller prosent */}
                {arbeidIPeriode.fasteDager && (
                    <>
                        {/* Faste dager */}
                        {arbeidIPeriode.jobberProsent === undefined && (
                            <>
                                <div>
                                    {intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke')}:
                                </div>
                                <Box margin="m">
                                    <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                                </Box>
                            </>
                        )}
                        {/* Prosent - men verdi er fordelt likt på  fasteDager */}
                        {/* TODO- fikse oppsummering faste dager */}
                        {/* {arbeidIPeriode.jobberProsent !== undefined &&
                            getArbeidProsentTekst(arbeidIPeriode.jobberProsent, normaltid.snitt)} */}
                    </>
                )}
            </>
        );
    }
    return <>Informasjon om arbeid i perioden mangler</>;
};

export default ArbeidIPeriodeSummaryItem;
