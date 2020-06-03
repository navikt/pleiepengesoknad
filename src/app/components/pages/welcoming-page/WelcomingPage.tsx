import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import { Sidetittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import FrontPageBanner from 'common/components/front-page-banner/FrontPageBanner';
import Page from 'common/components/page/Page';
import bemHelper from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import BehandlingAvPersonopplysningerModal from '../../behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import DinePlikterModal from '../../dine-plikter-modal/DinePlikterModal';
import LegeerklæringInformationPanel from '../../legeerklæring-information-panel/LegeerklæringInformationPanel';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'>;

const WelcomingPage: React.StatelessComponent<Props> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const [dinePlikterModalOpen, setDinePlikterModalOpen] = React.useState(false);
    const [behandlingAvPersonopplysningerModalOpen, setBehandlingAvPersonopplysningerModalOpen] = React.useState(false);

    return (
        <>
            <Page
                title={intlHelper(intl, 'welcomingPage.sidetittel')}
                className={bem.block}
                topContentRenderer={() => (
                    <FrontPageBanner
                        bannerSize="large"
                        counsellorWithSpeechBubbleProps={{
                            strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                            normalText: intlHelper(intl, 'welcomingPage.banner.tekst')
                        }}
                    />
                )}>
                <Box margin="xxl">
                    <Sidetittel className={bem.element('title')}>
                        <FormattedMessage id="welcomingPage.introtittel" />
                    </Sidetittel>
                </Box>

                <Box margin="xl">
                    <LegeerklæringInformationPanel>
                        <FormattedMessage
                            id="welcomingPage.legeerklæring.html"
                            values={{ p: (msg: string) => <p>{msg}</p> }}
                        />
                    </LegeerklæringInformationPanel>
                </Box>

                <SamtykkeForm onConfirm={onValidSubmit} onOpenDinePlikterModal={() => setDinePlikterModalOpen(true)} />

                <Box margin="xl" className={bem.element('personopplysningModalLenke')}>
                    <ActionLink onClick={() => setBehandlingAvPersonopplysningerModalOpen(true)}>
                        <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                    </ActionLink>
                </Box>
            </Page>

            <DinePlikterModal
                isOpen={dinePlikterModalOpen}
                onRequestClose={() => setDinePlikterModalOpen(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
            />

            <BehandlingAvPersonopplysningerModal
                isOpen={behandlingAvPersonopplysningerModalOpen}
                onRequestClose={() => setBehandlingAvPersonopplysningerModalOpen(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
            />
        </>
    );
};

export default WelcomingPage;
