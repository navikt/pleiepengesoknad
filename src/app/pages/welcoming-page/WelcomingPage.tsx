import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FrontPageBanner from '@navikt/sif-common-core/lib/components/front-page-banner/FrontPageBanner';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Sidetittel, Undertittel } from 'nav-frontend-typografi';
import OmSøknaden from '../../components/om-søknaden/OmSøknaden';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { StepConfigProps } from '../../søknad/søknadStepsConfig';
import { ImportertSøknad } from '../../types/ImportertSøknad';
import BehandlingAvPersonopplysningerContent from './behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'> & {
    forrigeSøknad?: ImportertSøknad;
};
interface DialogState {
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

const WelcomingPage: React.FunctionComponent<Props> = ({ onValidSubmit, forrigeSøknad }) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { behandlingAvPersonopplysningerModalOpen } = dialogState;
    const søkerdata = useContext(SøkerdataContext);
    const { søker } = søkerdata || {};
    const intl = useIntl();

    useLogSidevisning(SIFCommonPageKey.velkommen);
    const utenIllustrasjon = 1 + 1 === 2;

    return (
        <div data-testid="welcomePage">
            <Page
                title={intlHelper(intl, 'welcomingPage.sidetittel')}
                className={bem.block}
                topContentRenderer={
                    utenIllustrasjon
                        ? () => <StepBanner text={intlHelper(intl, 'application.title')} tag="h1" />
                        : () => (
                              <FrontPageBanner
                                  bannerSize="large"
                                  counsellorWithSpeechBubbleProps={{
                                      strongText: intlHelper(intl, 'welcomingPage.banner.tittel'),
                                      normalText: intlHelper(intl, 'welcomingPage.banner.tekst'),
                                  }}
                              />
                          )
                }>
                {utenIllustrasjon === false && (
                    <Box margin="xxl">
                        <Sidetittel className={bem.element('title')}>
                            <FormattedMessage id="welcomingPage.introtittel" />
                        </Sidetittel>
                    </Box>
                )}
                {utenIllustrasjon === true && (
                    <Box margin="xxl">
                        <CounsellorPanel kompakt={true}>
                            <Undertittel>Hei{søker ? ` ${søker.fornavn}` : ''}!</Undertittel>
                            <p>
                                Velkommen til søknad om pleiepenger for sykt barn. Du får veiledning underveis om hva du
                                skal fylle ut og hvordan
                            </p>
                            <p>
                                Vi tar vare på svarene dine i 72 timer. Så, hvis du innenfor den tiden for eksempel vil
                                ta en pause eller blir automatisk logget ut, fortsetter du der du var når du kommer
                                tilbake.
                            </p>
                            <p>
                                Du må svare på alle spørsmålene for å kunne gå videre. Hvis du mangler etterspurt
                                dokumentasjon, kan du ettersende det så snart du kan.
                            </p>
                        </CounsellorPanel>
                    </Box>
                )}

                <OmSøknaden />

                <SamtykkeForm onConfirm={onValidSubmit} forrigeSøknad={forrigeSøknad} />
            </Page>

            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>
        </div>
    );
};

export default WelcomingPage;
