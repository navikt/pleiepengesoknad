import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDateExtended, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    DateRange,
    FormikInputGroup,
    FormikNumberInput,
    getNumberFromNumberInputValue,
} from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { StepID } from '../../../config/stepConfig';
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
import { getTimerTekst } from '../../../utils/arbeidsforholdUtils';
import {
    getArbeidsforholdSkalJobbeHvorMyeValidator,
    getArbeidsforholdSkalJobbeTimerValidator,
    getArbeidsforholdSkalJobbeValidator,
    getArbeidsforholdTimerEllerProsentValidator,
    isYesOrNoAnswered,
} from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import InvalidStepPage from '../../pages/invalid-step-page/InvalidStepPage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { erUkeFørSammeEllerEtterDenneUken, getWeeksInDateRange } from '../../../utils/dateUtils';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import ArbeiderTimerEllerProsentInput, { getLabelForTimerRedusert } from './ArbeiderTimerEllerProsentInput';
import dayjs from 'dayjs';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    parentFieldName: string;
    arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF;
    arbeidsforholdType: ArbeidsforholdType;
    søknadsperiode: DateRange;
    erAvsluttet?: boolean;
}

export interface ArbeidsforholdISøknadsperiodeIntlValues {
    hvor: string;
    arbeidsform: string;
    fra: string;
    timer: string;
    skalJobbe: string;
}

const ArbeidsforholdISøknadsperiode = ({
    arbeidsforhold,
    arbeidsforholdType,
    parentFieldName,
    søknadsperiode,
    erAvsluttet,
}: Props) => {
    const intl = useIntl();

    const { jobberNormaltTimer, arbeidsform, erLiktHverUke, skalJobbeProsent, skalJobbeTimer, timerEllerProsent } =
        arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined || arbeidsform === undefined) {
        return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD} />;
    }

    const getFieldName = (field: ArbeidsforholdField) => `${parentFieldName}.${field}` as AppFormField;

    const getSpørsmål = (spørsmål: string) =>
        intlHelper(intl, `arbeidsforholdIPerioden.${erAvsluttet ? 'avsluttet.' : ''}${spørsmål}.spm`, intlValues);

    const intlValues = {
        hvor: intlHelper(intl, `arbeidsforhold.part.som.${arbeidsforholdType}`, {
            navn: isArbeidsforholdAnsatt(arbeidsforhold) ? arbeidsforhold.navn : undefined,
        }),
        arbeidsform: intlHelper(intl, `arbeidsforhold.part.arbeidsform.${arbeidsforhold.arbeidsform}`),
        fra: prettifyDateFull(søknadsperiode.from),
        timer: getTimerTekst(arbeidsforhold.jobberNormaltTimer, intl),
        skalJobbe: intlHelper(
            intl,
            erAvsluttet ? 'arbeidsforholdIPerioden.skalJobbe.avsluttet' : 'arbeidsforholdIPerioden.skalJobbe.pågående'
        ),
    };

    const spørOmVariasjon = 1 + 1 == 3;
    const spørOmTimerEllerProsent = 1 + 1 == 2;
    const skalJobbe = arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.ja;
    const jobberRedusert = skalJobbe && arbeidsforhold.skalJobbeHvorMye === ArbeidsforholdSkalJobbeHvorMyeSvar.redusert;
    const jobberLiktHverUke = jobberRedusert && (spørOmVariasjon == false || erLiktHverUke === YesOrNo.YES);

    return (
        <>
            <FormBlock>
                <AppForm.RadioPanelGroup
                    name={getFieldName(ArbeidsforholdField.skalJobbe)}
                    legend={getSpørsmål('skalJobbe')}
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
            {skalJobbe && (
                <FormBlock>
                    <AppForm.RadioPanelGroup
                        name={getFieldName(ArbeidsforholdField.skalJobbeHvorMye)}
                        legend={getSpørsmål('jobbeHvorMye')}
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
            )}
            {jobberRedusert && spørOmVariasjon && (
                <FormBlock>
                    <AppForm.YesOrNoQuestion
                        name={getFieldName(ArbeidsforholdField.erLiktHverUke)}
                        legend={getSpørsmål('erLiktHverUke')}
                        useTwoColumns={false}
                        labels={{
                            yes: intlHelper(
                                intl,
                                `arbeidsforholdIPerioden.${erAvsluttet ? 'avsluttet.' : ''}erLiktHverUke.erLikt`
                            ),
                            no: intlHelper(
                                intl,
                                `arbeidsforholdIPerioden.${erAvsluttet ? 'avsluttet.' : ''}erLiktHverUke.varierer`
                            ),
                        }}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
            )}
            {spørOmTimerEllerProsent &&
                jobberRedusert &&
                jobberLiktHverUke === true &&
                (isYesOrNoAnswered(erLiktHverUke) || spørOmVariasjon === false) && (
                    <FormBlock>
                        <AppForm.RadioPanelGroup
                            name={getFieldName(ArbeidsforholdField.timerEllerProsent)}
                            legend={getSpørsmål('timerEllerProsent')}
                            validate={getArbeidsforholdTimerEllerProsentValidator(intlValues)}
                            useTwoColumns={true}
                            radios={[
                                {
                                    label: intlHelper(intl, 'arbeidsforholdIPerioden.timerEllerProsent.timer'),
                                    value: 'timer',
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforholdIPerioden.timerEllerProsent.prosent'),
                                    value: 'prosent',
                                },
                            ]}
                        />
                    </FormBlock>
                )}
            {skalJobbe && jobberRedusert && isYesOrNoAnswered(erLiktHverUke) && jobberLiktHverUke === false && (
                <FormBlock>
                    <FormikInputGroup legend={`Arbeidstimer per uke i pleiepengeperioden`} name="abc">
                        <Box padBottom="l">Du trenger bare fylle ut de ukene hvor du jobbet/skal jobbe.</Box>
                        {getWeeksInDateRange(søknadsperiode).map((week) => {
                            const key = dayjs(week.from).format('YYYY_MM_DD');
                            const weekFieldName = `arbeidstimer.${key}`;
                            const ukeplassering = erUkeFørSammeEllerEtterDenneUken(week);
                            const title = `Hvor mye ${
                                ukeplassering === 'før'
                                    ? 'jobbet du'
                                    : ukeplassering === 'samme'
                                    ? 'jobber du'
                                    : 'skal du jobbe'
                            }  i perioden fra ${prettifyDateExtended(week.from)} til ${prettifyDateExtended(week.to)}?`;
                            const timerIUken = arbeidsforhold.arbeidstimer
                                ? arbeidsforhold.arbeidstimer[key]
                                : undefined;
                            return (
                                <FormBlock key={key} margin="m">
                                    <FormikInputGroup name={key}>
                                        <ResponsivePanel style={{ padding: '1rem' }}>
                                            <FormikNumberInput
                                                name={getFieldName(weekFieldName as any)}
                                                label={title}
                                                bredde="XS"
                                                placeholder="0"
                                                suffix={getLabelForTimerRedusert(
                                                    intl,
                                                    jobberNormaltTimerNumber,
                                                    getNumberFromNumberInputValue(timerIUken)
                                                )}
                                                suffixStyle="text"
                                                value={timerIUken || ''}
                                                validate={getArbeidsforholdSkalJobbeTimerValidator(
                                                    jobberNormaltTimerNumber,
                                                    intlValues,
                                                    true,
                                                    false
                                                )}
                                            />
                                        </ResponsivePanel>
                                    </FormikInputGroup>
                                </FormBlock>
                            );
                        })}
                    </FormikInputGroup>
                </FormBlock>
            )}
            {((spørOmVariasjon && jobberLiktHverUke === true && spørOmTimerEllerProsent === false) ||
                timerEllerProsent !== undefined) && (
                <ArbeiderTimerEllerProsentInput
                    getFieldName={getFieldName}
                    getSpørsmål={getSpørsmål}
                    jobberNormaltTimerNumber={jobberNormaltTimerNumber}
                    intlValues={intlValues}
                    timerEllerProsent={timerEllerProsent || 'timer'}
                    skalJobbeProsent={skalJobbeProsent}
                    skalJobbeTimer={skalJobbeTimer}
                />
            )}
        </>
    );
};

export default ArbeidsforholdISøknadsperiode;
