import * as React from 'react';
import FrontPageBanner from '../../front-page-banner/FrontPageBanner';
import Page from '../../page/Page';
import Lenke from 'nav-frontend-lenker';
import Box from '../../box/Box';
import { Innholdstittel } from 'nav-frontend-typografi';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import getLenker from 'app/lenker';
import './ikkeMyndigPage.less';

const IkkeMyndigPage: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
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
                    )
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

export default injectIntl(IkkeMyndigPage);
