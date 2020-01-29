import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import BekreftDialog from '../bekreft-dialog/BekreftDialog';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
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
            <Undertittel tag="h1">
                <FormattedMessage id="fortsettSøknadSenereDialog.tittel" />
            </Undertittel>
            <p>
                <FormattedMessage id="fortsettSøknadSenereDialog.intro" />
            </p>
            <p>
                <FormattedMessage id="fortsettSøknadSenereDialog.spørsmål" />
            </p>
        </BekreftDialog>
    );
};
export default FortsettSøknadSenereDialog;
