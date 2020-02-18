import React from 'react';
import Page from 'common/components/page/Page';
import NæringForm from 'common/forms/næring/NæringForm';

interface Props {}

const Workbench: React.FunctionComponent<Props> = (props) => (
    <Page title="Workbench">
        <h1>Skjema for næring</h1>
        <NæringForm onSubmit={() => null} onCancel={() => null} />
    </Page>
);

export default Workbench;
