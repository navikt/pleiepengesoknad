import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Normaltekst, Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import Page from '../../../components/page/Page';
import bemHelper from '../../../utils/bemHelper';
import './welcomingPage.less';
import Box from '../../../components/box/Box';
import intlHelper from '../../../utils/intlHelper';
import InjectedIntlProps = ReactIntl.InjectedIntlProps;
import { HistoryProps } from '../../../types/History';
import ConfirmationCheckboxPanel from '../../confirmation-checkbox-panel/ConfirmationCheckboxPanel';
import { Field } from '../../../types/PleiepengesøknadFormData';
import { navigateTo } from '../../../utils/navigationHelper';
import routeConfig from '../../../config/routeConfig';
import { StepID } from '../../../config/stepConfig';

const bem = bemHelper('welcomingPage');

interface WelcomingPageProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = WelcomingPageProps & InjectedIntlProps & HistoryProps;
const nextStepRoute = `${routeConfig.SØKNAD_ROUTE_PREFIX}/${StepID.TIDSROM}`;

class WelcomingPage extends React.Component<Props> {
    componentDidUpdate(previousProps: Props) {
        if (previousProps.isSubmitting === true && this.props.isSubmitting === false && this.props.isValid === true) {
            const { history } = this.props;
            navigateTo(nextStepRoute, history);
        }
    }

    render() {
        const { handleSubmit, intl } = this.props;
        return (
            <Page title="Velkommen til søknad om pleiepenger" className={bem.className}>
                <Innholdstittel className={bem.element('title')}>{intlHelper(intl, 'introtittel')}</Innholdstittel>
                <Box margin="m">
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
                            {intlHelper(intl, 'forståttrettigheterogplikter')}
                        </ConfirmationCheckboxPanel>
                    </Box>
                    <Box margin="l">
                        <Hovedknapp className={bem.element('startApplicationButton')}>
                            {intlHelper(intl, 'begynnsøknad')}
                        </Hovedknapp>
                    </Box>
                </form>
            </Page>
        );
    }
}

export default injectIntl(WelcomingPage);
