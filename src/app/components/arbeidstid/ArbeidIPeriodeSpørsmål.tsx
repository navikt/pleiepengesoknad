import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { JobberIPeriodeSvar, ArbeidsforholdType } from '../../types';
import {
    AppFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    isArbeidsforholdAnsatt,
} from '../../types/PleiepengesøknadFormData';
import { getTimerTekst } from '../../utils/arbeidsforholdUtils';
import AppForm from '../app-form/AppForm';
import TidFasteDagerInput from '../tid-faste-dager-input/TidFasteDagerInput';
import ArbeidstidKalenderInput from './ArbeidstidKalenderInput';
import {
    getArbeidErLiktHverUkeValidator,
    getArbeidJobberSomVanligValidator,
    getArbeidJobberValidator,
    getArbeidstimerFastDagValidator,
    validateFasteArbeidstimerIUke,
} from '../../validation/validateArbeidFields';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';

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
    iPerioden: string;
    iPeriodenKort: string;
};

const ArbeidIPeriodeSpørsmål = ({
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
            erHistorisk ? 'arbeidIPeriode.jobberIPerioden.historisk' : 'arbeidIPeriode.jobberIPerioden.planlagt'
        ),
        hvor: isArbeidsforholdAnsatt(arbeidsforhold)
            ? intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsforhold.navn })
            : intlHelper(intl, `arbeidsforhold.part.som.${arbeidsforholdType}`),
        timer: getTimerTekst(intl, arbeidsforhold.jobberNormaltTimer),
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
        iPerioden: intlHelper(intl, 'arbeidIPeriode.iPerioden.part', {
            fra: prettifyDate(periode.from),
            til: prettifyDate(periode.to),
        }),
        iPeriodenKort: intlHelper(intl, 'arbeidIPeriode.iPerioden.part', {
            fra: prettifyDateFull(periode.from),
            til: prettifyDateFull(periode.to),
        }),
    };

    const getFieldName = (field: ArbeidIPeriodeField) =>
        `${parentFieldName}.${erHistorisk ? 'historisk' : 'planlagt'}.${field}` as AppFormField;

    const getSpørsmål = (spørsmål: ArbeidIPeriodeField) =>
        intlHelper(intl, `arbeidIPeriode.${erHistorisk ? 'historisk.' : ''}${spørsmål}.spm`, intlValues as any);

    const arbeidIPeriode = erHistorisk ? arbeidsforhold?.historisk : arbeidsforhold?.planlagt;

    const { jobberIPerioden, jobberSomVanlig, erLiktHverUke } = arbeidIPeriode || {};

    return (
        <>
            <AppForm.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeField.jobberIPerioden)}
                legend={getSpørsmål(ArbeidIPeriodeField.jobberIPerioden)}
                description={
                    <ExpandableInfo title={intlHelper(intl, 'validation.arbeidIPeriode.jobberIPerioden.info.tittel')}>
                        <FormattedMessage id="validation.arbeidIPeriode.jobberIPerioden.info.tekst" />
                    </ExpandableInfo>
                }
                useTwoColumns={erHistorisk === true}
                validate={getArbeidJobberValidator(intlValues)}
                radios={[
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.JA}`),
                        value: JobberIPeriodeSvar.JA,
                    },
                    {
                        label: intlHelper(intl, `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.NEI}`),
                        value: JobberIPeriodeSvar.NEI,
                    },
                    ...(erHistorisk === false
                        ? [
                              {
                                  label: intlHelper(
                                      intl,
                                      `arbeidIPeriode.jobberIPerioden.${JobberIPeriodeSvar.VET_IKKE}`
                                  ),
                                  value: JobberIPeriodeSvar.VET_IKKE,
                              },
                          ]
                        : []),
                ]}
            />

            {jobberIPerioden === JobberIPeriodeSvar.JA && (
                <FormBlock margin="m">
                    <ResponsivePanel>
                        <AppForm.YesOrNoQuestion
                            name={getFieldName(ArbeidIPeriodeField.jobberSomVanlig)}
                            legend={getSpørsmål(ArbeidIPeriodeField.jobberSomVanlig)}
                            useTwoColumns={false}
                            labels={{
                                yes: intlHelper(intl, 'arbeidIPeriode.jobberSomVanlig.somVanlig', intlValues),
                                no: intlHelper(intl, 'arbeidIPeriode.jobberSomVanlig.redusert', intlValues),
                            }}
                            validate={getArbeidJobberSomVanligValidator(intlValues)}
                        />
                        {jobberIPerioden === JobberIPeriodeSvar.JA && jobberSomVanlig === YesOrNo.NO && (
                            <>
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
                                                `arbeidIPeriode.${
                                                    erHistorisk ? 'historisk.' : ''
                                                }erLiktHverUke.varierer`
                                            ),
                                        }}
                                        validate={getArbeidErLiktHverUkeValidator(intlValues)}
                                    />
                                </FormBlock>
                                {erLiktHverUke === YesOrNo.YES && (
                                    <FormBlock margin="xxl">
                                        <AppForm.InputGroup
                                            legend={intlHelper(
                                                intl,
                                                erHistorisk
                                                    ? 'arbeidIPeriode.historisk.ukedager.tittel'
                                                    : 'arbeidIPeriode.planlagt.ukedager.tittel',
                                                intlValues
                                            )}
                                            validate={() => validateFasteArbeidstimerIUke(arbeidIPeriode, intlValues)}
                                            name={'fasteDager_gruppe' as any}>
                                            <TidFasteDagerInput
                                                name={getFieldName(ArbeidIPeriodeField.fasteDager)}
                                                validator={getArbeidstimerFastDagValidator}
                                            />
                                        </AppForm.InputGroup>
                                    </FormBlock>
                                )}
                                {erLiktHverUke === YesOrNo.NO && (
                                    <FormBlock>
                                        <ArbeidstidKalenderInput
                                            periode={periode}
                                            enkeltdagerFieldName={getFieldName(ArbeidIPeriodeField.enkeltdager)}
                                        />
                                    </FormBlock>
                                )}
                            </>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodeSpørsmål;
