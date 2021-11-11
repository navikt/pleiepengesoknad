import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { AppFormField, ArbeidsforholdAnsatt, ArbeidsforholdField } from '../../../../types/PleiepengesøknadFormData';
import AppForm from '../../../app-form/AppForm';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    arbeidsforhold?: ArbeidsforholdAnsatt;
    validator: {
        jobberNormaltTimer: ValidationFunction<ValidationError>;
    };
    spørsmål: {
        jobberNormaltTimer: () => string;
    };
    parentFieldName: string;
}

const AnsattTimerFormPart: React.FC<Props> = ({ arbeidsforhold, spørsmål, parentFieldName, validator }) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as AppFormField;

    return (
        <>
            {arbeidsforhold && (
                <AppForm.NumberInput
                    label={spørsmål.jobberNormaltTimer()}
                    name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                    suffix={intlHelper(intl, `arbeidsforhold.arbeidsform.FAST.timer.suffix`)}
                    suffixStyle="text"
                    description={
                        <div style={{ width: '100%' }}>
                            <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.ansatt.normalTimer.info.tittel')}>
                                <FormattedMessage id={'arbeidsforhold.ansatt.normalTimer.info'} />

                                <ul style={{ paddingInlineStart: '20px' }}>
                                    <li>
                                        <FormattedMessage id={'arbeidsforhold.ansatt.normalTimer.info.list.item.1'} />
                                    </li>
                                    <li>
                                        <FormattedMessage id={'arbeidsforhold.ansatt.normalTimer.info.list.item.2'} />
                                    </li>
                                    <li>
                                        <FormattedMessage id={'arbeidsforhold.ansatt.normalTimer.info.list.item.3'} />
                                    </li>
                                </ul>
                                <ExpandableInfo
                                    filledBackground={false}
                                    title={intlHelper(intl, 'arbeidsforhold.ansatt.normalTimer.info.turnus.tittel')}>
                                    <FormattedMessage id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.1'} />

                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.2'}
                                        />
                                    </p>
                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.3'}
                                        />
                                    </p>
                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.4'}
                                        />
                                        <br />
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.4a'}
                                        />
                                        <br />
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.4b'}
                                        />
                                    </p>
                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.turnus.avsnitt.5'}
                                        />
                                    </p>
                                </ExpandableInfo>
                                <ExpandableInfo
                                    filledBackground={false}
                                    title={intlHelper(
                                        intl,
                                        'arbeidsforhold.ansatt.normalTimer.info.varierende.tittel'
                                    )}>
                                    <FormattedMessage
                                        id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.1'}
                                    />

                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.2'}
                                        />
                                    </p>
                                    <Box margin={'l'} padBottom={'l'}>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.3'}
                                        />
                                        <br />
                                        <div style={{ paddingLeft: '20px' }}>
                                            <FormattedMessage
                                                id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.3a'}
                                            />
                                        </div>
                                    </Box>
                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.4'}
                                        />
                                    </p>
                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.5'}
                                        />
                                    </p>
                                    <p>
                                        <FormattedMessage
                                            id={'arbeidsforhold.ansatt.normalTimer.info.varierende.avsnitt.6'}
                                        />
                                    </p>
                                </ExpandableInfo>
                            </ExpandableInfo>
                        </div>
                    }
                    bredde="XS"
                    validate={validator.jobberNormaltTimer}
                    value={arbeidsforhold.jobberNormaltTimer || ''}
                />
            )}
        </>
    );
};

export default AnsattTimerFormPart;
