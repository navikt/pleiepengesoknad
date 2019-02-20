import * as React from 'react';
import { YesOrNo } from '../../../types/YesOrNo';
import Page from '../../page/Page';
import StepBanner from '../../step-banner/StepBanner';
import YesOrNoQuestionBase from '../../yes-or-no-question-base/YesOrNoQuestionBase';

const IntroPage: React.FunctionComponent = () => {
    const [erSelvstendigNæringsdrivende, setErSelvstendigNæringsdrivende] = React.useState(YesOrNo.UNANSWERED);
    const [erFrilanser, setErFrilanser] = React.useState(YesOrNo.UNANSWERED);
    const [skalGraderePleiepenger, setSkalGraderePleiepenger] = React.useState(YesOrNo.UNANSWERED);

    return (
        <Page
            title="Søknad om pleiepenger - intro"
            topContentRenderer={() => <StepBanner text="Søknad om pleiepenger" />}>
            <YesOrNoQuestionBase
                legend="Er du selvstendig næringsdrivende?"
                name="erDuSelvstendigNæringsdrivende"
                checked={erSelvstendigNæringsdrivende}
                onChange={(value) => setErSelvstendigNæringsdrivende(value)}
            />

            <YesOrNoQuestionBase
                legend="Er du frilanser?"
                name="erDuFrilanser"
                checked={erFrilanser}
                onChange={(value) => setErFrilanser(value)}
            />

            <YesOrNoQuestionBase
                legend="Planlegger du å gradere pleiepenger?"
                name="planleggerDuÅGraderePleiepenger"
                checked={skalGraderePleiepenger}
                onChange={(value) => setSkalGraderePleiepenger(value)}
            />
        </Page>
    );
};

export default IntroPage;
