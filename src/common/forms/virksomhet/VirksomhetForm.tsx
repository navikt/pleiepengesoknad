import React, { useState } from 'react';
import Box from 'common/components/box/Box';
import { Formik } from 'formik';
import { Systemtittel } from 'nav-frontend-typografi';
import { VirksomhetFormData } from './types';
import FormKnapperad from '../components/FormKnapperad';

interface Props {
    virksomhet?: VirksomhetFormData;
    minDato: Date;
    maksDato: Date;
    onSubmit: (oppdrag: VirksomhetFormData) => void;
    onCancel: () => void;
}

const initialValues: Partial<VirksomhetFormData> = {};

const VirksomhetForm: React.FunctionComponent<Props> = ({
    onCancel,
    virksomhet = initialValues,
    onSubmit,
    minDato,
    maksDato
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (values: VirksomhetFormData) => {
        onSubmit(values);
    };

    return (
        <Formik initialValues={virksomhet} onSubmit={onFormikSubmit} validateOnMount={true} validateOnChange={true}>
            {({ handleSubmit, isValid, setFieldValue, setFieldTouched, values }) => {
                return (
                    <form onSubmit={handleSubmit}>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">Frilansoppdrag</Systemtittel>
                        </Box>

                        <Box margin="xl">
                            <FormKnapperad
                                onSubmit={() => {
                                    setShowErrors(true);
                                    if (isValid) {
                                        onFormikSubmit(values as VirksomhetFormData);
                                    }
                                }}
                                onCancel={onCancel}
                            />
                        </Box>
                    </form>
                );
            }}
        </Formik>
    );
};

export default VirksomhetForm;
