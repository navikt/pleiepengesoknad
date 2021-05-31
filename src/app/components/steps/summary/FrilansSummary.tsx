import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import DatoSvar from './DatoSvar';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';
import ArbeidsforholdSNFSummary from '../../../components/arbeidsforholdSNF-summary/ArbeidsforholdSNFSummary';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const FrilansSummary = ({ apiValues }: Props) => {
    const { harHattInntektSomFrilanser, frilans } = apiValues;
    const intl = useIntl();
    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={harHattInntektSomFrilanser} />
            </SummaryBlock>

            {harHattInntektSomFrilanser && frilans !== undefined && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilans.jobberFortsattSomFrilans} />
                    </SummaryBlock>

                    {frilans.jobberFortsattSomFrilans === false && frilans.sluttdato && (
                        <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårSluttet.header')}>
                            <DatoSvar apiDato={frilans.sluttdato} />
                        </SummaryBlock>
                    )}
                    {frilans.arbeidsforhold && (
                        <SummaryBlock header={intlHelper(intl, 'frilanser.arbeidsforhold.summary.arbeidsform.spm')}>
                            <ArbeidsforholdSNFSummary arbeidsforhold={frilans.arbeidsforhold} />
                        </SummaryBlock>
                    )}
                </>
            )}
        </>
    );
};

export default FrilansSummary;
