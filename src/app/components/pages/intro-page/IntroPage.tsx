import * as React from 'react';
import { YesOrNo } from '../../../types/YesOrNo';
import Page from '../../page/Page';
import { default as YesOrNoQuestion } from '../../yes-or-no-question-base/YesOrNoQuestionBase';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';
import bemUtils from '../../../utils/bemUtils';
import Lenke from 'nav-frontend-lenker';
import Box from '../../box/Box';
import StepBanner from '../../step-banner/StepBanner';
import InformationPoster from '../../information-poster/InformationPoster';
import GoToApplicationLink from '../../go-to-application-link/GoToApplicationLink';
import './introPage.less';

const bem = bemUtils('introPage');
const IntroPage: React.FunctionComponent = () => {
    const [erSelvstendigNæringsdrivendeEllerFrilanser, setErSelvstendigNæringsdrivendeEllerFrilanser] = React.useState(
        YesOrNo.UNANSWERED
    );
    const [skalGraderePleiepenger, setSkalGraderePleiepenger] = React.useState(YesOrNo.UNANSWERED);

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

            <Box margin="xl" textAlignCenter={true}>
                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.YES && (
                    <CounsellorPanel>
                        Den digitale søknaden kan foreløpig ikke brukes av selvstendig næringsdrivende og frilansere. Du
                        fyller i stedet ut{' '}
                        <Lenke href="https://www.nav.no/no/Person/Skjemaer-for-privatpersoner/skjemaveileder/vedlegg?key=333802&languagecode=53&veiledertype=privatperson">
                            søknaden på papir
                        </Lenke>{' '}
                        og sender den i posten.
                    </CounsellorPanel>
                )}

                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && skalGraderePleiepenger === YesOrNo.YES && (
                    <CounsellorPanel>
                        Hvis barnet skal være noe i barnehage, skole eller liknende, kan du foreløpig ikke søke
                        digitalt. Du fyller i stedet ut{' '}
                        <Lenke href="https://www.nav.no/no/Person/Skjemaer-for-privatpersoner/skjemaveileder/vedlegg?key=333802&languagecode=53&veiledertype=privatperson">
                            søknaden på papir
                        </Lenke>{' '}
                        og sender den i posten.
                    </CounsellorPanel>
                )}

                {erSelvstendigNæringsdrivendeEllerFrilanser === YesOrNo.NO && skalGraderePleiepenger === YesOrNo.NO && (
                    <GoToApplicationLink />
                )}
            </Box>
        </Page>
    );
};

export default IntroPage;
