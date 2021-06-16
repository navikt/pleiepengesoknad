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
                        label={intlHelper(intl, 'Mandager')}
                        name={`${name}.mandag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'mandag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Tirsdager')}
                        name={`${name}.tirsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'tirsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Onsdager')}
                        name={`${name}.onsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'onsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Torsdager')}
                        name={`${name}.torsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'torsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Fredager')}
                        name={`${name}.fredag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getTilsynstimerValidatorEnDag(intlHelper(intl, 'fredag'))}
                    />
                </div>
            </Box>
        </>
    );
};

export default Tilsynsuke;
