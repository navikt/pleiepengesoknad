import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { prettifyDate, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import {
    AppFormField,
    ArbeidIPeriodeField,
    Arbeidsforhold,
    isArbeidsforholdAnsatt,
} from '../../types/PleiepengesøknadFormData';
import { getTimerTekst } from '../../utils/arbeidsforholdUtils';
import { visSpørsmålOmTidErLikHverUke } from '../../utils/tidsbrukUtils';
import { getArbeidJobberSomVanligValidator, getArbeidJobberValidator } from '../../validation/validateArbeidFields';
import AppForm from '../app-form/AppForm';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ArbeidIPeriodenUtvidet from './ArbeidIPeriodenUtvidet';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import ArbeidIPeriodeForenklet from './ArbeidIPeriodeForenklet';

interface Props {
    parentFieldName: string;
    arbeidsforhold: Arbeidsforhold;
    arbeidsforholdType: ArbeidsforholdType;
    periode: DateRange;
    erHistorisk: boolean;
    søknadsdato: Date;
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
    søknadsdato,
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

    const visSpørsmålOmLiktHverUke = visSpørsmålOmTidErLikHverUke(periode);

    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(arbeidsforhold.jobberNormaltTimer);

    return (
        <>
            <AppForm.RadioPanelGroup
                name={getFieldName(ArbeidIPeriodeField.jobberIPerioden)}
                legend={getSpørsmål(ArbeidIPeriodeField.jobberIPerioden)}
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
            {jobberIPerioden === JobberIPeriodeSvar.VET_IKKE && (
                <Box margin="l">
                    <AlertStripeInfo>
                        {intlHelper(intl, 'arbeidIPeriode.jobberIPerioden.VET_IKKE.AlertStripeInfo')}
                    </AlertStripeInfo>
                </Box>
            )}
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

                        {jobberIPerioden === JobberIPeriodeSvar.JA &&
                            jobberSomVanlig === YesOrNo.NO &&
                            arbeidIPeriode && (
                                <>
                                    {isFeatureEnabled(Feature.FORENKLET_ARBEID) &&
                                    jobberNormaltTimerNumber !== undefined ? (
                                        <ArbeidIPeriodeForenklet
                                            arbeidIPeriode={arbeidIPeriode}
                                            jobberNormaltTimerNumber={jobberNormaltTimerNumber}
                                            getSpørsmål={getSpørsmål}
                                            getFieldName={getFieldName}
                                        />
                                    ) : (
                                        <ArbeidIPeriodenUtvidet
                                            intlValues={intlValues}
                                            visSpørsmålOmLiktHverUke={visSpørsmålOmLiktHverUke}
                                            periode={periode}
                                            søknadsdato={søknadsdato}
                                            arbeidIPeriode={arbeidIPeriode}
                                            erHistorisk={erHistorisk}
                                            erLiktHverUke={erLiktHverUke}
                                            getSpørsmål={getSpørsmål}
                                            getFieldName={getFieldName}
                                        />
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
