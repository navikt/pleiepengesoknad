import React from 'react';
import { FormattedMessage } from 'react-intl';
import SifGuidePanel from '@navikt/sif-common-core-ds/lib/components/sif-guide-panel/SifGuidePanel';
import { Systemtittel, Ingress } from 'nav-frontend-typografi';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';

interface Props {
    navn: string;
}

const VelkommenGuide: React.FunctionComponent<Props> = ({ navn }) => (
    <SifGuidePanel>
        <Systemtittel tag="h1">
            <FormattedMessage id="page.velkommen.guide.tittel" values={{ navn }} />
        </Systemtittel>
        <Block margin="l">
            <Ingress>
                <FormattedMessage id="page.velkommen.guide.ingress" />
            </Ingress>
        </Block>
        <p>
            <FormattedMessage id="page.velkommen.guide.tekst.1" />
        </p>
        <p>
            <FormattedMessage id="page.velkommen.guide.tekst.2" />
        </p>
    </SifGuidePanel>
);

export default VelkommenGuide;
