import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../../config/minMaxValues';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdSNFField,
    Arbeidsform,
} from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import ArbeidsformInfoSNFrilanser from '../info/ArbeidsformInfoSNFrilanser';

interface Props {
    frilans_arbeidsforhold: Arbeidsforhold;
}

const FrilansDetaljer: React.FunctionComponent<Props> = ({ frilans_arbeidsforhold }) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdSNFField) => {
        return `${AppFormField.frilans_arbeidsforhold}.${field}` as AppFormField;
    };

    return (
        <Box margin="xl">
            <FormBlock margin="none">
                <AppForm.RadioPanelGroup
                    legend={intlHelper(intl, 'frilanser.arbeidsforhold.arbeidsform.spm')}
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
            {frilans_arbeidsforhold?.arbeidsform !== undefined && (
                <Box margin="xl">
                    <AppForm.NumberInput
                        name={getFieldName(ArbeidsforholdSNFField.jobberNormaltTimer)}
                        suffix={intlHelper(
                            intl,
                            `snFrilanser.arbeidsforhold.arbeidsform.${frilans_arbeidsforhold.arbeidsform}.timer.suffix`
                        )}
                        suffixStyle="text"
                        description={
                            <div style={{ width: '100%' }}>
                                <Box margin="none" padBottom="m">
                                    {frilans_arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                        <Box margin="m">
                                            <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.fast} />
                                        </Box>
                                    )}
                                    {frilans_arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                        <>
                                            <Box margin="m">
                                                <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.turnus} />
                                            </Box>
                                        </>
                                    )}
                                    {frilans_arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
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
                            `snFrilanser.arbeidsforhold.iDag.${frilans_arbeidsforhold.arbeidsform}.spm`
                        )}
                        validate={(value) => {
                            const error = getNumberValidator({
                                required: true,
                                min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                            })(value);
                            if (error) {
                                return {
                                    key: `validation.frilans_arbeidsforhold.jobberNormaltTimer.${frilans_arbeidsforhold.arbeidsform}.${error}`,
                                    values: {
                                        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                    },
                                    keepKeyUnaltered: true,
                                };
                            }
                            return error;
                        }}
                        value={frilans_arbeidsforhold.arbeidsform || ''}
                    />
                </Box>
            )}
        </Box>
    );
};

export default FrilansDetaljer;
