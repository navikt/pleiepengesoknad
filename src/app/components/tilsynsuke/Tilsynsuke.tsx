import React from 'react';
import TimeInput from '../time-input/TimeInput';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { validateTilsynstimerEnDag } from '../../validation/fieldValidations';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import Box from 'common/components/box/Box';

import './tilsynsuke.less';

interface Props {
    name: AppFormField;
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
                        name={`${name}.mandag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Tirsdag')}
                        name={`${name}.tirsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Onsdag')}
                        name={`${name}.onsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Torsdag')}
                        name={`${name}.torsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <TimeInput
                        label={intlHelper(intl, 'Fredag')}
                        name={`${name}.fredag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                </div>
            </Box>
        </>
    );
};

export default injectIntl(Tilsynsuke);
