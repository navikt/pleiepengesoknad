import { DateRange } from '@navikt/sif-common-formik/lib';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { JobberIPeriodeSvar } from '../../../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../../../types/PleiepengesøknadApiData';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';

interface Props {
    periode: DateRange;
    arbeid: ArbeidIPeriodeApiData;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodeSummaryItem: React.FunctionComponent<Props> = ({ arbeid }) => {
    return (
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
                <SummaryBlock header="Er arbeidsukene dine like i denne perioden, eller varierer det?" headerTag="h4">
                    {arbeid.erLiktHverUke ? 'Hver uke er lik' : 'Det varierer fra uke til uke'}
                </SummaryBlock>
            )}
        </div>
    );
};

export default ArbeidIPeriodeSummaryItem;
