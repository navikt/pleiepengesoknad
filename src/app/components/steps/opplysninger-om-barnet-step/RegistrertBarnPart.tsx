import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { resetFieldValue, resetFieldValues, SkjemagruppeQuestion } from '@navikt/sif-common-formik';
import { useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import { AppFormField, initialValues, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import AppForm from '../../app-form/AppForm';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    søkersBarn: BarnReceivedFromApi[];
}

const RegistrertBarnPart = ({ søkersBarn }: Props) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue,
    } = useFormikContext<PleiepengesøknadFormData>();

    return (
        <SkjemagruppeQuestion>
            <AppForm.RadioPanelGroup
                name={AppFormField.barnetSøknadenGjelder}
                legend={intlHelper(intl, 'steg.omBarnet.hvilketBarn.spm')}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'steg.omBarnet.hvilketBarn.description.tittel')}>
                        <p>
                            <FormattedMessage id={'steg.omBarnet.hvilketBarn.description.info.1'} />
                        </p>
                        <p>
                            <FormattedMessage id={'steg.omBarnet.hvilketBarn.description.info.2'} />
                        </p>
                        <p>
                            <FormattedMessage id={'steg.omBarnet.hvilketBarn.description.info.3'} />
                        </p>
                    </ExpandableInfo>
                }
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
                validate={søknadenGjelderEtAnnetBarn ? undefined : getRequiredFieldValidator()}
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
        </SkjemagruppeQuestion>
    );
};

export default RegistrertBarnPart;
