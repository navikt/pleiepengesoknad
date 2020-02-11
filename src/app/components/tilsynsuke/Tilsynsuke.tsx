import React from 'react';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { validateTilsynstimerEnDag } from '../../validation/fieldValidations';
import { useIntl } from 'react-intl';
import intlHelper from 'common/utils/intlUtils';
import Box from 'common/components/box/Box';
import FormikTimeInput from 'common/formik/formik-time-input/FormikTimeInput';

import './tilsynsuke.less';

interface Props {
    name: AppFormField;
}

const Tilsynsuke: React.FunctionComponent<Props> = ({ name }) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="tilsynsuke">
                    <FormikTimeInput<AppFormField>
                        label={intlHelper(intl, 'Mandag')}
                        name={`${name}.mandag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <FormikTimeInput<AppFormField>
                        label={intlHelper(intl, 'Tirsdag')}
                        name={`${name}.tirsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <FormikTimeInput<AppFormField>
                        label={intlHelper(intl, 'Onsdag')}
                        name={`${name}.onsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <FormikTimeInput<AppFormField>
                        label={intlHelper(intl, 'Torsdag')}
                        name={`${name}.torsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <FormikTimeInput<AppFormField>
                        label={intlHelper(intl, 'Fredag')}
                        name={`${name}.fredag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                </div>
            </Box>
        </>
    );
};

export default Tilsynsuke;
