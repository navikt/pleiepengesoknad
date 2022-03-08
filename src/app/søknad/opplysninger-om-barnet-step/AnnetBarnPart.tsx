import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik/lib';
import {
    getFødselsnummerValidator,
    getRequiredFieldValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { Undertittel } from 'nav-frontend-typografi';
import { BarnRelasjon } from '../../types';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { validateNavn } from '../../validation/fieldValidations';
import SøknadFormComponents from '../SøknadFormComponents';
import InfoForFarVedNyttBarn from './info/InfoForFarVedNyttBarn';

interface Props {
    formValues: SøknadFormData;
    søkersFødselsnummer: string;
}

const AnnetBarnPart: React.FunctionComponent<Props> = ({ formValues, søkersFødselsnummer }) => {
    const intl = useIntl();

    return (
        <Box margin="xl">
            <SkjemagruppeQuestion
                legend={
                    <Undertittel tag="h2" style={{ display: 'inline-block', fontSize: '1.125rem' }}>
                        {intlHelper(intl, 'steg.omBarnet.annetBarn.tittel')}
                    </Undertittel>
                }>
                <SøknadFormComponents.Input
                    label={intlHelper(intl, 'steg.omBarnet.fnr.spm')}
                    name={SøknadFormField.barnetsFødselsnummer}
                    validate={getFødselsnummerValidator({
                        required: true,
                        disallowedValues: [søkersFødselsnummer],
                    })}
                    bredde="XL"
                    type="tel"
                    maxLength={11}
                />

                <FormBlock>
                    <SøknadFormComponents.Input
                        label={intlHelper(intl, 'steg.omBarnet.navn')}
                        name={SøknadFormField.barnetsNavn}
                        validate={validateNavn}
                        bredde="XL"
                    />
                </FormBlock>
                <FormBlock>
                    <SøknadFormComponents.RadioGroup
                        legend={intlHelper(intl, 'steg.omBarnet.relasjon.spm')}
                        name={SøknadFormField.relasjonTilBarnet}
                        radios={Object.keys(BarnRelasjon).map((relasjon) => ({
                            label: intlHelper(intl, `barnRelasjon.${relasjon}`),
                            value: relasjon,
                        }))}
                        validate={getRequiredFieldValidator()}
                        checked={formValues.relasjonTilBarnet}></SøknadFormComponents.RadioGroup>
                </FormBlock>
                {formValues.relasjonTilBarnet === BarnRelasjon.FAR && (
                    <Box margin="m">
                        <InfoForFarVedNyttBarn />
                    </Box>
                )}
                {formValues.relasjonTilBarnet === BarnRelasjon.ANNET && (
                    <FormBlock>
                        <SøknadFormComponents.Textarea
                            label={intlHelper(intl, 'steg.omBarnet.relasjonAnnet.spm')}
                            description={
                                <>
                                    <ExpandableInfo title={intlHelper(intl, 'steg.omBarnet.relasjonAnnet.info.tittel')}>
                                        <FormattedMessage
                                            tagName="div"
                                            id="steg.omBarnet.relasjonAnnet.info.hjelpetekst.1"
                                        />
                                        <FormattedMessage
                                            tagName="p"
                                            id="steg.omBarnet.relasjonAnnet.info.hjelpetekst.2"
                                        />
                                        <FormattedMessage
                                            tagName="p"
                                            id="steg.omBarnet.relasjonAnnet.info.hjelpetekst.3"
                                        />
                                    </ExpandableInfo>
                                </>
                            }
                            name={SøknadFormField.relasjonTilBarnetBeskrivelse}
                            validate={(value) => {
                                const error = getStringValidator({ required: true, maxLength: 2000 })(value);
                                return error
                                    ? {
                                          key: error,
                                          values: { min: 0, maks: 2000 },
                                      }
                                    : undefined;
                            }}
                            value={formValues.relasjonTilBarnet || ''}
                        />
                    </FormBlock>
                )}
            </SkjemagruppeQuestion>
        </Box>
    );
};
export default AnnetBarnPart;
