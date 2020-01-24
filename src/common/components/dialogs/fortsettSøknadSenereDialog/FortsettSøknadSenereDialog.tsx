import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import BekreftDialog from '../bekreft-dialog/BekreftDialog';
import Box from '../../box/Box';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import intlHelper from 'common/utils/intlUtils';
export interface Props {
    synlig: boolean;
    onFortsettSøknadSenere: () => void;
    onFortsettSøknad: () => void;
}

const FortsettSøknadSenereDialog: React.FunctionComponent<Props> = (props) => {
    const intl = useIntl();
    const { synlig, onFortsettSøknad, onFortsettSøknadSenere } = props;
    return (
        <BekreftDialog
            isOpen={synlig}
            bekreftLabel={intlHelper(intl, 'fortsettSøknadSenereDialog.avbrytSøknadLabel')}
            avbrytLabel={intlHelper(intl, 'fortsettSøknadSenereDialog.fortsettSøknadLabel')}
            closeButton={false}
            contentLabel={intlHelper(intl, 'fortsettSøknadSenereDialog.tittel')}
            onBekreft={onFortsettSøknadSenere}
            størrelse="30"
            onRequestClose={onFortsettSøknad}>
            <Box margin="s">
                <Undertittel tag="h1"><FormattedMessage id="fortsettSøknadSenereDialog.tittel" /></Undertittel>
            </Box>
            <Box margin="s">
                <Normaltekst><FormattedMessage id="fortsettSøknadSenereDialog.intro" /></Normaltekst>
            </Box>
            <Normaltekst><FormattedMessage id="fortsettSøknadSenereDialog.spørsmål" /></Normaltekst>
        </BekreftDialog>
    );
};
export default FortsettSøknadSenereDialog;