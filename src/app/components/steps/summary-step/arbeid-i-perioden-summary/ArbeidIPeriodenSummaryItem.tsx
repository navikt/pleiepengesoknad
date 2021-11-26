import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { JobberIPeriodeSvar } from '../../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';
import TidEnkeltdager from '../../../dager-med-tid/TidEnkeltdager';
import TidFasteDager from '../../../dager-med-tid/TidFasteDager';
import { formatTimerOgMinutter } from '../../../timer-og-minutter/TimerOgMinutter';
import { getRedusertArbeidstidSomInputTime } from '../../../../utils/formToApiMaps/tidsbrukApiUtils';

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
        vanligRedusert: arbeidIPeriode.jobberIPerioden
            ? intlHelper(
                  intl,
                  arbeidIPeriode.jobberSomVanlig
                      ? 'oppsummering.arbeidIPeriode.jobberIPerioden.ja.somVanlig'
                      : 'oppsummering.arbeidIPeriode.jobberIPerioden.ja.redusert',
                  {
                      timer:
                          arbeidIPeriode.jobberIPerioden && normaltimerUke !== undefined
                              ? intlHelper(intl, `timerPerUke`, { timer: normaltimerUke })
                              : '',
                  }
              )
            : '',
    };

    const getJobberIPeriodenTekst = () => {
        switch (arbeidIPeriode.jobberIPerioden) {
            case JobberIPeriodeSvar.JA:
                return intlHelper(intl, `oppsummering.arbeidIPeriode.jobberIPerioden.ja`, intlTexts);
            case JobberIPeriodeSvar.NEI:
                return intlHelper(
                    intl,
                    erHistorisk
                        ? `oppsummering.arbeidIPeriode.jobberIPerioden.nei.historisk`
                        : `oppsummering.arbeidIPeriode.jobberIPerioden.nei`,
                    intlTexts
                );
            case JobberIPeriodeSvar.VET_IKKE:
                return intlHelper(intl, `oppsummering.arbeidIPeriode.jobberIPerioden.vetIkke`, intlTexts);
        }
    };

    const getArbeidProsentTekst = (prosent: number) => {
        const tid = getRedusertArbeidstidSomInputTime(prosent, normaltimerUke / 5);
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
                <li>{getJobberIPeriodenTekst()}</li>
                {arbeidIPeriode.jobberSomVanlig === false && arbeidIPeriode.enkeltdager && (
                    <li>
                        <p>
                            {intlHelper(
                                intl,
                                erHistorisk
                                    ? 'oppsummering.arbeidIPeriode.Jobbet'
                                    : 'oppsummering.arbeidIPeriode.Jobber'
                            )}
                            :
                        </p>
                        <TidEnkeltdager dager={arbeidIPeriode.enkeltdager} />
                    </li>
                )}
                {/* Bruker har valgt faste dager eller prosent */}
                {arbeidIPeriode.jobberSomVanlig === false && arbeidIPeriode.fasteDager && (
                    <li>
                        {/* Faste dager */}
                        {arbeidIPeriode._jobberProsent === undefined && (
                            <>
                                <p>
                                    {intlHelper(
                                        intl,
                                        erHistorisk
                                            ? 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke.historisk'
                                            : 'oppsummering.arbeidIPeriode.jobberIPerioden.liktHverUke'
                                    )}
                                    :
                                </p>
                                <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                            </>
                        )}
                        {/* Prosent - men verdi er fordelt likt på  fasteDager */}
                        {arbeidIPeriode._jobberProsent !== undefined &&
                            getArbeidProsentTekst(arbeidIPeriode._jobberProsent)}
                    </li>
                )}
            </ul>
        </>
    );
};

export default ArbeidIPeriodeSummaryItem;
