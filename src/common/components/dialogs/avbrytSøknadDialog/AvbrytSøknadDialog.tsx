import * as React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import BekreftDialog from '../bekreft-dialog/BekreftDialog';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import intlHelper from '../../../utils/intlUtils';

export interface Props {
    synlig: boolean;
    onAvbrytSøknad: () => void;
    onFortsettSøknad: () => void;
}

const AvbrytSøknadDialog: React.FunctionComponent<Props> = (props) => {
    const intl = useIntl();
    const { synlig, onFortsettSøknad, onAvbrytSøknad: onFortsettSøknadSenere } = props;
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
            <Undertittel tag="h1">
                <FormattedMessage id="avbrytSøknadDialog.tittel" />
            </Undertittel>
            <p>
                <FormattedMessage id="avbrytSøknadDialog.intro" />
            </p>
            <p>
                <FormattedMessage id="avbrytSøknadDialog.spørsmål" />
            </p>
        </BekreftDialog>
    );
};
export default AvbrytSøknadDialog;
