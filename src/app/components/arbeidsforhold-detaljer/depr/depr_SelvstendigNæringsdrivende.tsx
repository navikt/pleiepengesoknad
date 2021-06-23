import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../config/minMaxValues';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdSNFField,
    Arbeidsform,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import ArbeidsformInfoSNFrilanser from './info/ArbeidsformInfoSNFrilanser';

interface Props {
    selvstendig_arbeidsforhold: Arbeidsforhold;
}

const SelvstendigDetaljer: React.FunctionComponent<Props> = ({ selvstendig_arbeidsforhold }) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdSNFField) => {
        return `${AppFormField.selvstendig_arbeidsforhold}.${field}` as AppFormField;
    };

    return (
        <>
            <FormBlock margin="none">
                <AppForm.RadioPanelGroup
                    legend={intlHelper(intl, 'selvstendig.arbeidsforhold.spm')}
                    name={getFieldName(ArbeidsforholdSNFField.arbeidsform)}
                    radios={[
                        {
                            label: intlHelper(intl, 'snFrilanser.arbeidsforhold.arbeidsform.fast'),
                            value: Arbeidsform.fast,
                        },
                        {
                            label: intlHelper(intl, 'snFrilanser.arbeidsforhold.arbeidsform.turnus'),
                            value: Arbeidsform.turnus,
                        },
                        {
                            label: intlHelper(intl, 'snFrilanser.arbeidsforhold.arbeidsform.varierende'),
                            value: Arbeidsform.varierende,
                        },
                    ]}
                    validate={getRequiredFieldValidator()}
                />
            </FormBlock>
            {selvstendig_arbeidsforhold?.arbeidsform !== undefined && (
                <Box margin="xl">
                    <AppForm.NumberInput
                        name={getFieldName(ArbeidsforholdSNFField.jobberNormaltTimer)}
                        suffix={intlHelper(
                            intl,
                            `snFrilanser.arbeidsforhold.arbeidsform.${selvstendig_arbeidsforhold.arbeidsform}.timer.suffix`
                        )}
                        suffixStyle="text"
                        description={
                            <div style={{ width: '100%' }}>
                                <Box margin="none" padBottom="m">
                                    {selvstendig_arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                        <Box margin="m">
                                            <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.fast} />
                                        </Box>
                                    )}
                                    {selvstendig_arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                        <>
                                            <Box margin="m">
                                                <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.turnus} />
                                            </Box>
                                        </>
                                    )}
                                    {selvstendig_arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                        <>
                                            <Box margin="m">
                                                <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.varierende} />
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </div>
                        }
                        bredde="XS"
                        label={intlHelper(
                            intl,
                            `snFrilanser.arbeidsforhold.iDag.${selvstendig_arbeidsforhold.arbeidsform}.spm`
                        )}
                        validate={(value) => {
                            const error = getNumberValidator({
                                required: true,
                                min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                            })(value);
                            if (error) {
                                return {
                                    key: `validation.selvstendig_arbeidsforhold.jobberNormaltTimer.${selvstendig_arbeidsforhold.arbeidsform}.${error}`,
                                    values: {
                                        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                    },
                                    keepKeyUnaltered: true,
                                };
                            }
                            return error;
                        }}
                        value={selvstendig_arbeidsforhold.arbeidsform || ''}
                    />
                </Box>
            )}
        </>
    );
};

export default SelvstendigDetaljer;
