import React from 'react';
import { FrilansOppdragFormData } from './types';

interface Props {
    oppdrag: FrilansOppdragFormData;
}

const FrilansOppdragList: React.FunctionComponent<Props> = (props) => <div>Liste over oppdrag</div>;

export default FrilansOppdragList;
