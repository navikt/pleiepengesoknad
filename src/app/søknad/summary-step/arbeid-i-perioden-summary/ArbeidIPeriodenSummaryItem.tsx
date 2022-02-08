import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getRedusertArbeidstidSomDuration } from '@navikt/sif-common-pleiepenger';
import TidEnkeltdager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidEnkeltdager';
import TidFasteDager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidFasteDager';
import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib/timer-og-minutter/TimerOgMinutter';
import { JobberIPeriodeSvar } from '../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../types/SøknadApiData';

interface Props {
    periode: DateRange;
    arbeidIPeriode: ArbeidIPeriodeApiData;
    normaltimerUke: number;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidIPeriode, normaltimerUke }) => {
    const intl = useIntl();

    const getArbeidProsentTekst = (prosent: number) => {
        const tid = getRedusertArbeidstidSomDuration(prosent, normaltimerUke / 5);
        return intlHelper(intl, 'oppsummering.arbeidIPeriode.jobberIPerioden.prosent', {
            prosent: Intl.NumberFormat().format(prosent),
            timer: formatTimerOgMinutter(intl, tid),
        });
    };

    return (
        <>
            {arbeidIPeriode.jobberIPerioden === JobberIPeriodeSvar.NEI && (
                <p style={{ marginTop: 0 }}>
                    <FormattedMessage id={`oppsummering.arbeidIPeriode.jobberIPerioden.nei`} />
                </p>
            )}

            {arbeidIPeriode.enkeltdager && (
                <Box margin="m">
                    <TidEnkeltdager dager={arbeidIPeriode.enkeltdager} />
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
                                <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                            </Box>
                        </>
                    )}
                    {/* Prosent - men verdi er fordelt likt på  fasteDager */}
                    {arbeidIPeriode.jobberProsent !== undefined && getArbeidProsentTekst(arbeidIPeriode.jobberProsent)}
                </>
            )}
        </>
    );
};

export default ArbeidIPeriodeSummaryItem;
