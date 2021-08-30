import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { getOmsorgstilbudtimerValidatorEnDag } from '../../validation/fieldValidations';
import AppForm from '../app-form/AppForm';
import './omsorgstilbudUke.less';

interface Props {
    name: AppFormField;
}

const OmsorgstilbudUke = ({ name }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="omsorgstilbudUke">
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Mandager')}
                        name={`${name}.mandag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getOmsorgstilbudtimerValidatorEnDag(intlHelper(intl, 'mandag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Tirsdager')}
                        name={`${name}.tirsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getOmsorgstilbudtimerValidatorEnDag(intlHelper(intl, 'tirsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Onsdager')}
                        name={`${name}.onsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getOmsorgstilbudtimerValidatorEnDag(intlHelper(intl, 'onsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Torsdager')}
                        name={`${name}.torsdag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getOmsorgstilbudtimerValidatorEnDag(intlHelper(intl, 'torsdag'))}
                    />
                    <AppForm.TimeInput
                        label={intlHelper(intl, 'Fredager')}
                        name={`${name}.fredag` as AppFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={getOmsorgstilbudtimerValidatorEnDag(intlHelper(intl, 'fredag'))}
                    />
                </div>
            </Box>
        </>
    );
};

export default OmsorgstilbudUke;