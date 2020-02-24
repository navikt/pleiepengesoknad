import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import Box from 'common/components/box/Box';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const SelvstendigSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const {
        har_hatt_inntekt_som_selvstendig_naringsdrivende: harHattInntekt,
        selvstendig_virksomheter: virksomheter
    } = apiValues;
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <SummaryBlock header={intlHelper(intl, 'selvstendig.summary.harDuHattInntekt.header')}>
                    <JaNeiSvar harSvartJa={harHattInntekt} />
                </SummaryBlock>
            </Box>
            {harHattInntekt && virksomheter !== undefined && virksomheter.length > 0 && <>Opplisting av virksomheter</>}
        </>
    );
};

export default SelvstendigSummary;
