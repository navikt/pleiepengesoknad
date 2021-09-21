import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import {
    AppFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    ArbeidsforholdJobberSvar,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    isArbeidsforholdAnsatt,
} from '../../../types/PleiepengesøknadFormData';
import {
    getArbeidJobbeHvorMyeValidator,
    getArbeidJobberValidator,
    validateFasteArbeidstimerIUke,
} from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import ArbeidstimerUke from './ArbeidstimerUke';
import { ArbeidsforholdType } from '../../../types/PleiepengesøknadApiData';
import { getTimerTekst } from '../../../utils/arbeidsforholdUtils';

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
};

const ArbeidIPeriodeFormPart = ({ arbeidsforhold, parentFieldName, erHistorisk, arbeidsforholdType }: Props) => {
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
                        legend={'Oppgi timene og minuttene du skal jobbe i uken'}
                        validate={() => validateFasteArbeidstimerIUke(arbeidIPeriode)}
                        name={'fasteDager_gruppe' as any}>
                        <ArbeidstimerUke name={getFieldName(ArbeidIPeriodeField.fasteDager)} />
                    </AppForm.InputGroup>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidIPeriodeFormPart;
