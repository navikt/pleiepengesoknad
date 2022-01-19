import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../types/SøknadApiData';
import TidEnkeltdager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidEnkeltdager';
import TidFasteDager from '@navikt/sif-common-pleiepenger/lib/dager-med-tid/TidFasteDager';
import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib/timer-og-minutter/TimerOgMinutter';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { JobberIPeriodeSvar } from '../../../types';
import { getRedusertArbeidstidSomDuration } from '@navikt/sif-common-pleiepenger';

interface Props {
    periode: DateRange;
    arbeidIPeriode: ArbeidIPeriodeApiData;
    normaltimerUke: number;
    erHistorisk: boolean;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidIPeriode, erHistorisk, normaltimerUke }) => {
    const intl = useIntl();

    const intlTexts = {
        JobberJobbet: intlHelper(
            intl,
            erHistorisk ? 'oppsummering.arbeidIPeriode.Jobbet' : 'oppsummering.arbeidIPeriode.Jobber'
        ),
    };

    const getArbeidProsentTekst = (prosent: number) => {
        const tid = getRedusertArbeidstidSomDuration(prosent, normaltimerUke / 5);
        return intlHelper(
            intl,
            erHistorisk
                ? 'oppsummering.arbeidIPeriode.jobberIPerioden.prosent.historisk'
                : 'oppsummering.arbeidIPeriode.jobberIPerioden.prosent',
            {
                prosent: Intl.NumberFormat().format(prosent),
                timer: formatTimerOgMinutter(intl, tid),
            }
        );
    };

    return (
        <>
            <ul>
                {arbeidIPeriode.jobberIPerioden === JobberIPeriodeSvar.NEI && (
                    <li>
                        <FormattedMessage
                            id={
                                erHistorisk
                                    ? `oppsummering.arbeidIPeriode.jobberIPerioden.nei.historisk`
                                    : `oppsummering.arbeidIPeriode.jobberIPerioden.nei`
                            }
                            values={intlTexts}
                        />
                    </li>
                )}
                {arbeidIPeriode.enkeltdager && (
                    <li>
                        <div>
                            {intlHelper(
                                intl,
                                erHistorisk
                                    ? 'oppsummering.arbeidIPeriode.Jobbet'
                                    : 'oppsummering.arbeidIPeriode.Jobber'
                            )}
                            :
                        </div>
                        <Box margin="m">
                            <TidEnkeltdager dager={arbeidIPeriode.enkeltdager} />
                        </Box>
                    </li>
                )}
                {/* Bruker har valgt faste dager eller prosent */}
                {arbeidIPeriode.fasteDager && (
                    <li>
                        {/* Faste dager */}
                        {arbeidIPeriode.jobberProsent === undefined && (
                            <>
                                <div>
                                    {intlHelper(
                                        intl,
                                        erHistorisk
                                            ? 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke.historisk'
                                            : 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke'
                                    )}
                                    :
                                </div>
                                <Box margin="m">
                                    <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                                </Box>
                            </>
                        )}
                        {/* Prosent - men verdi er fordelt likt på  fasteDager */}
                        {arbeidIPeriode.jobberProsent !== undefined &&
                            getArbeidProsentTekst(arbeidIPeriode.jobberProsent)}
                    </li>
                )}
            </ul>
        </>
    );
};

export default ArbeidIPeriodeSummaryItem;
