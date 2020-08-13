import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Innholdstittel } from 'nav-frontend-typografi';
import Box from '@sif-common/core/components/box/Box';
import FrontPageBanner from '@sif-common/core/components/front-page-banner/FrontPageBanner';
import Page from '@sif-common/core/components/page/Page';
import intlHelper from '@sif-common/core/utils/intlUtils';
import getLenker from 'app/lenker';
import './ikkeMyndigPage.less';

const IkkeMyndigPage = () => {
    const intl = useIntl();
    return (
        <Page
            className="ikkeMyndigPage"
            title={intlHelper(intl, 'page.ikkeMyndig.sidetittel')}
            topContentRenderer={() => (
                <FrontPageBanner
                    bannerSize="xlarge"
                    counsellorWithSpeechBubbleProps={{
                        strongText: intlHelper(intl, 'page.ikkeMyndig.banner.tittel'),
                        normalText: intlHelper(intl, 'page.ikkeMyndig.banner.tekst'),
                        bottomContent: (
                            <Lenke href={getLenker(intl.locale).papirskjemaPrivat} target="_blank">
                                <FormattedMessage id="page.ikkeMyndig.banner.lastNed" />
                            </Lenke>
                        ),
                    }}
                />
            )}>
            <Box margin="xxxl">
                <Innholdstittel>
                    <FormattedMessage id="page.ikkeMyndig.tittel" />
                </Innholdstittel>
            </Box>
        </Page>
    );
};

export default IkkeMyndigPage;
