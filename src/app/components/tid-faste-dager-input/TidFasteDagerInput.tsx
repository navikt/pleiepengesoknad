import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import './tidFasteDagerInput.less';

interface Props {
    name: AppFormField;
    validator?: (dagnavn: string) => ValidationFunction<ValidationError>;
}

const TidFasteDagerInput = ({ name, validator }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="tidFasteDagerInput">
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Mandager')}
                        name={`${name}.mandag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'mandag')) : undefined}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Tirsdager')}
                        name={`${name}.tirsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'tirsdag')) : undefined}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Onsdager')}
                        name={`${name}.onsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'onsdag')) : undefined}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Torsdager')}
                        name={`${name}.torsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'torsdag')) : undefined}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Fredager')}
                        name={`${name}.fredag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'mandag')) : undefined}
                    />
                </div>
            </Box>
        </>
    );
};

export default TidFasteDagerInput;
