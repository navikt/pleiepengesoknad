import * as React from 'react';
import { YesOrNo } from '../../../types/YesOrNo';
import Page from '../../page/Page';
import { default as YesOrNoQuestion } from '../../yes-or-no-question-base/YesOrNoQuestionBase';
import ContentSwitcher from '../../content-switcher/ContentSwitcher';
import GoToApplicationLink from '../../go-to-application-link/GoToApplicationLink';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';
import bemUtils from '../../../utils/bemUtils';
import './introPage.less';
import Lenke from 'nav-frontend-lenker';
import Box from '../../box/Box';
import StepBanner from '../../step-banner/StepBanner';
import InformationPoster from '../../information-poster/InformationPoster';

const bem = bemUtils('introPage');
const IntroPage: React.FunctionComponent = () => {
    const [erSelvstendigNæringsdrivendeEllerFrilanser, setErSelvstendigNæringsdrivendeEllerFrilanser] = React.useState(
        YesOrNo.UNANSWERED
    );
    const [skalGraderePleiepenger, setSkalGraderePleiepenger] = React.useState(YesOrNo.UNANSWERED);

    const hasCompletedForm =
        erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES ||
        (erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && skalGraderePleiepenger !== YesOrNo.UNANSWERED);

    return (
        <Page
            className={bem.className}
            title="Søknad om pleiepenger - intro"
            topContentRenderer={() => <StepBanner text="Kan jeg bruke den digitale pleiepengesøknaden?" />}>
            <Box margin="xxxl">
                <InformationPoster>
                    Den digitale søknaden er under utvikling og kan foreløpig ikke brukes av alle. Svar på to spørsmål,
                    så får du vite om du kan søke digitalt.
                </InformationPoster>
            </Box>

            <Box margin="xl">
                <YesOrNoQuestion
                    legend="Er du selvstendig næringsdrivende eller frilanser?"
                    name="erDuSelvstendigNæringsdrivendeEllerFrilanser"
                    checked={erSelvstendigNæringsdrivendeEllerFrilanser}
                    onChange={(value) => setErSelvstendigNæringsdrivendeEllerFrilanser(value)}
                />
            </Box>

            {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && (
                <YesOrNoQuestion
                    legend="Forventer du at barnet kan være noe i barnehage, skole eller liknende?"
                    name="planleggerDuÅGraderePleiepenger"
                    checked={skalGraderePleiepenger}
                    onChange={(value) => setSkalGraderePleiepenger(value)}
                />
            )}

            {hasCompletedForm && (
                <Box margin="xl" textAlignCenter={true}>
                    <ContentSwitcher
                        firstContent={() => (
                            <CounsellorPanel>
                                Om du planlegger å gradere pleiepenger, eller du er selvstendig næringsdrivende eller
                                frilanser, må du{' '}
                                <Lenke href="https://www.nav.no/no/Person/Skjemaer-for-privatpersoner/skjemaveileder/vedlegg?key=333802&languagecode=53&veiledertype=privatperson">
                                    søke på papir
                                </Lenke>{' '}
                                og sende i posten.
                            </CounsellorPanel>
                        )}
                        secondContent={() => <GoToApplicationLink />}
                        showFirstContent={
                            skalGraderePleiepenger === YesOrNo.YES ||
                            erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES
                        }
                    />
                </Box>
            )}
        </Page>
    );
};

export default IntroPage;
