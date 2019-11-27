import * as React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import Page from '../../../components/page/Page';
import bemHelper from '../../../utils/bemUtils';
import Box from '../../../components/box/Box';
import intlHelper from '../../../utils/intlUtils';
import { HistoryProps } from '../../../types/History';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepConfigProps } from '../../../config/stepConfig';
import { userHasSubmittedValidForm } from '../../../utils/formikUtils';
import FrontPageBanner from '../../front-page-banner/FrontPageBanner';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import DinePlikterModal from '../../dine-plikter-modal/DinePlikterModal';
import BehandlingAvPersonopplysningerModal from '../../behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import LegeerklæringInformationPanel from '../../legeerklæring-information-panel/LegeerklæringInformationPanel';
import './welcomingPage.less';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';

const bem = bemHelper('welcomingPage');

interface WelcomingPageProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

interface WelcomingPageState {
    dinePlikterModalOpen: boolean;
    behandlingAvPersonopplysningerModalOpen: boolean;
}

type Props = WelcomingPageProps & InjectedIntlProps & HistoryProps & StepConfigProps;

class WelcomingPage extends React.Component<Props, WelcomingPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dinePlikterModalOpen: false,
            behandlingAvPersonopplysningerModalOpen: false
        };

        this.openDinePlikterModal = this.openDinePlikterModal.bind(this);
        this.closeDinePlikterModal = this.closeDinePlikterModal.bind(this);
        this.openBehandlingAvPersonopplysningerModal = this.openBehandlingAvPersonopplysningerModal.bind(this);
        this.closeBehandlingAvPersonopplysningerModal = this.closeBehandlingAvPersonopplysningerModal.bind(this);
    }

    componentDidUpdate(previousProps: Props) {
        if (userHasSubmittedValidForm(previousProps, this.props)) {
            const { history, nextStepRoute } = this.props;
            if (nextStepRoute) {
                navigateTo(nextStepRoute, history);
            }
        }
    }

    openDinePlikterModal() {
        this.setState({
            dinePlikterModalOpen: true
        });
    }

    closeDinePlikterModal() {
        this.setState({
            dinePlikterModalOpen: false
        });
    }

    openBehandlingAvPersonopplysningerModal() {
        this.setState({
            behandlingAvPersonopplysningerModalOpen: true
        });
    }

    closeBehandlingAvPersonopplysningerModal() {
        this.setState({
            behandlingAvPersonopplysningerModalOpen: false
        });
    }

    render() {
        const { handleSubmit, intl } = this.props;
        const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = this.state;
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

                    {appIsRunningInDemoMode() === false && (
                        <Box margin="xl">
                            <LegeerklæringInformationPanel text={intlHelper(intl, 'welcomingPage.legeerklæring')} />
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box margin="xl">
                            <ConfirmationCheckboxPanel
                                label={intlHelper(intl, 'welcomingPage.samtykke.tekst')}
                                name={Field.harForståttRettigheterOgPlikter}
                                validate={(value) => {
                                    let result;
                                    if (value !== true) {
                                        result = intlHelper(intl, 'welcomingPage.samtykke.harIkkeGodkjentVilkår');
                                    }
                                    return result;
                                }}>
                                <FormattedMessage
                                    id="welcomingPage.samtykke.harForståttLabel"
                                    values={{
                                        plikterLink: (
                                            <Lenke href="#" onClick={this.openDinePlikterModal}>
                                                {intlHelper(intl, 'welcomingPage.samtykke.harForståttLabel.lenketekst')}
                                            </Lenke>
                                        )
                                    }}
                                />
                            </ConfirmationCheckboxPanel>
                        </Box>
                        <Box margin="xl">
                            <Hovedknapp className={bem.element('startApplicationButton')}>
                                {intlHelper(intl, 'welcomingPage.begynnsøknad')}
                            </Hovedknapp>
                        </Box>
                    </form>

                    <Box margin="xl" className={bem.element('personopplysningModalLenke')}>
                        <Lenke href="#" onClick={this.openBehandlingAvPersonopplysningerModal}>
                            <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                        </Lenke>
                    </Box>
                </Page>
                <DinePlikterModal
                    isOpen={dinePlikterModalOpen}
                    onRequestClose={this.closeDinePlikterModal}
                    contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
                />
                <BehandlingAvPersonopplysningerModal
                    isOpen={behandlingAvPersonopplysningerModalOpen}
                    onRequestClose={this.closeBehandlingAvPersonopplysningerModal}
                    contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
                />
            </>
        );
    }
}

export default injectIntl(WelcomingPage);
