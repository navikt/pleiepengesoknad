import { DateRange } from '@navikt/sif-common-formik/lib';
import React from 'react';
import { useIntl } from 'react-intl';
import { Arbeidsform } from '../../../../types';
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
                      ? 'oppsummering.arbeidIPeriode.jobberIPerioden.somVanlig'
                      : 'oppsummering.arbeidIPeriode.jobberIPerioden.redusert',
                  {
                      timerArbeidsform: arbeid.jobberIPerioden
                          ? intlHelper(intl, `timer.arbeidsform.${arbeidsform}`, { timer: normaltimer })
                          : '',
                  }
              )
            : '',
    };

    const getIntlText = (part: string): string => {
        return intlHelper(intl, `oppsummering.arbeidIPeriode.${part}`, intlTexts);
    };
    const jobberIPeriodenTekst = arbeid.jobberIPerioden
        ? getIntlText('jobberIPerioden')
        : getIntlText('jobberIkkeIPerioden');

    return (
        <>
            <p>{jobberIPeriodenTekst}</p>
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
