import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import {
    AppFormField,
    ArbeidsforholdAnsatt,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdSNF,
    FrilansEllerSelvstendig,
} from '../../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
    getTimerTekst,
} from '../../../utils/arbeidsforholdUtils';
import AppForm from '../../app-form/AppForm';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF;
    parentFieldName: string;
    frilansEllerSelvstendig?: FrilansEllerSelvstendig;
    spørsmål: {
        skalJobbe: string;
        jobbeHvorMye: string;
        timerEllerProsent: string;
        skalJobbeTimer: string;
        skalJobbeProsent: string;
    };
    validatorer: {
        skalJobbe: ValidationFunction<ValidationError>;
        jobbeHvorMye: ValidationFunction<ValidationError>;
        timerEllerProsent: ValidationFunction<ValidationError>;
        skalJobbeTimer: ValidationFunction<ValidationError>;
        skalJobbeProsent: ValidationFunction<ValidationError>;
    };
}

const getLabelForProsentRedusert = (intl: IntlShape, timerNormalt: number, prosentRedusert: number | undefined) => {
    if (prosentRedusert && prosentRedusert > 0) {
        const { hours: timer = 0, minutes: minutter = 0 } = decimalTimeToTime(
            calcReduserteTimerFromRedusertProsent(timerNormalt, prosentRedusert)
        );
        return intlHelper(intl, 'arbeidsforhold.prosent.utledet.medTimer', {
            timer: timerNormalt,
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter }),
        });
    }
    return intlHelper(intl, 'arbeidsforhold.prosent.utledet', { timer: timerNormalt });
};

const getLabelForTimerRedusert = (intl: IntlShape, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'arbeidsforhold.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: intl.formatNumber(calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert), {
                style: 'decimal',
            }),
        });
    }
    return intlHelper(intl, 'arbeidsforhold.timer.utledet', { timer: timerNormalt });
};

const ArbeidsforholdISøknadsperiode = ({ arbeidsforhold, parentFieldName, spørsmål, validatorer }: Props) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as AppFormField;

    const { timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent, arbeidsform } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);
    const skalJobbeTimerNumber = getNumberFromNumberInputValue(skalJobbeTimer);
    const skalJobbeProsentNum = getNumberFromNumberInputValue(skalJobbeProsent);

    return (
        <>
            <FormBlock>
                <AppForm.RadioPanelGroup
                    legend={spørsmål.skalJobbe}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'validation.arbeidsforhold.skalJobbe.info.tittel')}>
                            <FormattedMessage id="validation.arbeidsforhold.skalJobbe.info.tekst" />
                        </ExpandableInfo>
                    }
                    name={getFieldName(ArbeidsforholdField.skalJobbe)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidsforhold.skalJobbe.ja'),
                            value: ArbeidsforholdSkalJobbeSvar.ja,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.skalJobbe.nei'),
                            value: ArbeidsforholdSkalJobbeSvar.nei,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforhold.skalJobbe.vetIkke'),
                            value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                        },
                    ]}
                    validate={validatorer.skalJobbe}
                />
            </FormBlock>
            {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.ja &&
                arbeidsforhold.jobberNormaltTimer &&
                hasValue(arbeidsforhold.jobberNormaltTimer) && (
                    <>
                        <FormBlock>
                            <AppForm.RadioPanelGroup
                                name={getFieldName(ArbeidsforholdField.skalJobbeHvorMye)}
                                legend={spørsmål.jobbeHvorMye}
                                radios={[
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.somVanlig,
                                        label: intlHelper(intl, 'arbeidsforhold.jobbeHvorMye.somVanlig', {
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                    },
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.redusert,
                                        label: intlHelper(intl, 'arbeidsforhold.jobbeHvorMye.redusert', {
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                    },
                                ]}
                                validate={validatorer.jobbeHvorMye}
                            />
                        </FormBlock>
                        {arbeidsforhold.skalJobbeHvorMye === ArbeidsforholdSkalJobbeHvorMyeSvar.redusert &&
                            jobberNormaltTimerNumber !== undefined &&
                            arbeidsform !== undefined && (
                                <>
                                    <FormBlock>
                                        <AppForm.RadioPanelGroup
                                            name={getFieldName(ArbeidsforholdField.timerEllerProsent)}
                                            legend={spørsmål.timerEllerProsent}
                                            validate={validatorer.timerEllerProsent}
                                            useTwoColumns={true}
                                            radios={[
                                                {
                                                    label: intlHelper(intl, 'arbeidsforhold.timerEllerProsent.timer'),
                                                    value: 'timer',
                                                },
                                                {
                                                    label: intlHelper(intl, 'arbeidsforhold.timerEllerProsent.prosent'),
                                                    value: 'prosent',
                                                },
                                            ]}
                                        />
                                    </FormBlock>
                                    {timerEllerProsent === 'timer' && (
                                        <FormBlock>
                                            <AppForm.NumberInput
                                                name={getFieldName(ArbeidsforholdField.skalJobbeTimer)}
                                                label={spørsmål.skalJobbeTimer}
                                                bredde="XS"
                                                suffix={getLabelForTimerRedusert(
                                                    intl,
                                                    jobberNormaltTimerNumber,
                                                    skalJobbeTimerNumber
                                                )}
                                                suffixStyle="text"
                                                value={skalJobbeTimer || ''}
                                                validate={validatorer.skalJobbeTimer}
                                            />
                                        </FormBlock>
                                    )}
                                    {timerEllerProsent === 'prosent' && (
                                        <>
                                            <FormBlock>
                                                <AppForm.NumberInput
                                                    name={getFieldName(ArbeidsforholdField.skalJobbeProsent)}
                                                    label={spørsmål.skalJobbeProsent}
                                                    bredde="XS"
                                                    suffix={getLabelForProsentRedusert(
                                                        intl,
                                                        jobberNormaltTimerNumber,
                                                        skalJobbeProsentNum
                                                    )}
                                                    suffixStyle="text"
                                                    value={skalJobbeProsent || ''}
                                                    validate={validatorer.skalJobbeProsent}
                                                />
                                            </FormBlock>
                                            <FormBlock>
                                                <CounsellorPanel>
                                                    <FormattedMessage id="arbeidsforhold.prosent.veileder" />
                                                </CounsellorPanel>
                                            </FormBlock>
                                        </>
                                    )}
                                </>
                            )}
                    </>
                )}
        </>
    );
};

export default ArbeidsforholdISøknadsperiode;
