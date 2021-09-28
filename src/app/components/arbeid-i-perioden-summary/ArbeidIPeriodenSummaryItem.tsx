import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { ArbeidsforholdApiData } from '../../types/PleiepengesøknadApiData';

interface Props {
    item: ArbeidIPeriodenSummaryItemType;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodenSummaryItem: React.FunctionComponent<Props> = ({ item }) => {
    return (
        <>
            <Element tag="h3">{item.tittel}</Element>
        </>
    );
};

export default ArbeidIPeriodenSummaryItem;
