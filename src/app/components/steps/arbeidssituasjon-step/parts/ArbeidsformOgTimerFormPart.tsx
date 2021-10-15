import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import {
    AppFormField,
    ArbeidsforholdAnsatt,
    ArbeidsforholdField,
    ArbeidsforholdSNF,
    isArbeidsforholdAnsatt,
} from '../../../../types/PleiepengesøknadFormData';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformInfo from '../info/ArbeidsformInfo';
import { ArbeidsforholdType, Arbeidsform } from '../../../../types';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
    arbeidsforhold?: ArbeidsforholdAnsatt | ArbeidsforholdSNF;
    erAvsluttet: boolean;
    validator: {
        arbeidsform: ValidationFunction<ValidationError>;
        jobberNormaltTimer: ValidationFunction<ValidationError>;
    };
    spørsmål: {
        arbeidsform: string;
        jobberNormaltTimer: (arbeidsform: Arbeidsform) => string;
    };
    parentFieldName: string;
}

const ArbeidsformOgTimerFormPart: React.FunctionComponent<Props> = ({
    arbeidsforholdType,
    arbeidsforhold,
    spørsmål,
    parentFieldName,
    validator,
    erAvsluttet,
}) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as AppFormField;
    const visInfoSomSluttetAnsatt = isArbeidsforholdAnsatt(arbeidsforhold) && erAvsluttet;
    return (
        <>
            <FormBlock margin="none">
                <AppForm.RadioPanelGroup
                    legend={spørsmål.arbeidsform}
                    name={getFieldName(ArbeidsforholdField.arbeidsform)}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.arbeidsform.info.tittel')}>
                            {arbeidsforholdType === ArbeidsforholdType.FRILANSER && (
                                <FormattedMessage
                                    id={
                                        erAvsluttet
                                            ? 'arbeidsforhold.frilanser.arbeidsform.info.sluttet.tekst'
                                            : 'arbeidsforhold.frilanser.arbeidsform.info.tekst'
                                    }
                                />
                            )}
                            {arbeidsforholdType === ArbeidsforholdType.ANSATT && (
                                <FormattedMessage
                                    id={
                                        visInfoSomSluttetAnsatt
                                            ? 'arbeidsforhold.ansatt.arbeidsform.info.sluttet.tekst'
                                            : 'arbeidsforhold.ansatt.arbeidsform.info.tekst'
                                    }
                                />
                            )}
                            {arbeidsforholdType === ArbeidsforholdType.SELVSTENDIG && (
                                <FormattedMessage id={'arbeidsforhold.sn.arbeidsform.info.tekst'} />
                            )}
                        </ExpandableInfo>
                    }
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.fast'),
                            value: Arbeidsform.fast,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.arbeidsform.turnus'),
                            value: Arbeidsform.turnus,
                        },
                        {
                            label: (
                                <>
                                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.1" />
                                    /&shy;
                                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.2" />
                                    /&shy;
                                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.3" />
                                    /&shy;
                                </>
                            ),
                            value: Arbeidsform.varierende,
                        },
                    ]}
                    validate={validator.arbeidsform}
                />
            </FormBlock>
            {arbeidsforhold?.arbeidsform !== undefined && (
                <FormBlock>
                    <AppForm.NumberInput
                        label={spørsmål.jobberNormaltTimer(arbeidsforhold?.arbeidsform)}
                        name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                        suffix={intlHelper(
                            intl,
                            `arbeidsforhold.arbeidsform.${arbeidsforhold.arbeidsform}.timer.suffix`
                        )}
                        suffixStyle="text"
                        description={
                            <div style={{ width: '100%' }}>
                                {arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                    <Box margin="m">
                                        <ArbeidsformInfo
                                            arbeidsform={Arbeidsform.fast}
                                            arbeidsforholdType={arbeidsforholdType}
                                            erAvsluttet={erAvsluttet}
                                        />
                                    </Box>
                                )}
                                {arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                    <Box margin="m">
                                        <ArbeidsformInfo
                                            arbeidsform={Arbeidsform.turnus}
                                            arbeidsforholdType={arbeidsforholdType}
                                            erAvsluttet={erAvsluttet}
                                        />
                                    </Box>
                                )}
                                {arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                    <>
                                        <Box margin="m">
                                            <ArbeidsformInfo
                                                arbeidsform={Arbeidsform.varierende}
                                                arbeidsforholdType={arbeidsforholdType}
                                                erAvsluttet={erAvsluttet}
                                            />
                                        </Box>
                                    </>
                                )}
                            </div>
                        }
                        bredde="XS"
                        validate={validator.jobberNormaltTimer}
                        value={arbeidsforhold.jobberNormaltTimer || ''}
                    />
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidsformOgTimerFormPart;
