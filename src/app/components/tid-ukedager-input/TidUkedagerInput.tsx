import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FormikTimeInput } from '@navikt/sif-common-formik/lib';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import './tidUkedagerInput.less';

interface Props {
    name: string;
    validator?: (dagnavn: string) => ValidationFunction<ValidationError>;
}

const TidUkedagerInput = ({ name, validator }: Props) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <div className="tidUkedagerInput">
                    <FormikTimeInput
                        label={intlHelper(intl, 'Mandager')}
                        name={`${name}.mandag`}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'mandag')) : undefined}
                    />
                    <FormikTimeInput
                        label={intlHelper(intl, 'Tirsdager')}
                        name={`${name}.tirsdag`}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'tirsdag')) : undefined}
                    />
                    <FormikTimeInput
                        label={intlHelper(intl, 'Onsdager')}
                        name={`${name}.onsdag`}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'onsdag')) : undefined}
                    />
                    <FormikTimeInput
                        label={intlHelper(intl, 'Torsdager')}
                        name={`${name}.torsdag`}
                        timeInputLayout={{
                            direction: 'vertical',
                            compact: true,
                        }}
                        validate={validator ? validator(intlHelper(intl, 'torsdag')) : undefined}
                    />
                    <FormikTimeInput
                        label={intlHelper(intl, 'Fredager')}
                        name={`${name}.fredag`}
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

export default TidUkedagerInput;
