import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ArbeidsforholdType } from '../../types/PleiepengesøknadApiData';
import {
    AppFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    ArbeidsforholdJobberSvar,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    isArbeidsforholdAnsatt,
} from '../../types/PleiepengesøknadFormData';
import { getTimerTekst } from '../../utils/arbeidsforholdUtils';
import {
    getArbeidJobbeHvorMyeValidator,
    getArbeidJobberValidator,
    getArbeidstimerDatoValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from '../../validation/fieldValidations';
import AppForm from '../app-form/AppForm';
import TidFasteDagerInput from '../tid-faste-dager-input/TidFasteDagerInput';
import TidKalenderInput from '../tid-kalender-input/TidKalenderInput';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold;
    arbeidsforholdType: ArbeidsforholdType;
    periode: DateRange;
    erHistorisk: boolean;
}

export type ArbeidIPeriodeIntlValues = {
    hvor: string;
    skalEllerHarJobbet: string;
    timer: string;
    fra: string;
    til: string;
};

const ArbeidIPeriodeFormPart = ({
    arbeidsforhold,
    parentFieldName,
    erHistorisk,
    arbeidsforholdType,
    periode,
}: Props) => {
    const intl = useIntl();

    const intlValues: ArbeidIPeriodeIntlValues = {
        skalEllerHarJobbet: intlHelper(
            intl,
            erHistorisk ? 'arbeidIPeriode.skalJobbe.planlagt' : 'arbeidIPeriode.skalJobbe.planlagt'
        ),
        hvor: isArbeidsforholdAnsatt(arbeidsforhold)
            ? intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsforhold.navn })
            : intlHelper(intl, `arbeidsforhold.part.som.${arbeidsforholdType}`),
        timer: getTimerTekst(intl, arbeidsforhold.jobberNormaltTimer),
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
    };

    const getFieldName = (field: ArbeidIPeriodeField) =>
        `${parentFieldName}.${erHistorisk ? 'historisk' : 'planlagt'}.${field}` as AppFormField;

    const getSpørsmål = (spørsmål: ArbeidIPeriodeField) =>
        intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}${spørsmål}.spm`, intlValues as any);

    const arbeidIPeriode = erHistorisk ? arbeidsforhold?.historisk : arbeidsforhold?.planlagt;

    const { jobber, jobbeHvorMye, erLiktHverUke } = arbeidIPeriode || {};

    return (
        <>
            <FormBlock>
                <AppForm.RadioPanelGroup
                    name={getFieldName(ArbeidIPeriodeField.jobber)}
                    legend={getSpørsmål(ArbeidIPeriodeField.jobber)}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'validation.arbeidIPeriode.skalJobbe.info.tittel')}>
                            <FormattedMessage id="validation.arbeidIPeriode.skalJobbe.info.tekst" />
                        </ExpandableInfo>
                    }
                    useTwoColumns={erHistorisk === true}
                    validate={getArbeidJobberValidator(intlValues)}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidIPeriode.skalJobbe.ja'),
                            value: ArbeidsforholdJobberSvar.ja,
                        },
                        {
                            label: intlHelper(intl, 'arbeidIPeriode.skalJobbe.nei'),
                            value: ArbeidsforholdJobberSvar.nei,
                        },
                        ...(erHistorisk === false
                            ? [
                                  {
                                      label: intlHelper(intl, 'arbeidIPeriode.skalJobbe.vetIkke'),
                                      value: ArbeidsforholdJobberSvar.vetIkke,
                                  },
                              ]
                            : []),
                    ]}
                />
            </FormBlock>
            {jobber === ArbeidsforholdJobberSvar.ja && (
                <FormBlock>
                    <AppForm.RadioPanelGroup
                        name={getFieldName(ArbeidIPeriodeField.jobbeHvorMye)}
                        legend={getSpørsmål(ArbeidIPeriodeField.jobbeHvorMye)}
                        radios={[
                            {
                                label: intlHelper(intl, 'arbeidIPeriode.jobbeHvorMye.somVanlig', intlValues),
                                value: ArbeidsforholdSkalJobbeHvorMyeSvar.somVanlig,
                            },
                            {
                                label: intlHelper(intl, 'arbeidIPeriode.jobbeHvorMye.redusert', intlValues),
                                value: ArbeidsforholdSkalJobbeHvorMyeSvar.redusert,
                            },
                        ]}
                        validate={getArbeidJobbeHvorMyeValidator(intlValues)}
                    />
                </FormBlock>
            )}
            {jobber === ArbeidsforholdJobberSvar.ja && jobbeHvorMye === ArbeidsforholdSkalJobbeHvorMyeSvar.redusert && (
                <FormBlock>
                    <AppForm.YesOrNoQuestion
                        name={getFieldName(ArbeidIPeriodeField.erLiktHverUke)}
                        legend={getSpørsmål(ArbeidIPeriodeField.erLiktHverUke)}
                        useTwoColumns={false}
                        labels={{
                            yes: intlHelper(
                                intl,
                                `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.erLikt`
                            ),
                            no: intlHelper(
                                intl,
                                `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}erLiktHverUke.varierer`
                            ),
                        }}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
            )}
            {jobber === ArbeidsforholdJobberSvar.ja && erLiktHverUke === YesOrNo.YES && (
                <FormBlock>
                    <AppForm.InputGroup
                        legend={intlHelper(
                            intl,
                            erHistorisk
                                ? 'arbeidIPeriode.historisk.ukedager.tittel'
                                : 'arbeidIPeriode.planlagt.ukedager.tittel'
                        )}
                        validate={() => validateFasteArbeidstimerIUke(arbeidIPeriode)}
                        name={'fasteDager_gruppe' as any}>
                        <TidFasteDagerInput
                            name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                            validator={getArbeidstimerFastDagValidator}
                        />
                    </AppForm.InputGroup>
                </FormBlock>
            )}
            {jobber === ArbeidsforholdJobberSvar.ja && erLiktHverUke === YesOrNo.NO && (
                <FormBlock>
                    <AppForm.InputGroup
                        legend={intlHelper(
                            intl,
                            erHistorisk
                                ? 'arbeidIPeriode.historisk.enkeltdager.tittel'
                                : 'arbeidIPeriode.planlagt.enkeltdager.tittel',
                            intlValues
                        )}
                        description={
                            <ExpandableInfo title="Må jeg fylle ut for alle dagene?">
                                Du trenger kun å fylle ut de dagene du jobbet. Dager hvor du ikke fyller ut noe tid, vil
                                bli regnet som at du ikke jobbet den dagen.
                            </ExpandableInfo>
                        }
                        name={'enkeltdager_gruppe' as any}>
                        <TidKalenderInput
                            periode={periode}
                            fieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                            tidPerDagValidator={getArbeidstimerDatoValidator}
                        />
                    </AppForm.InputGroup>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodeFormPart;
