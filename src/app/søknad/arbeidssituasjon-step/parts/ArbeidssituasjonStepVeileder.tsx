import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const ArbeidssituasjonStepVeileder: React.FunctionComponent = () => (
    <CounsellorPanel>
        <p>
            <FormattedMessage id="steg.arbeidssituasjon.veileder.1" />
        </p>
        <p>
            <FormattedMessage id="steg.arbeidssituasjon.veileder.2" />
        </p>
    </CounsellorPanel>
);

export default ArbeidssituasjonStepVeileder;
