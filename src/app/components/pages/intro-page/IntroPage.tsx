import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { navigateToSoknadFrontpage } from '../../../utils/navigationUtils';
import IntroForm from './IntroForm';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';

const bem = bemUtils('introPage');

const IntroPage = () => {
    const intl = useIntl();
    const history = useHistory();
    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'page.intro.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'page.intro.stegTittel')} />}>
            <Box margin="xxxl" padBottom="m">
                <InformationPoster>
                    <p>
                        <FormattedMessage id="page.intro.text.1" />
                    </p>
                    <ul>
                        <li>
                            <FormattedMessage id="page.intro.text.2.a" />
                            <br />
                            <div style={{ margin: '.5rem 0' }}>
                                <FormattedMessage id="page.intro.text.2.b" />
                            </div>
                        </li>
                        <li>
                            <FormattedMessage id="page.intro.text.2.c" />
                        </li>
                    </ul>
                    <Element tag="h3">
                        <FormattedMessage id="page.intro.text.3" />
                    </Element>
                    <p>
                        <FormattedMessage id="page.intro.text.4" />
                    </p>
                    <p>
                        <FormattedMessage id="page.intro.text.5" />
                    </p>
                    <p>
                        <FormattedMessage id="page.intro.text.6.a" />{' '}
                        <Lenke href={getLenker(intl.locale).papirskjemaPrivat}>
                            <FormattedMessage id="page.intro.text.6.b" />
                        </Lenke>
                        <FormattedMessage id="page.intro.text.6.c" />
                    </p>
                </InformationPoster>
            </Box>
            <FormBlock>
                <IntroForm
                    onValidSubmit={() => {
                        setTimeout(() => {
                            navigateToSoknadFrontpage(history);
                        });
                    }}
                />
            </FormBlock>
        </Page>
    );
};

export default IntroPage;
