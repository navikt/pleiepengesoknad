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
                    <FormattedMessage id="page.intro.text.1" tagName="p" />
                    <FormattedMessage id="page.intro.text.2" tagName="p" />
                    <FormattedMessage id="page.intro.text.3" tagName="p" />
                    <FormattedMessage id="page.intro.text.4" tagName="p" />
                    <FormattedMessage id="page.intro.text.5" tagName="p" />
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
