import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { resetFieldValue, resetFieldValues } from '@navikt/sif-common-formik/lib';
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
