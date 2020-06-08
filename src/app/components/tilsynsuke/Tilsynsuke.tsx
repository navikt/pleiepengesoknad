import React from 'react';
import { useIntl } from 'react-intl';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import Box from 'common/components/box/Box';
import intlHelper from 'common/utils/intlUtils';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { validateTilsynstimerEnDag } from '../../validation/fieldValidations';
import './tilsynsuke.less';

interface Props {
    name: AppFormField;
}

const AppForm = getTypedFormComponents<AppFormField, PleiepengesøknadFormData>();

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
