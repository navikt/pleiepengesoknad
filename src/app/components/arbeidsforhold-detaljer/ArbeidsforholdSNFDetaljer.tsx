import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../config/minMaxValues';
import {
    AppFormField,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdSNF,
    ArbeidsforholdSNFField,
    Arbeidsform,
} from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import ArbeidsformInfoSNFrilanser from './info/ArbeidsformInfoSNFrilanser';
import RedusertArbeidsforholdSNFDetaljerPart, {
    FrilansEllerSelvstendig,
} from './RedusertArbeidsforholdSNFDetaljerPart';

interface Props {
    snF_arbeidsforhold: ArbeidsforholdSNF;
    appFormField: AppFormField;
    frilansEllerSelvstendig: FrilansEllerSelvstendig;
}

const ArbeidsforholdSNFDetaljer = ({ appFormField, snF_arbeidsforhold, frilansEllerSelvstendig }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdSNFField) => `${appFormField}.${field}` as AppFormField;

    const hvaBetyrDetteTekst =
        appFormField === AppFormField.frilans_arbeidsforhold
            ? intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.frilanser.info')
            : intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.SN.info');

    return (
        <>
            <Box margin="xl">
                <FormBlock margin="none">
                    <AppForm.RadioPanelGroup
                        legend={intlHelper(intl, `${frilansEllerSelvstendig}.arbeidsforhold.arbeidsform.spm`)}
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
                {snF_arbeidsforhold?.arbeidsform !== undefined && (
                    <FormBlock>
                        <AppForm.NumberInput
                            name={getFieldName(ArbeidsforholdSNFField.jobberNormaltTimer)}
                            suffix={intlHelper(
                                intl,
                                `snFrilanser.arbeidsforhold.arbeidsform.${snF_arbeidsforhold.arbeidsform}.timer.suffix`
                            )}
                            suffixStyle="text"
                            description={
                                <div style={{ width: '100%' }}>
                                    {snF_arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                        <Box margin="m">
                                            <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.fast} />
                                        </Box>
                                    )}
                                    {snF_arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                        <Box margin="m">
                                            <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.turnus} />
                                        </Box>
                                    )}
                                    {snF_arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                        <Box margin="m">
                                            <ArbeidsformInfoSNFrilanser arbeidsform={Arbeidsform.varierende} />
                                        </Box>
                                    )}
                                </div>
                            }
                            bredde="XS"
                            label={intlHelper(
                                intl,
                                `snFrilanser.arbeidsforhold.iDag.${snF_arbeidsforhold.arbeidsform}.spm`
                            )}
                            validate={(value) => {
                                const error = getNumberValidator({
                                    required: true,
                                    min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                    max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                })(value);
                                if (error) {
                                    return {
                                        key: `validation.frilans_arbeidsforhold.jobberNormaltTimer.${snF_arbeidsforhold.arbeidsform}.${error}`,
                                        values: {
                                            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                        },
                                        keepKeyUnaltered: true,
                                    };
                                }
                                return error;
                            }}
                            value={snF_arbeidsforhold.arbeidsform || ''}
                        />
                    </FormBlock>
                )}
            </Box>
            {hasValue(snF_arbeidsforhold.jobberNormaltTimer) && (
                <>
                    <FormBlock>
                        <AppForm.RadioPanelGroup
                            legend={
                                appFormField === AppFormField.frilans_arbeidsforhold
                                    ? intlHelper(intl, 'arbeidsforhold.arbeidsforhold.frilanser.spm')
                                    : intlHelper(intl, 'arbeidsforhold.arbeidsforhold.sn.spm')
                            }
                            description={
                                <ExpandableInfo title={intlHelper(intl, 'snF.ArbeidsforholdDetaljer.hvaBetyr.spm')}>
                                    {hvaBetyrDetteTekst}
                                </ExpandableInfo>
                            }
                            name={getFieldName(ArbeidsforholdSNFField.skalJobbe)}
                            validate={getRequiredFieldValidator()}
                            radios={[
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                    value: ArbeidsforholdSkalJobbeSvar.ja,
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                    value: ArbeidsforholdSkalJobbeSvar.nei,
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                    value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                },
                            ]}
                        />
                    </FormBlock>
                    {snF_arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.ja &&
                        hasValue(snF_arbeidsforhold.jobberNormaltTimer) && (
                            <>
                                <FormBlock>
                                    <AppForm.RadioPanelGroup
                                        name={getFieldName(ArbeidsforholdSNFField.skalJobbeHvorMye)}
                                        legend={`Hvor mye skal du jobbe som ${
                                            frilansEllerSelvstendig === 'frilans'
                                                ? 'frilanser'
                                                : 'selvstendig næringsdrivende'
                                        }`}
                                        radios={[
                                            {
                                                value: ArbeidsforholdSkalJobbeHvorMyeSvar.somVanlig,
                                                label: `Som normalt (${snF_arbeidsforhold.jobberNormaltTimer} timer)`,
                                            },
                                            {
                                                value: ArbeidsforholdSkalJobbeHvorMyeSvar.redusert,
                                                label: `Mindre enn ${snF_arbeidsforhold.jobberNormaltTimer} timer`,
                                            },
                                        ]}
                                    />
                                </FormBlock>
                                {snF_arbeidsforhold.skalJobbeHvorMye ===
                                    ArbeidsforholdSkalJobbeHvorMyeSvar.redusert && (
                                    <FormBlock>
                                        <RedusertArbeidsforholdSNFDetaljerPart
                                            frilansEllerSelvstendig={frilansEllerSelvstendig}
                                            frilans_arbeidsforhold={snF_arbeidsforhold}
                                            getFieldName={getFieldName}
                                        />
                                    </FormBlock>
                                )}
                            </>
                        )}
                </>
            )}
        </>
    );
};

export default ArbeidsforholdSNFDetaljer;
