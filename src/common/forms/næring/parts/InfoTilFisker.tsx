import React from 'react';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';

interface Props {
    navnPåNæringen: string;
}

const InfoTilFisker: React.FunctionComponent<Props> = ({ navnPåNæringen }) => (
    <CounsellorPanel>
        Hvis du ikke har organisasjonsnummer, svarer du nei på spørsmålet "Er {navnPåNæringen} er registrert i Norge?" I
        nedtrekkslisten velger du at virksomheten er registrert i Norge.
    </CounsellorPanel>
);

export default InfoTilFisker;
