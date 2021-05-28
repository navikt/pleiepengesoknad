import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { getTilsynstimerValidatorEnDag } from '../../validation/fieldValidations';
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
                        timeInputLayout={{
                            layout: 'compact',
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'mandag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Tirsdag')}
                        name={`${name}.tirsdag` as AppFormField}
                        timeInputLayout={{
                            layout: 'compact',
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'tirsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Onsdag')}
                        name={`${name}.onsdag` as AppFormField}
                        timeInputLayout={{
                            layout: 'compact',
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'onsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Torsdag')}
                        name={`${name}.torsdag` as AppFormField}
                        timeInputLayout={{
                            layout: 'compact',
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'torsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Fredag')}
                        name={`${name}.fredag` as AppFormField}
                        timeInputLayout={{
                            layout: 'compact',
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'fredag'))}
                    />
                </div>
            </Box>
        </>
    );
};

export default Tilsynsuke;
