import React from 'react';
import { FormattedMessage } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';

const ArbeidssituasjonStepVeileder: React.FunctionComponent = () => (
    <CounsellorPanel>
        <p>
            <FormattedMessage id="steg.arbeidssituasjon.veileder.1" />
        </p>
        <p>
            <FormattedHtmlMessage id="steg.arbeidssituasjon.veileder.2" />
        </p>
        <p>
            <FormattedMessage id="steg.arbeidssituasjon.veileder.3" />
        </p>
        <p>
            <FormattedMessage id="steg.arbeidssituasjon.veileder.4" />
        </p>
    </CounsellorPanel>
);

export default ArbeidssituasjonStepVeileder;
