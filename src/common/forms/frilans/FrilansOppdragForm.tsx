import React from 'react';
import { FrilansOppdragFormData } from './types';

interface Props {
    oppdrag?: FrilansOppdragFormData;
}

const FrilansOppdragForm: React.FunctionComponent<Props> = ({ oppdrag }) => <div>Oppdrag</div>;

export default FrilansOppdragForm;
