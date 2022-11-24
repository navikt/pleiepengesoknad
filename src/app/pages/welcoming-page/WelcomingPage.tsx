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
import { Sidetittel, Systemtittel } from 'nav-frontend-typografi';
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
                            <Systemtittel>Hei{søker ? ` ${søker.fornavn}` : ''}!</Systemtittel>
                            <p>Velkommen til søknad om pleiepenger for sykt barn.</p>
                            <p>
                                Denne søknaden er for deg som må være borte fra jobb for å ta vare på et barn, eller en
                                person over 18 år, som på grunn av sykdom trenger pleie og omsorg hele tiden.
                            </p>
                            <p>
                                Når søknaden gjelder et barn, må barnet ha vært til behandling/utredning i sykehus,
                                eller annen spesialisthelsetjeneste. Gjelder søknaden en person over 18 år, må personen
                                være utviklingshemmet og svært alvorlig syk.
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
