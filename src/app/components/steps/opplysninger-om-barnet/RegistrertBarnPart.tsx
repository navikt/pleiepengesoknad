import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import {
    AppFormField, initialValues, PleiepengesøknadFormData
} from '../../../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import { appIsRunningInDemoMode } from '../../../utils/envUtils';
import { validateValgtBarn } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

interface Props {
    søkersBarn: BarnReceivedFromApi[];
}

const RegistrertBarnPart: React.FunctionComponent<Props> = ({ søkersBarn }) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue
    } = useFormikContext<PleiepengesøknadFormData>();

    return (
        <>
            <AppForm.RadioPanelGroup
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                name={AppFormField.barnetSøknadenGjelder}
                useTwoColumns={true}
                radios={søkersBarn.map((barn) => {
                    const { fornavn, mellomnavn, etternavn, fodselsdato, aktoer_id } = barn;
                    const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                    return {
                        value: aktoer_id,
                        key: aktoer_id,
                        label: (
                            <>
                                <Normaltekst>{barnetsNavn}</Normaltekst>
                                <Normaltekst>
                                    <FormattedMessage
                                        id="steg.omBarnet.hvilketBarn.født"
                                        values={{ dato: prettifyDate(fodselsdato) }}
                                    />
                                </Normaltekst>
                            </>
                        ),
                        disabled: søknadenGjelderEtAnnetBarn
                    };
                })}
                validate={(value) => {
                    if (søknadenGjelderEtAnnetBarn) {
                        return undefined;
                    }
                    return validateValgtBarn(value);
                }}
            />
            {appIsRunningInDemoMode() === false && (
                <FormBlock margin="l">
                    <AppForm.Checkbox
                        label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                        name={AppFormField.søknadenGjelderEtAnnetBarn}
                        afterOnChange={(newValue) => {
                            if (newValue) {
                                resetFieldValue(AppFormField.barnetSøknadenGjelder, setFieldValue, initialValues);
                            } else {
                                resetFieldValues(
                                    [
                                        AppFormField.barnetsFødselsnummer,
                                        AppFormField.barnetHarIkkeFåttFødselsnummerEnda,
                                        AppFormField.barnetsFødselsdato,
                                        AppFormField.barnetsNavn
                                    ],
                                    setFieldValue,
                                    initialValues
                                );
                            }
                        }}
                    />
                </FormBlock>
            )}
        </>
    );
};

export default RegistrertBarnPart;
