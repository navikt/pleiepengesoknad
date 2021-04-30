import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';

const VernepliktigFormPart = () => {
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.harVærtEllerErVernepliktig}
                    legend={intlHelper(intl, 'steg.arbeidsforhold.verneplikt.spm')}
                    validate={getYesOrNoValidator()}
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
