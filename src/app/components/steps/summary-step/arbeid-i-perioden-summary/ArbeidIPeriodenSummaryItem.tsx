import { DateRange } from '@navikt/sif-common-formik/lib';
import React from 'react';
import { useIntl } from 'react-intl';
import { Arbeidsform, JobberIPeriodeSvar } from '../../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    periode: DateRange;
    arbeid: ArbeidIPeriodeApiData;
    arbeidsform: Arbeidsform;
    normaltimer: number;
    erHistorisk: boolean;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({
    arbeid,
    arbeidsform,
    erHistorisk,
    normaltimer,
}) => {
    const intl = useIntl();

    const intlTexts = {
        JobberJobbet: intlHelper(
            intl,
            erHistorisk ? 'oppsummering.arbeidIPeriode.Jobbet' : 'oppsummering.arbeidIPeriode.Jobber'
        ),
        vanligRedusert: arbeid.jobberIPerioden
            ? intlHelper(
                  intl,
                  arbeid.jobberSomVanlig
                      ? 'oppsummering.arbeidIPeriode.jobberIPerioden.ja.somVanlig'
                      : 'oppsummering.arbeidIPeriode.jobberIPerioden.ja.redusert',
                  {
                      timerArbeidsform: arbeid.jobberIPerioden
                          ? intlHelper(intl, `timer.arbeidsform.${arbeidsform}`, { timer: normaltimer })
                          : '',
                  }
              )
            : '',
    };

    const getJobberIPeriodenTekst = () => {
        switch (arbeid.jobberIPerioden) {
            case JobberIPeriodeSvar.JA:
                return intlHelper(intl, `oppsummering.arbeidIPeriode.jobberIPerioden.ja`, intlTexts);
            case JobberIPeriodeSvar.NEI:
                return intlHelper(intl, `oppsummering.arbeidIPeriode.jobberIPerioden.nei`, intlTexts);
            case JobberIPeriodeSvar.VET_IKKE:
                return intlHelper(intl, `oppsummering.arbeidIPeriode.jobberIPerioden.vetIkke`, intlTexts);
        }
    };

    return (
        <>
            <ul>
                <li>{getJobberIPeriodenTekst()}</li>
            </ul>

            <div style={{ paddingLeft: '2rem' }}>
                {arbeid.jobberSomVanlig === false && (
                    <SummaryBlock
                        header="Er arbeidsukene dine like i denne perioden, eller varierer det?"
                        headerTag="h4">
                        {arbeid.erLiktHverUke ? 'Hver uke er lik' : 'Det varierer fra uke til uke'}
                    </SummaryBlock>
                )}
            </div>
        </>
    );
};

export default ArbeidIPeriodeSummaryItem;
