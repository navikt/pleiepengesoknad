import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import {
    AppFormField,
    ArbeidIPeriode,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import ArbeidIPeriodeSpørsmål from '../../arbeidstid/ArbeidIPeriodeSpørsmål';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../../types';

interface Props extends StepConfigProps {
    periode: DateRange;
    stepID: StepID.ARBEID_HISTORISK | StepID.ARBEID_PLANLAGT;
}

const cleanupArbeidIPeriode = (arbeidIPerioden: ArbeidIPeriode): ArbeidIPeriode => {
    const arbeid: ArbeidIPeriode = {
        jobberIPerioden: arbeidIPerioden.jobberIPerioden,
    };
    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return arbeid;
    }

    arbeid.jobberSomVanlig = arbeidIPerioden.jobberSomVanlig;
    if (arbeid.jobberSomVanlig === YesOrNo.YES) {
        return arbeid;
    }

    arbeid.erLiktHverUke = arbeidIPerioden.erLiktHverUke;
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.YES) {
        arbeid.fasteDager = arbeidIPerioden.fasteDager;
        return arbeid;
    }
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.NO) {
        arbeid.enkeltdager = arbeidIPerioden.enkeltdager;
        return arbeid;
    }
    return arbeidIPerioden;
};

const cleanupArbeidsforhold = (arbeidsforhold: Arbeidsforhold, erHistorisk: boolean): Arbeidsforhold => {
    if (erHistorisk && arbeidsforhold.historisk) {
        return {
            ...arbeidsforhold,
            historisk: cleanupArbeidIPeriode(arbeidsforhold.historisk),
        };
    }
    if (erHistorisk === false && arbeidsforhold.planlagt) {
        return {
            ...arbeidsforhold,
            planlagt: cleanupArbeidIPeriode(arbeidsforhold.planlagt),
        };
    }
    return arbeidsforhold;
};

const cleanupStepData = (formData: PleiepengesøknadFormData, erHistorisk: boolean): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formData };
    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(
        (arbeidsforhold) => cleanupArbeidsforhold(arbeidsforhold, erHistorisk) as ArbeidsforholdAnsatt
    );
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? (cleanupArbeidsforhold(values.frilans_arbeidsforhold, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? (cleanupArbeidsforhold(values.selvstendig_arbeidsforhold, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    return values;
};

const ArbeidIPeriodeSteps = ({ onValidSubmit, periode, stepID }: Props) => {
    const intl = useIntl();
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: {
            ansatt_arbeidsforhold,
            frilans_arbeidsforhold,
            frilans_harHattInntektSomFrilanser,
            selvstendig_harHattInntektSomSN,
            selvstendig_arbeidsforhold,
        },
    } = formikProps;

    const skalBesvareFrilans =
        frilans_harHattInntektSomFrilanser === YesOrNo.YES && frilans_arbeidsforhold !== undefined;

    const skalBesvareSelvstendig =
        selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_arbeidsforhold !== undefined;

    const subTitle = intlHelper(intl, 'arbeidIPeriode.subtitle', {
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
    });

    /**
     * Kontroller om bruker må sendes tilbake til arbeidssituasjon-steget
     * Dette kan oppstå dersom bruker er på Arbeidssituasjon,
     * endrer på data, og deretter trykker forward i nettleser
     * */

    // const brukerMåGåTilbakeTilArbeidssituasjon =
    //     skalBesvareAnsettelsesforhold === false && skalBesvareFrilans === false && skalBesvareSelvstendig === false;

    // if (brukerMåGåTilbakeTilArbeidssituasjon === true) {
    //     return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD_I_PERIODEN} />;
    // }

    // const intlValues: ArbeidIPeriodeIntlValues = {
    //     hvor: intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsforhold.navn }),
    // };

    const erHistorisk = stepID === StepID.ARBEID_HISTORISK;
    return (
        <FormikStep
            id={stepID}
            stepSubTitle={subTitle}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupStepData(values, erHistorisk)}>
            <Box padBottom="m">
                <CounsellorPanel>
                    <FormattedMessage
                        id={erHistorisk ? 'arbeidIPeriode.StepInfo.historisk' : 'arbeidIPeriode.StepInfo.planlagt'}
                        values={{
                            fra: prettifyDateFull(periode.from),
                            til: prettifyDateFull(periode.to),
                        }}
                    />
                </CounsellorPanel>
            </Box>

            <FormBlock>
                {ansatt_arbeidsforhold.map((arbeidsforhold, index) => {
                    return (
                        <FormSection title={arbeidsforhold.navn} key={arbeidsforhold.organisasjonsnummer}>
                            <ArbeidIPeriodeSpørsmål
                                arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                arbeidsforhold={arbeidsforhold}
                                periode={periode}
                                parentFieldName={`${AppFormField.ansatt_arbeidsforhold}.${index}`}
                                erHistorisk={erHistorisk}
                            />
                        </FormSection>
                    );
                })}
            </FormBlock>

            {skalBesvareFrilans && frilans_arbeidsforhold && (
                <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')}>
                    <ArbeidIPeriodeSpørsmål
                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                        arbeidsforhold={frilans_arbeidsforhold}
                        periode={periode}
                        parentFieldName={`${AppFormField.frilans_arbeidsforhold}`}
                        erHistorisk={erHistorisk}
                    />
                </FormSection>
            )}
            {skalBesvareSelvstendig && selvstendig_arbeidsforhold && (
                <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                    <ArbeidIPeriodeSpørsmål
                        arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                        arbeidsforhold={selvstendig_arbeidsforhold}
                        periode={periode}
                        parentFieldName={`${AppFormField.selvstendig_arbeidsforhold}`}
                        erHistorisk={erHistorisk}
                    />
                </FormSection>
            )}
        </FormikStep>
    );
};

export default ArbeidIPeriodeSteps;
