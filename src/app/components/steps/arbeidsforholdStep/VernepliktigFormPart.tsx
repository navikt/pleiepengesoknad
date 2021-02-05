import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { validateYesOrNoIsAnswered } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { FormattedMessage, useIntl } from 'react-intl';

const VernepliktigFormPart = () => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.harVærtEllerErVernepliktig}
                    legend={intlHelper(intl, 'steg.arbeidsforhold.verneplikt.spm')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'steg.arbeidsforhold.verneplikt.info.tittel')}>
                            <FormattedMessage id="steg.arbeidsforhold.verneplikt.info.tekst" />
                        </ExpandableInfo>
                    }
                />
            </Box>
        </>
    );
};

export default VernepliktigFormPart;
