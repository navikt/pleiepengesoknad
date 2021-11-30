import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../../søknad/SøknadFormComponents';
import './tidFasteDagerInput.less';

interface Props {
    name: SøknadFormField;
    validator?: (dagnavn: string) => ValidationFunction<ValidationError>;
}

const TidFasteDagerInput = ({ name, validator }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="tidFasteDagerInput">
                    <SøknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Mandager')}
                        name={`${name}.mandag` as SøknadFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'mandag')) : undefined}
                    />
                    <SøknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Tirsdager')}
                        name={`${name}.tirsdag` as SøknadFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'tirsdag')) : undefined}
                    />
                    <SøknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Onsdager')}
                        name={`${name}.onsdag` as SøknadFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'onsdag')) : undefined}
                    />
                    <SøknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Torsdager')}
                        name={`${name}.torsdag` as SøknadFormField}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'torsdag')) : undefined}
                    />
                    <SøknadFormComponents.TimeInput
                        label={intlHelper(intl, 'Fredager')}
                        name={`${name}.fredag` as SøknadFormField}
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
