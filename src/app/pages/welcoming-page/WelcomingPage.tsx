import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
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
import DinePlikterContent from './dine-plikter-content/DinePlikterContent';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'> & {
    forrigeSøknad?: ImportertSøknad;
};
interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

const WelcomingPage: React.FunctionComponent<Props> = ({ onValidSubmit, forrigeSøknad }) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
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
                            <p>Jeg er her for å veilede deg gjennom søknaden om pleiepenger for sykt barn.</p>
                            <p>
                                Svarene dine tar vi vare på underveis, så dersom du ønsker å ta en pause, eller blir
                                avbrutt, fortsetter du der du var når du kommer tilbake til søknaden.
                            </p>
                        </CounsellorPanel>
                    </Box>
                )}

                <OmSøknaden />

                <SamtykkeForm
                    onConfirm={onValidSubmit}
                    forrigeSøknad={forrigeSøknad}
                    onOpenDinePlikterModal={() => setDialogState({ dinePlikterModalOpen: true })}
                />

                <Box margin="xl" className={bem.element('personopplysningModalLenke')}>
                    <ActionLink onClick={() => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                        <FormattedMessage id="welcomingPage.personopplysninger.lenketekst" />
                    </ActionLink>
                </Box>
            </Page>

            <InfoDialog
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={(): void => setDialogState({ dinePlikterModalOpen: false })}>
                <DinePlikterContent />
            </InfoDialog>

            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>

            {/* <DinePlikterModal
                isOpen={dinePlikterModalOpen}
                onRequestClose={() => setDinePlikterModalOpen(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.omDinePlikter.tittel')}
            />

            <BehandlingAvPersonopplysningerModal
                isOpen={behandlingAvPersonopplysningerModalOpen}
                onRequestClose={() => setBehandlingAvPersonopplysningerModalOpen(false)}
                contentLabel={intlHelper(intl, 'welcomingPage.modal.behandlingAvPersonalia.tittel')}
            /> */}
        </div>
    );
};

export default WelcomingPage;
