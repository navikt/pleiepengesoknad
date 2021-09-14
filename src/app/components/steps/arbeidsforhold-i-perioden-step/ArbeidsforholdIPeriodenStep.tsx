import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { ArbeidsforholdType } from '../../../types/PleiepengesøknadApiData';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdSNF,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import { getAktiveArbeidsforholdMedOpprinneligIndex } from '../../../utils/arbeidsforholdUtils';
import { getSøknadsperiodeFromFormData } from '../../../utils/formDataUtils';
import FormikStep from '../../formik-step/FormikStep';
import InvalidStepPage from '../../pages/invalid-step-page/InvalidStepPage';
import ArbeidsforholdIPeriodenStepIntro from './ArbeidsforholdIPeriodenStepIntro';
import ArbeidsforholdISøknadsperiode from './ArbeidsforholdISøknadsperiode';

const cleanupArbeidsforholdCommon = (arbeidsforhold: Arbeidsforhold): Arbeidsforhold => {
    const a = { ...arbeidsforhold };
    if (a.skalJobbe !== ArbeidsforholdSkalJobbeSvar.ja) {
        a.skalJobbeHvorMye = undefined;
    }
    if (a.skalJobbeHvorMye !== ArbeidsforholdSkalJobbeHvorMyeSvar.redusert) {
        a.timerEllerProsent = undefined;
    }
    if (a.timerEllerProsent === undefined) {
        a.skalJobbeTimer = undefined;
        a.skalJobbeProsent = undefined;
    }
    return a;
};

const cleanupArbeidsforholdIPeriodenStep = (formData: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formData };
    values.arbeidsforhold = values.arbeidsforhold.map(
        (arbeidsforhold) => cleanupArbeidsforholdCommon(arbeidsforhold) as ArbeidsforholdAnsatt
    );
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? (cleanupArbeidsforholdCommon(values.frilans_arbeidsforhold) as ArbeidsforholdSNF)
        : undefined;
    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? (cleanupArbeidsforholdCommon(values.selvstendig_arbeidsforhold) as ArbeidsforholdSNF)
        : undefined;
    return values;
};

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: {
            arbeidsforhold,
            frilans_arbeidsforhold,
            frilans_harHattInntektSomFrilanser,
            frilans_sluttdato,
            selvstendig_harHattInntektSomSN,
            selvstendig_arbeidsforhold,
        },
    } = formikProps;

    const søknadsperiode = getSøknadsperiodeFromFormData(formikProps.values);
    if (!søknadsperiode) {
        return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD_I_PERIODEN} />;
    }

    const aktiveArbeidsforholdMedOpprinneligIndex = getAktiveArbeidsforholdMedOpprinneligIndex(
        arbeidsforhold,
        søknadsperiode
    );
    const skalBesvareAnsettelsesforhold = aktiveArbeidsforholdMedOpprinneligIndex.length > 0;
    const skalBesvareFrilans =
        frilans_harHattInntektSomFrilanser === YesOrNo.YES && frilans_arbeidsforhold !== undefined;
    const skalBesvareSelvstendig =
        selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_arbeidsforhold !== undefined;

    /**
     * Kontroller om bruker må sendes tilbake til arbeidssituasjon-steget
     * Dette kan oppstå dersom bruker er på Arbeidssituasjon,
     * endrer på data, og deretter trykker forward i nettleser
     * */

    const brukerMåGåTilbakeTilArbeidssituasjon =
        skalBesvareAnsettelsesforhold === false && skalBesvareFrilans === false && skalBesvareSelvstendig === false;

    if (brukerMåGåTilbakeTilArbeidssituasjon === true) {
        return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD_I_PERIODEN} />;
    }

    return (
        <FormikStep
            id={StepID.ARBEIDSFORHOLD_I_PERIODEN}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={cleanupArbeidsforholdIPeriodenStep}>
            <Box padBottom="m">
                <CounsellorPanel>
                    <ArbeidsforholdIPeriodenStepIntro
                        antallAnsettelsesforhold={aktiveArbeidsforholdMedOpprinneligIndex.length}
                        skalBesvareAnsettelsesforhold={skalBesvareAnsettelsesforhold}
                        skalBesvareFrilans={skalBesvareFrilans}
                        skalBesvareSelvstendig={skalBesvareSelvstendig}
                    />
                </CounsellorPanel>
            </Box>
            {skalBesvareAnsettelsesforhold && (
                <Box margin="xl">
                    {aktiveArbeidsforholdMedOpprinneligIndex.map(({ arbeidsforhold, index }) => {
                        return (
                            <FormSection
                                title={arbeidsforhold.navn}
                                key={arbeidsforhold.organisasjonsnummer}
                                titleIcon={<BuildingIcon />}>
                                <ArbeidsforholdISøknadsperiode
                                    arbeidsforhold={arbeidsforhold}
                                    arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                    søknadsperiode={søknadsperiode}
                                    avsluttetDato={
                                        arbeidsforhold.erAnsatt === YesOrNo.NO
                                            ? datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato)
                                            : undefined
                                    }
                                    parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                                />
                            </FormSection>
                        );
                    })}
                </Box>
            )}
            {skalBesvareFrilans && frilans_arbeidsforhold && (
                <Box margin="xl">
                    <FormSection
                        title={intlHelper(intl, 'step.arbeidsforholdIPerioden.FrilansLabel')}
                        titleIcon={<BuildingIcon />}>
                        <ArbeidsforholdISøknadsperiode
                            arbeidsforhold={frilans_arbeidsforhold}
                            arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                            søknadsperiode={søknadsperiode}
                            parentFieldName={AppFormField.frilans_arbeidsforhold}
                            avsluttetDato={datepickerUtils.getDateFromDateString(frilans_sluttdato)}
                        />
                    </FormSection>
                </Box>
            )}
            {skalBesvareSelvstendig && selvstendig_arbeidsforhold && (
                <Box margin="xl">
                    <FormSection
                        title={intlHelper(intl, 'step.arbeidsforholdIPerioden.SNLabel')}
                        titleIcon={<BuildingIcon />}>
                        <ArbeidsforholdISøknadsperiode
                            arbeidsforhold={selvstendig_arbeidsforhold}
                            arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                            søknadsperiode={søknadsperiode}
                            parentFieldName={AppFormField.selvstendig_arbeidsforhold}
                        />
                    </FormSection>
                </Box>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
