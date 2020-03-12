import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import { RadioPanelGruppe } from 'nav-frontend-skjema';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import InformationPoster from 'common/components/information-poster/InformationPoster';
import Page from 'common/components/page/Page';
import StepBanner from 'common/components/step-banner/StepBanner';
import { YesOrNo } from 'common/types/YesOrNo';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import getLenker from '../../../lenker';
import GoToApplicationLink from '../../go-to-application-link/GoToApplicationLink';
import './introPage.less';

const bem = bemUtils('introPage');

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
                            value: YesOrNo.YES
                        },
                        {
                            label: 'Nei',
                            value: YesOrNo.NO
                        }
                    ]}
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
