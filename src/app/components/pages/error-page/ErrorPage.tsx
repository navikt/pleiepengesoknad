import * as React from 'react';
import Page from '../../page/Page';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import Box from '../../box/Box';

const ErrorPage: React.FunctionComponent = () => (
    <Page title="Feil">
        <Innholdstittel>Noe gikk galt...</Innholdstittel>
        <Box margin="l">
            <Normaltekst>Beklager, her har det dessverre skjedd en feil.</Normaltekst>
        </Box>
    </Page>
);

export default ErrorPage;
