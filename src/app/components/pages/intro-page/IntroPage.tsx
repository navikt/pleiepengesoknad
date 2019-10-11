import * as React from 'react';
import { YesOrNo } from '../../../types/YesOrNo';
import Page from '../../page/Page';
import { default as YesOrNoQuestion } from '../../yes-or-no-question-base/YesOrNoQuestionBase';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';
import bemUtils from '../../../utils/bemUtils';
import Box from '../../box/Box';
import StepBanner from '../../step-banner/StepBanner';
import InformationPoster from '../../information-poster/InformationPoster';
import GoToApplicationLink from '../../go-to-application-link/GoToApplicationLink';
import { FormattedMessage, InjectedIntlProps, injectIntl, FormattedHTMLMessage } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import getLenker from '../../../lenker';
import './introPage.less';
import { isFeatureEnabled, Feature } from '../../../utils/featureToggleUtils';

const bem = bemUtils('introPage');

const IntroPage: React.StatelessComponent<InjectedIntlProps> = ({ intl }) => {
    const [erSelvstendigNæringsdrivendeEllerFrilanser, setErSelvstendigNæringsdrivendeEllerFrilanser] = React.useState(
        YesOrNo.UNANSWERED
    );
    const [skalGraderePleiepenger, setSkalGraderePleiepenger] = React.useState(YesOrNo.UNANSWERED);
    const withoutTilsynTextKey = isFeatureEnabled(Feature.TOGGLE_TILSYN) === true ? '.utenTilsyn' : '';

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
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'introPage.spm.selvstendigEllerFrilanser')}
                    name="erDuSelvstendigNæringsdrivendeEllerFrilanser"
                    checked={erSelvstendigNæringsdrivendeEllerFrilanser}
                    onChange={(value) => setErSelvstendigNæringsdrivendeEllerFrilanser(value)}
                />
            </Box>
            {isFeatureEnabled(Feature.TOGGLE_TILSYN) === false &&
                erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && (
                    <Box margin="xl">
                        <YesOrNoQuestion
                            legend={intlHelper(intl, 'introPage.spm.barnehageEllerSkole')}
                            name="planleggerDuÅGraderePleiepenger"
                            checked={skalGraderePleiepenger}
                            onChange={(value) => setSkalGraderePleiepenger(value)}
                        />
                    </Box>
                )}
            <Box margin="xl" textAlignCenter={true}>
                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES && (
                    <CounsellorPanel>
                        <FormattedHTMLMessage
                            id={`introPage.veileder.erSelvstendigEllerFrilanser${withoutTilsynTextKey}`}
                        />{' '}
                        <FormattedHTMLMessage
                            id={`introPage.veileder.papirLenke${withoutTilsynTextKey}.html`}
                            values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                        />
                    </CounsellorPanel>
                )}

                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && skalGraderePleiepenger === YesOrNo.YES && (
                    <CounsellorPanel>
                        <FormattedMessage id="introPage.veileder.skalIBarnehageEllerSkole" />{' '}
                        <FormattedHTMLMessage
                            id="introPage.veileder.papirLenke.html"
                            values={{ url: getLenker(intl.locale).papirskjemaPrivat }}
                        />
                    </CounsellorPanel>
                )}

                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO &&
                    (skalGraderePleiepenger === YesOrNo.NO || isFeatureEnabled(Feature.TOGGLE_TILSYN) === true) && (
                        <GoToApplicationLink />
                    )}
            </Box>
        </Page>
    );
};

export default injectIntl(IntroPage);
