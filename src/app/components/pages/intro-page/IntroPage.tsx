import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import InformationPoster from '@navikt/sif-common-core/lib/components/information-poster/InformationPoster';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import StepBanner from '@navikt/sif-common-core/lib/components/step-banner/StepBanner';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik';
import Lenke from 'nav-frontend-lenker';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import getLenker from '../../../lenker';
import GoToApplicationLink from '../../go-to-application-link/GoToApplicationLink';

const bem = bemUtils('introPage');

const IntroPage = () => {
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
            <Box margin="xxxl" padBottom="m">
                <CounsellorPanel>
                    <p>
                        <FormattedHtmlMessage id="introPage.info.1" />
                    </p>
                    <p>
                        <FormattedMessage id="introPage.info.2" />
                    </p>
                    <p>
                        <Lenke
                            href="https://www.nav.no/familie/sykdom-i-familien/nb/pleiepenger-for-sykt-barn#Hvem-kan-fa-pleiepenger"
                            target="_blank">
                            <FormattedMessage id="introPage.info.3" />
                        </Lenke>
                    </p>
                    <p>
                        <FormattedMessage id="introPage.info.4.1" />{' '}
                        <Lenke href="https://www.nav.no/familie/sykdom-i-familien/nb/omsorgspenger" target="_blank">
                            <FormattedMessage id="introPage.info.4.2" />
                        </Lenke>
                        <FormattedMessage id="introPage.info.4.3" />
                    </p>
                </CounsellorPanel>
            </Box>

            <Box margin="xxxl">
                <InformationPoster>
                    <FormattedMessage id={`introPage.tekst${withoutTilsynTextKey}`} />
                </InformationPoster>
            </Box>
            <Box margin="xl">
                <RadioPanelGruppe
                    className={'twoColumnPanelGruppe'}
                    legend={intlHelper(intl, 'introPage.spm.selvstendigEllerFrilanser')}
                    name="erDuSelvstendigNæringsdrivendeEllerFrilanser"
                    checked={erSelvstendigNæringsdrivendeEllerFrilanser}
                    onChange={(evt, value) => setErSelvstendigNæringsdrivendeEllerFrilanser(value)}
                    radios={[
                        {
                            label: 'Ja',
                            value: YesOrNo.YES,
                        },
                        {
                            label: 'Nei',
                            value: YesOrNo.NO,
                        },
                    ]}
                />
            </Box>
            <Box margin="xl" textAlignCenter={true}>
                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES && (
                    <CounsellorPanel>
                        <div data-cy="erSelvstendigEllerFrilanser">
                            <FormattedMessage
                                id={`introPage.veileder.erSelvstendigEllerFrilanser${withoutTilsynTextKey}`}
                            />{' '}
                            <FormattedMessage
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
