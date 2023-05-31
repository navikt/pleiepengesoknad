import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import SifGuidePanel from '@navikt/sif-common-core-ds/lib/components/sif-guide-panel/SifGuidePanel';
import Page from '@navikt/sif-common-core-ds/lib/components/page/Page';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../lenker';

const IkkeTilgangPage = () => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.ikkeTilgang);
    return (
        <Page
            className="ikkeTilgangPage"
            title={intlHelper(intl, 'application.title')}
            topContentRenderer={() => <h1>{intlHelper(intl, 'application.title')}</h1>}>
            <Block margin="xxl">
                <SifGuidePanel poster={true}>
                    <p>
                        <FormattedMessage id="page.ikkeTilgang.tekst" />
                    </p>
                    <Lenke href={getLenker(intl.locale).papirskjemaPrivat} target="_blank">
                        <FormattedMessage id="page.ikkeTilgang.lastNed" />
                    </Lenke>
                </SifGuidePanel>
            </Block>
        </Page>
    );
};

export default IkkeTilgangPage;
