import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@sif-common/core/components/form-block/FormBlock';
import { prettifyDate } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { formatName } from '@sif-common/core/utils/personUtils';
import { resetFieldValue, resetFieldValues } from '@sif-common/formik/';
import { useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import { AppFormField, initialValues, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateValgtBarn } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import { Barn } from '../../../types/ListeAvBarn';

interface Props {
    søkersBarn: Barn[];
}

const RegistrertBarnPart = ({ søkersBarn }: Props) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue,
    } = useFormikContext<PleiepengesøknadFormData>();

    return (
        <>
            <AppForm.RadioPanelGroup
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                name={AppFormField.barnetSøknadenGjelder}
                useTwoColumns={true}
                radios={søkersBarn.map((barn) => {
                    const { fornavn, mellomnavn, etternavn, fødselsdato, aktørId } = barn;
                    const barnetsNavn = formatName(fornavn, etternavn, mellomnavn);
                    return {
                        value: aktørId,
                        key: aktørId,
                        label: (
                            <>
                                <Normaltekst>{barnetsNavn}</Normaltekst>
                                <Normaltekst>
                                    <FormattedMessage
                                        id="steg.omBarnet.hvilketBarn.født"
                                        values={{ dato: prettifyDate(fødselsdato) }}
                                    />
                                </Normaltekst>
                            </>
                        ),
                        disabled: søknadenGjelderEtAnnetBarn,
                    };
                })}
                validate={(value) => {
                    if (søknadenGjelderEtAnnetBarn) {
                        return undefined;
                    }
                    return validateValgtBarn(value);
                }}
            />
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
                                    AppFormField.barnetsNavn,
                                ],
                                setFieldValue,
                                initialValues
                            );
                        }
                    }}
                />
            </FormBlock>
        </>
    );
};

export default RegistrertBarnPart;
