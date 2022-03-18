import React from 'react';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
}

const InfoJobberLiktHverUke: React.FunctionComponent<Props> = () => {
    return (
        <ExpandableInfo title="Hva betyr dette?">
            <p>
                Vi trenger å vite hvordan og hvor mye du normalt jobber når du ikke har fravær på grunn av pleiepenger.
            </p>
            <ul style={{ paddingInlineStart: '20px' }}>
                <li>
                    Hvis du jobber et fast antall timer hver uke i hele perioden, velger du at hver uke er lik, og
                    legger inn hvor mye du jobber de ulike ukedagene.
                </li>
                <li>
                    Hvis du jobber turnus eller har annen varierende arbeidstid, velger du at det varierer og legger inn
                    et snitt per uke.
                </li>
            </ul>
        </ExpandableInfo>
    );
};
export default InfoJobberLiktHverUke;
