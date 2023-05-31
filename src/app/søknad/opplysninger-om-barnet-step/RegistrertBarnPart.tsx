import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core-ds/lib/atoms/form-block/FormBlock';
import { prettifyDate } from '@navikt/sif-common-utils';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core-ds/lib/utils/personUtils';
import { resetFieldValue, resetFieldValues, SkjemagruppeQuestion } from '@navikt/sif-common-formik-ds';
import { useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import { SøknadFormField, initialValues, SøknadFormValues } from '../../types/SøknadFormValues';
import SøknadFormComponents from '../SøknadFormComponents';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik-ds/lib/validation';
import ExpandableInfo from '@navikt/sif-common-core-ds/lib/components/expandable-info/ExpandableInfo';
import { RegistrerteBarn } from '../../types';

interface Props {
    søkersBarn: RegistrerteBarn[];
}

const RegistrertBarnPart = ({ søkersBarn }: Props) => {
    const intl = useIntl();
    const {
        values: { søknadenGjelderEtAnnetBarn },
        setFieldValue,
    } = useFormikContext<SøknadFormValues>();

    return (
        <SkjemagruppeQuestion legend="TODO">
            <SøknadFormComponents.RadioGroup
                name={SøknadFormField.barnetSøknadenGjelder}
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
                <SøknadFormComponents.Checkbox
                    label={intlHelper(intl, 'steg.omBarnet.gjelderAnnetBarn')}
                    name={SøknadFormField.søknadenGjelderEtAnnetBarn}
                    afterOnChange={(newValue) => {
                        if (newValue) {
                            resetFieldValue(SøknadFormField.barnetSøknadenGjelder, setFieldValue, initialValues);
                        } else {
                            resetFieldValues(
                                [
                                    SøknadFormField.barnetsFødselsnummer,
                                    SøknadFormField.barnetsFødselsdato,
                                    SøknadFormField.barnetsNavn,
                                    SøknadFormField.årsakManglerIdentitetsnummer,
                                    SøknadFormField.barnetHarIkkeFnr,
                                    SøknadFormField.relasjonTilBarnet,
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
