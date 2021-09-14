import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { ArbeidsforholdType } from '../../../types/PleiepengesøknadApiData';
import {
    AppFormField,
    ArbeidsforholdAnsatt,
    ArbeidsforholdField,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdSNF,
    isArbeidsforholdAnsatt,
} from '../../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
    getTimerTekst,
} from '../../../utils/arbeidsforholdUtils';
import {
    getArbeidsforholdSkalJobbeHvorMyeValidator,
    getArbeidsforholdSkalJobbeProsentValidator,
    getArbeidsforholdSkalJobbeTimerValidator,
    getArbeidsforholdSkalJobbeValidator,
    getArbeidsforholdTimerEllerProsentValidator,
} from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';

interface Props {
    parentFieldName: string;
    arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF;
    arbeidsforholdType: ArbeidsforholdType;
    avsluttetDato?: Date;
    søknadsperiode: DateRange;
}

interface Spørsmål {
    skalJobbe: string;
    jobbeHvorMye: string;
    timerEllerProsent: string;
    skalJobbeTimer: string;
    skalJobbeProsent: string;
}
const getLabelForProsentRedusert = (intl: IntlShape, timerNormalt: number, prosentRedusert: number | undefined) => {
    if (prosentRedusert && prosentRedusert > 0) {
        const { hours: timer = 0, minutes: minutter = 0 } = decimalTimeToTime(
            calcReduserteTimerFromRedusertProsent(timerNormalt, prosentRedusert)
        );
        return intlHelper(intl, 'arbeidsforholdIPerioden.prosent.utledet.medTimer', {
            timer: timerNormalt,
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter }),
        });
    }
    return intlHelper(intl, 'arbeidsforholdIPerioden.prosent.utledet', { timer: timerNormalt });
};

const getLabelForTimerRedusert = (intl: IntlShape, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'arbeidsforholdIPerioden.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: intl.formatNumber(calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert), {
                style: 'decimal',
            }),
        });
    }
    return intlHelper(intl, 'arbeidsforholdIPerioden.timer.utledet', { timer: timerNormalt });
};

const ArbeidsforholdISøknadsperiode = ({
    arbeidsforhold,
    arbeidsforholdType,
    parentFieldName,
    avsluttetDato,
    søknadsperiode,
}: Props) => {
    const intl = useIntl();

    const { timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent, arbeidsform } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);
    const erAvsluttet = avsluttetDato !== undefined;

    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as AppFormField;

    const getSpørsmål = (spørsmål: string) =>
        intlHelper(intl, `arbeidsforholdIPerioden.${erAvsluttet ? 'avsluttet.' : ''}${spørsmål}.spm`, intlValues);

    const intlValues = {
        hvor: intlHelper(intl, `arbeidsforhold.part.som.${arbeidsforholdType}`, {
            navn: isArbeidsforholdAnsatt(arbeidsforhold) ? arbeidsforhold.navn : undefined,
        }),
        arbeidsform: arbeidsforhold.arbeidsform
            ? intlHelper(intl, `arbeidsforhold.part.arbeidsform.${arbeidsforhold.arbeidsform}`)
            : undefined,
        fra: prettifyDateFull(søknadsperiode.from),
        til: avsluttetDato ? prettifyDateFull(avsluttetDato) : undefined,
        timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
        skalJobbe: erAvsluttet ? 'har jobbet' : 'skal jobbe',
    };

    const spørsmål: Spørsmål = {
        skalJobbe: getSpørsmål('skalJobbe'),
        jobbeHvorMye: getSpørsmål('jobbeHvorMye'),
        timerEllerProsent: getSpørsmål('timerEllerProsent'),
        skalJobbeTimer: getSpørsmål('skalJobbeTimer'),
        skalJobbeProsent: getSpørsmål('skalJobbeProsent'),
    };

    return (
        <>
            <FormBlock>
                <AppForm.RadioPanelGroup
                    name={getFieldName(ArbeidsforholdField.skalJobbe)}
                    legend={spørsmål.skalJobbe}
                    description={
                        <ExpandableInfo
                            title={intlHelper(intl, 'validation.arbeidsforholdIPerioden.skalJobbe.info.tittel')}>
                            <FormattedMessage id="validation.arbeidsforholdIPerioden.skalJobbe.info.tekst" />
                        </ExpandableInfo>
                    }
                    validate={getArbeidsforholdSkalJobbeValidator(intlValues)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidsforholdIPerioden.skalJobbe.ja'),
                            value: ArbeidsforholdSkalJobbeSvar.ja,
                        },
                        {
                            label: intlHelper(intl, 'arbeidsforholdIPerioden.skalJobbe.nei'),
                            value: ArbeidsforholdSkalJobbeSvar.nei,
                        },
                        ...(erAvsluttet === false
                            ? [
                                  {
                                      label: intlHelper(intl, 'arbeidsforholdIPerioden.skalJobbe.vetIkke'),
                                      value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                  },
                              ]
                            : []),
                    ]}
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
                                validate={getArbeidsforholdSkalJobbeHvorMyeValidator(intlValues)}
                                radios={[
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.somVanlig,
                                        label: intlHelper(intl, 'arbeidsforholdIPerioden.jobbeHvorMye.somVanlig', {
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                    },
                                    {
                                        value: ArbeidsforholdSkalJobbeHvorMyeSvar.redusert,
                                        label: intlHelper(intl, 'arbeidsforholdIPerioden.jobbeHvorMye.redusert', {
                                            timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
                                        }),
                                    },
                                ]}
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
                                            validate={getArbeidsforholdTimerEllerProsentValidator(intlValues)}
                                            useTwoColumns={true}
                                            radios={[
                                                {
                                                    label: intlHelper(
                                                        intl,
                                                        'arbeidsforholdIPerioden.timerEllerProsent.timer'
                                                    ),
                                                    value: 'timer',
                                                },
                                                {
                                                    label: intlHelper(
                                                        intl,
                                                        'arbeidsforholdIPerioden.timerEllerProsent.prosent'
                                                    ),
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
                                                    getNumberFromNumberInputValue(skalJobbeTimer)
                                                )}
                                                suffixStyle="text"
                                                value={skalJobbeTimer || ''}
                                                validate={getArbeidsforholdSkalJobbeTimerValidator(
                                                    arbeidsforhold.jobberNormaltTimer,
                                                    intlValues
                                                )}
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
                                                        getNumberFromNumberInputValue(skalJobbeProsent)
                                                    )}
                                                    suffixStyle="text"
                                                    value={skalJobbeProsent || ''}
                                                    validate={getArbeidsforholdSkalJobbeProsentValidator(intlValues)}
                                                />
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
