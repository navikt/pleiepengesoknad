import React, { useState } from 'react';
import Box from 'common/components/box/Box';
import { Formik } from 'formik';
import { Systemtittel } from 'nav-frontend-typografi';
import { NæringFormData } from './types';
import FormKnapperad from '../components/FormKnapperad';

interface Props {
    næring?: NæringFormData;
    minDato: Date;
    maksDato: Date;
    onSubmit: (oppdrag: NæringFormData) => void;
    onCancel: () => void;
}

const initialValues: Partial<NæringFormData> = {};

const NæringForm: React.FunctionComponent<Props> = ({
    onCancel,
    næring = initialValues,
    onSubmit,
    minDato,
    maksDato
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (values: NæringFormData) => {
        onSubmit(values);
    };

    return (
        <Formik initialValues={næring} onSubmit={onFormikSubmit} validateOnMount={true} validateOnChange={true}>
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
                                        onFormikSubmit(values as NæringFormData);
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

export default NæringForm;
