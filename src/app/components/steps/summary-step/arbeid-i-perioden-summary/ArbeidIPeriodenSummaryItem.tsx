import { DateRange } from '@navikt/sif-common-formik/lib';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { JobberIPeriodeSvar } from '../../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    periode: DateRange;
    arbeid: ArbeidIPeriodeApiData;
    erHistorisk: boolean;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeid, erHistorisk }) => {
    const intl = useIntl();

    const intlTexts = {
        JobberJobbet: intlHelper(
            intl,
            erHistorisk ? 'oppsummering.arbeidIPeriode.Jobbet' : 'oppsummering.arbeidIPeriode.Jobber'
        ),
        vanligRedusert: intlHelper(
            intl,
            arbeid.jobberSomVanlig
                ? 'oppsummering.arbeidIPeriode.jobberIPerioden.somVanlig'
                : 'oppsummering.arbeidIPeriode.jobberIPerioden.redusert'
        ),
    };

    const getIntlText = (part: string): string => {
        return intlHelper(intl, `oppsummering.arbeidIPeriode.${part}`, intlTexts);
    };
    const jobberIPeriodenTekst = arbeid.jobberIPerioden
        ? getIntlText('jobberIPerioden')
        : getIntlText('jobberIkkeIPerioden');
    // const jobberHvorMyeTekst = arbeid.jobberIPerioden
    //     ? getIntlText(arbeid.jobberSomVanlig ? 'jobberSomVanlig' : 'jobberRedusert')
    //     : '';
    return (
        <>
            <p>{jobberIPeriodenTekst}</p>
            <div style={{ paddingLeft: '2rem' }}>
                <SummaryBlock header="Skal du være på jobb i perioden?" headerTag="h4">
                    <FormattedMessage id={`arbeidIPeriode.jobberIPerioden.${arbeid.jobberIPerioden}`} />
                </SummaryBlock>
                {arbeid.jobberIPerioden === JobberIPeriodeSvar.JA && (
                    <SummaryBlock header="Hvor mye skal du jobbe der i perioden?" headerTag="h4">
                        <JaNeiSvar harSvartJa={arbeid.jobberSomVanlig} />
                    </SummaryBlock>
                )}
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
