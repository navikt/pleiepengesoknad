import * as React from 'react';
import { Normaltekst, Innholdstittel } from 'nav-frontend-typografi';
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
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

interface WelcomingPageProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

interface WelcomingPageState {
    omPlikterModalOpen: boolean;
    omBehandlingAvPersonopplysningerModalOpen: boolean;
}

type Props = WelcomingPageProps & InjectedIntlProps & HistoryProps;

const nextStepRoute = `${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.OPPLYSNINGER_OM_BARNET}`;
class WelcomingPage extends React.Component<Props, WelcomingPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            omPlikterModalOpen: false,
            omBehandlingAvPersonopplysningerModalOpen: false
        };

        this.openPlikterModal = this.openPlikterModal.bind(this);
        this.closePlikterModal = this.closePlikterModal.bind(this);
    }

    componentDidUpdate(previousProps: Props) {
        if (userHasSubmittedValidForm(previousProps, this.props)) {
            const { history } = this.props;
            navigateTo(nextStepRoute, history);
        }
    }

    openPlikterModal() {
        this.setState({
            omPlikterModalOpen: true
        });
    }

    closePlikterModal() {
        this.setState({
            omPlikterModalOpen: false
        });
    }

    render() {
        const { handleSubmit, intl } = this.props;
        const { omPlikterModalOpen } = this.state;
        return (
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
                        <Innholdstittel className={bem.element('title')}>
                            {intlHelper(intl, 'introtittel')}
                        </Innholdstittel>
                        <Box margin="xl">
                            <Normaltekst>{intlHelper(intl, 'introtekst')}</Normaltekst>
                        </Box>

                        <form onSubmit={handleSubmit}>
                            <Box margin="l">
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
                                                <Lenke href="#" onClick={this.openPlikterModal}>
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
                        <DinePlikterModal
                            isOpen={omPlikterModalOpen}
                            onRequestClose={this.closePlikterModal}
                            contentLabel="Dine plikter"
                        />
                    </Page>
                )}
            </SøkerdataContextConsumer>
        );
    }
}

export default injectIntl(WelcomingPage);
