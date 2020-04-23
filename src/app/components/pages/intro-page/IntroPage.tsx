import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import { default as YesOrNoQuestion } from 'common/form-components/yes-or-no-question-base/YesOrNoQuestionBase';
import { YesOrNo } from 'common/types/YesOrNo';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from '../../../lenker';
import GoToApplicationLink from '../../go-to-application-link/GoToApplicationLink';
import './introPage.less';

const bem = bemUtils('introPage');

const showSystemUnstabilityMessage = false;

const IntroPage: React.StatelessComponent = () => {
    const [erSelvstendigNæringsdrivendeEllerFrilanser, setErSelvstendigNæringsdrivendeEllerFrilanser] = React.useState(
        YesOrNo.UNANSWERED
    );
    const withoutTilsynTextKey = '.utenTilsyn';
    const intl = useIntl();

    return (
        <Page
            className={bem.block}
            title={intlHelper(intl, 'introPage.tittel')}
            topContentRenderer={() => <StepBanner text={intlHelper(intl, 'introPage.stegTittel')} />}>
            {showSystemUnstabilityMessage && (
                <Box margin="xxl">
                    <AlertStripeAdvarsel>
                        <Lenke href="https://www.nav.no/no/driftsmeldinger/ustabilitet-pa-nav.no-soendag-15mars">
                            Ustabile selvbetjeningstjenester søndag 15. mars
                        </Lenke>
                        .
                    </AlertStripeAdvarsel>
                </Box>
            )}
            <Box margin="xxxl" padBottom="m">
                <CounsellorPanel>
                    <p>
                        Regelverket for pleiepenger er <strong>ikke</strong> endret i forhold til koronasituasjonen.
                    </p>
                    <p>
                        For å få pleiepenger må barnet være sykt, eller under utredning for sykdom, og på grunn av dette
                        trenge pleie hele tiden. Barnet må også ha vært til behandling/utredning i sykehus eller annen
                        spesialisthelsetjeneste. Du kan ikke få pleiepenger for å forebygge eventuell sykdom.
                    </p>
                    <p>
                        <Lenke href="https://www.nav.no/familie/sykdom-i-familien/nb/pleiepenger-for-sykt-barn#Hvem-kan-fa-pleiepenger">
                            Les mer her om hvem som kan ha rett på pleiepenger for sykt barn
                        </Lenke>
                    </p>
                    <p>
                        Hvis barnet ditt ikke kan gå i barnehage eller skole på grunn av særlige smittevernhensyn i
                        forhold til koronaviruset kan du ha rett til å bruke omsorgsdager fram til og med 30. juni 2020.
                        Det kan være av smittevernhensyn til barnet eller andre familiemedlemmer som bor med barnet.{' '}
                        <Lenke href="https://www.nav.no/familie/sykdom-i-familien/nb/omsorgspenger">
                            Les mer om hvem som har rett på omsorgsdager her
                        </Lenke>
                        .
                    </p>
                </CounsellorPanel>
            </Box>

            <Box margin="xxxl">
                <InformationPoster>
                    <FormattedMessage id={`introPage.tekst${withoutTilsynTextKey}`} />
                </InformationPoster>
            </Box>
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'introPage.spm.selvstendigEllerFrilanser')}
                    name="erDuSelvstendigNæringsdrivendeEllerFrilanser"
                    checked={erSelvstendigNæringsdrivendeEllerFrilanser}
                    onChange={(value) => setErSelvstendigNæringsdrivendeEllerFrilanser(value)}
                />
            </Box>
            <Box margin="xl" textAlignCenter={true}>
                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES && (
                    <CounsellorPanel>
                        <div data-cy="erSelvstendigEllerFrilanser">
                            <FormattedHTMLMessage
                                id={`introPage.veileder.erSelvstendigEllerFrilanser${withoutTilsynTextKey}`}
                            />{' '}
                            <FormattedHTMLMessage
                                id={`introPage.veileder.papirLenke${withoutTilsynTextKey}.html`}
                                values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                            />
                        </div>
                    </CounsellorPanel>
                )}
                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && <GoToApplicationLink />}
            </Box>
        </Page>
    );
};

export default IntroPage;
