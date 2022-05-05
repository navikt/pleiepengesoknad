import React from 'react';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
}

const InfoArbeiderLiktHverUke: React.FunctionComponent<Props> = () => {
    return (
        <ExpandableInfo title="Hva betyr dette?">
            <p>
                Her lurer vi på om du jobber like mange timer hver uke, eller om det varierer hvor mye du jobber fra uke
                til uke.
            </p>
            <p>
                Hvis du for eksempel hver uke jobber 30 timer, svarer du ja på dette spørsmålet. Hvis det varierer hvor
                mange timer du jobber per uke, svarer du nei.
            </p>
        </ExpandableInfo>
    );
};
export default InfoArbeiderLiktHverUke;
