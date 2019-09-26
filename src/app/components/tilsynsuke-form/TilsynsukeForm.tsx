import React from 'react';
import { Field } from '../../types/PleiepengesøknadFormData';
import TimeInput from '../time-input/TimeInput';

import './tilsynsukeDager.less';
import Box from '../box/Box';

const TilsynsukeForm: React.FunctionComponent<{}> = () => {
    return (
        <Box padBottom="xxl">
            <div className="tilsynsukeDager">
                <TimeInput label="Mandag" name={`${Field.tilsynsordning}.mandag` as Field} />
                <TimeInput label="Tirsdag" name={`${Field.tilsynsordning}.tirsdag` as Field} />
                <TimeInput label="Onsdag" name={`${Field.tilsynsordning}.onsdag` as Field} />
                <TimeInput label="Torsdag" name={`${Field.tilsynsordning}.torsdag` as Field} />
                <TimeInput label="Fredag" name={`${Field.tilsynsordning}.fredag` as Field} />
            </div>
        </Box>
    );
};

export default TilsynsukeForm;
