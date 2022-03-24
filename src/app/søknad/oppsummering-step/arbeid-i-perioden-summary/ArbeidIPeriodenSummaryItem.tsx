import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
// import { getRedusertArbeidstidSomDuration } from '@navikt/sif-common-pleiepenger';
import ArbeidstidEnkeltdagerListe from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/ArbeidstidEnkeltdagerListe';
// import ArbeidstidFasteDagerListe from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/ArbeidstidFasteDagerListe';
// import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib/timer-og-minutter/TimerOgMinutter';
import { JobberIPeriodeSvar } from '../../../types';
import { ArbeidIPeriodeApiData, NormalarbeidstidApiData, ArbeidsforholdApiData } from '../../../types/SøknadApiData';

interface Props {
    periode: DateRange;
    arbeidIPeriode: ArbeidIPeriodeApiData;
    normaltid: NormalarbeidstidApiData;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidIPeriode }) => {
    const intl = useIntl();

    // const getArbeidProsentTekst = (prosent: number, normaltimerUke: number) => {
    //     const tid = getRedusertArbeidstidSomDuration(prosent, normaltimerUke / 5);
    //     return intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.prosent', {
    //         prosent: Intl.NumberFormat().format(prosent),
    //         timer: formatTimerOgMinutter(intl, tid),
    //     });
    // };

    return (
        <>
            {arbeidIPeriode.jobberIPerioden === JobberIPeriodeSvar.NEI && (
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
                            <div>{intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke')}:</div>
                            <Box margin="m">
                                {/* <ArbeidstidFasteDagerListe
                                    fasteDager={arbeidIPeriode.fasteDager}
                                    visNormaltid={false}
                                /> */}
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
};

export default ArbeidIPeriodeSummaryItem;
