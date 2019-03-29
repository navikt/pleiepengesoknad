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
import routeConfig from '../../../config/routeConfig';
import { StepID } from '../../../config/stepConfig';
import { userHasSubmittedValidForm } from '../../../utils/formikUtils';
import FrontPageBanner from '../../front-page-banner/FrontPageBanner';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import DinePlikterModal from '../../dine-plikter-modal/DinePlikterModal';
import BehandlingAvPersonopplysningerModal from '../../behandling-av-personopplysninger-modal/BehandlingAvPersonopplysningerModal';
import LegeerklæringInformationPanel from '../../legeerklæring-information-panel/LegeerklæringInformationPanel';
import './welcomingPage.less';

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

type Props = WelcomingPageProps & InjectedIntlProps & HistoryProps;

const nextStepRoute = `${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`;
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
            const { history } = this.props;
            navigateTo(nextStepRoute, history);
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
                <SøkerdataContextConsumer>
                    {({ person: { fornavn } }: Søkerdata) => (
                        <Page
                            title="Søknad om pleiepenger"
                            className={bem.className}
                            topContentRenderer={() => (
                                <FrontPageBanner
                                    counsellorWithSpeechBubbleProps={{
                                        strongText: `Hei ${fornavn}!`,
                                        normalText: 'Velkommen til søknad om pleiepenger for pleie av sykt barn.'
                                    }}
                                />
                            )}>
                            <Box margin="xxl">
                                <Sidetittel className={bem.element('title')}>
                                    {intlHelper(intl, 'introtittel')}
                                </Sidetittel>
                            </Box>
                            <Box margin="xl">
                                <LegeerklæringInformationPanel text="Har du legeerklæringen klar? Du trenger den senere i søknaden. Da tar du bare et bilde av den og laster opp." />
                            </Box>
                            <form onSubmit={handleSubmit}>
                                <Box margin="xl">
                                    <ConfirmationCheckboxPanel
                                        label={intlHelper(intl, 'jajegsamtykker')}
                                        name={Field.harGodkjentVilkår}
                                        validate={(value) => {
                                            let result;
                                            if (value !== true) {
                                                result = 'Du må godkjenne vilkårene';
                                            }
                                            return result;
                                        }}>
                                        <FormattedMessage
                                            id="forståttrettigheterogplikter"
                                            values={{
                                                plikterLink: (
                                                    <Lenke href="#" onClick={this.openDinePlikterModal}>
                                                        dine plikter.
                                                    </Lenke>
                                                )
                                            }}
                                        />
                                        <Box margin="l">{intlHelper(intl, 'omlagring')}</Box>
                                    </ConfirmationCheckboxPanel>
                                </Box>
                                <Box margin="xl">
                                    <Hovedknapp className={bem.element('startApplicationButton')}>
                                        {intlHelper(intl, 'begynnsøknad')}
                                    </Hovedknapp>
                                </Box>
                            </form>

                            <Box margin="xl" className={bem.element('personopplysningModalLenke')}>
                                <Lenke href="#" onClick={this.openBehandlingAvPersonopplysningerModal}>
                                    Les om hvordan NAV behandler personopplysningene dine
                                </Lenke>
                            </Box>
                        </Page>
                    )}
                </SøkerdataContextConsumer>
                <DinePlikterModal
                    isOpen={dinePlikterModalOpen}
                    onRequestClose={this.closeDinePlikterModal}
                    contentLabel="Om dine plikter"
                />
                <BehandlingAvPersonopplysningerModal
                    isOpen={behandlingAvPersonopplysningerModalOpen}
                    onRequestClose={this.closeBehandlingAvPersonopplysningerModal}
                    contentLabel="Om behandling av personopplysninger"
                />
            </>
        );
    }
}

export default injectIntl(WelcomingPage);
