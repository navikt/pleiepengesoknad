import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidsforholdAnsatt,
    ArbeidsforholdField,
    ArbeidsforholdSNF,
} from '../../../../types/PleiepengesøknadFormData';
import AppForm from '../../../app-form/AppForm';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { ArbeidsforholdType } from '../../../../types';

interface Props {
    arbeidsforhold?: ArbeidsforholdAnsatt | ArbeidsforholdSNF;
    validator: {
        jobberNormaltTimer: ValidationFunction<ValidationError>;
    };
    spørsmål: {
        jobberNormaltTimer: () => string;
    };
    parentFieldName: string;
    arbeidsforholdType: ArbeidsforholdType;
}

const TimerFormPart: React.FC<Props> = ({
    arbeidsforhold,
    validator,
    spørsmål,
    parentFieldName,
    arbeidsforholdType,
}) => {
    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as any;

    return (
        <>
            <AppForm.NumberInput
                label={spørsmål.jobberNormaltTimer()}
                name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                suffix={intlHelper(intl, `arbeidsforhold.timer.suffix`)}
                suffixStyle="text"
                description={
                    <div style={{ width: '100%' }}>
                        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.tittel')}>
                            <FormattedMessage id={`arbeidsforhold.${arbeidsforholdType}.normalTimer.info`} />

                            <ul style={{ paddingInlineStart: '20px' }}>
                                <li>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.1'} />
                                </li>
                                <li>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.list.item.2'} />
                                </li>
                            </ul>
                            <ExpandableInfo
                                filledBackground={false}
                                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                                <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.3'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4'} />
                                    <br />
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4a'} />
                                    <br />
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4b'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.5'} />
                                </p>
                            </ExpandableInfo>
                            <ExpandableInfo
                                filledBackground={false}
                                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.varierende.tittel')}>
                                <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.1'} />

                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                                </p>
                                <p>
                                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                                </p>
                            </ExpandableInfo>
                        </ExpandableInfo>
                    </div>
                }
                bredde="XS"
                validate={validator.jobberNormaltTimer}
                value={arbeidsforhold ? arbeidsforhold.jobberNormaltTimer || '' : ''}
            />
        </>
    );
};

export default TimerFormPart;
