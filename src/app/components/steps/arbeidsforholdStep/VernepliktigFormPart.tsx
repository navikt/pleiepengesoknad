import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';

const VernepliktigFormPart = () => {
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.harVærtEllerErVernepliktig}
                    legend="Har du hatt verneplikt de siste 28 dagene eller er du i en vernepliktig periode som varer i minst 28 dager?"
                    validate={validateYesOrNoIsAnswered}
                    description={<ExpandableInfo title={'Hva betyr dette?'}>Skal det være tekst her?</ExpandableInfo>}
                />
            </Box>
        </>
    );
};

export default VernepliktigFormPart;
