import React from 'react';
import Page from 'common/components/page/Page';
import NæringForm from 'common/forms/næring/NæringForm';
import { Panel } from 'nav-frontend-paneler';

interface Props {}

const Workbench: React.FunctionComponent<Props> = (props) => (
    <Page title="Workbench">
        <h1>Skjema for næring</h1>
        <Panel>
            <NæringForm onSubmit={() => null} onCancel={() => null} />
        </Panel>
    </Page>
);

export default Workbench;
