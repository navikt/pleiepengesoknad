import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { JobberIPeriodeSvar } from '../../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';
import TidEnkeltdager from '../../../dager-med-tid/TidEnkeltdager';
import TidFasteDager from '../../../dager-med-tid/TidFasteDager';

interface Props {
    periode: DateRange;
    arbeidIPeriode: ArbeidIPeriodeApiData;
    normaltimer?: number;
    erHistorisk: boolean;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeidIPeriode, erHistorisk, normaltimer }) => {
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
                          arbeidIPeriode.jobberIPerioden && normaltimer !== undefined
                              ? intlHelper(intl, `timerPerUke`, { timer: normaltimer })
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

    return (
        <>
            <ul>
                <li>{getJobberIPeriodenTekst()}</li>
                {arbeidIPeriode.jobberSomVanlig === false && arbeidIPeriode.enkeltdager && (
                    <li>
                        <p>{erHistorisk ? 'Jobbet:' : 'Skal jobbe:'}</p>
                        <TidEnkeltdager dager={arbeidIPeriode.enkeltdager} />
                    </li>
                )}
                {arbeidIPeriode.jobberSomVanlig === false && arbeidIPeriode.fasteDager && (
                    <li>
                        <p>{erHistorisk ? 'Jobbet likt hver uke:' : 'Skal jobbe likt hver uke:'}</p>
                        <TidFasteDager fasteDager={arbeidIPeriode.fasteDager} />
                    </li>
                )}
            </ul>
        </>
    );
};

export default ArbeidIPeriodeSummaryItem;
