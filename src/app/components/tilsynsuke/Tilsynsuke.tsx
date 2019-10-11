import React from 'react';
import TimeInput from '../time-input/TimeInput';
import { Field } from '../../types/PleiepengesøknadFormData';
import { validateTilsynstimerEnDag } from '../../validation/fieldValidations';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import intlHelper from '../../utils/intlUtils';
import Box from '../box/Box';

import './tilsynsuke.less';

interface Props {
    name: Field;
}

const Tilsynsuke: React.FunctionComponent<Props & InjectedIntlProps> = ({ name, intl }) => {
    return (
        <>
            {/* <CounsellorPanel>
                <FormattedMessage id="steg.tilsyn.tilsynsuke.veileder" />
            </CounsellorPanel> */}
            <Box margin="l">
                <div className="tilsynsuke">
                    <TimeInput
                        label={intlHelper(intl, 'Mandag')}
                        name={`${name}.mandag` as Field}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Tirsdag')}
                        name={`${name}.tirsdag` as Field}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Onsdag')}
                        name={`${name}.onsdag` as Field}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Torsdag')}
                        name={`${name}.torsdag` as Field}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Fredag')}
                        name={`${name}.fredag` as Field}
                        validate={validateTilsynstimerEnDag}
                    />
                </div>
            </Box>
        </>
    );
};

export default injectIntl(Tilsynsuke);
