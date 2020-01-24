import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import BekreftDialog from '../bekreft-dialog/BekreftDialog';
import Box from '../../box/Box';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import Normaltekst from 'nav-frontend-typografi/lib/normaltekst';
import intlHelper from '../../../utils/intlUtils';

export interface Props {
    synlig: boolean;
    onFortsettSøknadSenere: () => void;
    onFortsettSøknad: () => void;
}

const AvbrytSøknadDialog:React.FunctionComponent<Props> = (props) => {
    const intl = useIntl();
    const { synlig, onFortsettSøknad, onFortsettSøknadSenere } = props;
    return (
        <BekreftDialog
            isOpen={synlig}
            bekreftLabel={intlHelper(intl, 'avbrytSøknadDialog.avbrytSøknadLabel')}
            avbrytLabel={intlHelper(intl, 'avbrytSøknadDialog.fortsettSøknadLabel')}
            closeButton={false}
            contentLabel={intlHelper(intl, 'avbrytSøknadDialog.tittel')}
            onBekreft={onFortsettSøknadSenere}
            størrelse="30"
            onRequestClose={onFortsettSøknad}>
            <Box margin="m">
                <Undertittel tag="h1"><FormattedMessage id="avbrytSøknadDialog.tittel" /></Undertittel>
            </Box>
            <Box margin="m">
                <Normaltekst><FormattedMessage id="avbrytSøknadDialog.intro" /></Normaltekst>
            </Box>
            <Normaltekst><FormattedMessage id="avbrytSøknadDialog.spørsmål" /></Normaltekst>
        </BekreftDialog>
    );
};
export default AvbrytSøknadDialog;