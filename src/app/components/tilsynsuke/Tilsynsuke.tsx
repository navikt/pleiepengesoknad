import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { validateTilsynstimerEnDag } from '../../validation/fieldValidations';
import AppForm from '../app-form/AppForm';
import './tilsynsuke.less';

interface Props {
    name: AppFormField;
}

const Tilsynsuke = ({ name }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="tilsynsuke">
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Mandag')}
                        name={`${name}.mandag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Tirsdag')}
                        name={`${name}.tirsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Onsdag')}
                        name={`${name}.onsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Torsdag')}
                        name={`${name}.torsdag` as AppFormField}
                        validate={validateTilsynstimerEnDag}
                    />
                    <AppForm.TimeInput
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
