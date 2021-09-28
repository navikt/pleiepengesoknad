import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FrilansApiData } from '../../../../types/PleiepengesøknadApiData';
import SummarySection from '../../../summary-section/SummarySection';
import DatoSvar from '../enkeltsvar/DatoSvar';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';

interface Props {
    frilansApiData?: FrilansApiData;
}

const FrilansSummary = ({ frilansApiData }: Props) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'frilanser.summary.header')}>
            <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={frilansApiData !== undefined} />
            </SummaryBlock>
            {frilansApiData !== undefined && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                        <DatoSvar apiDato={frilansApiData.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilansApiData.jobberFortsattSomFrilans} />
                    </SummaryBlock>

                    {frilansApiData.jobberFortsattSomFrilans === false && frilansApiData.sluttdato && (
                        <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårSluttet.header')}>
                            <DatoSvar apiDato={frilansApiData.sluttdato} />
                        </SummaryBlock>
                    )}
                </>
            )}
        </SummarySection>
    );
};

export default FrilansSummary;
