import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
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
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import ArbeidIPeriodeFormPart from './ArbeidIPeriodeFormPart';
import { ArbeidsforholdType } from '../../../types/PleiepengesøknadApiData';

interface Props extends StepConfigProps {
    periode: DateRange;
    erHistorisk: boolean;
}

const cleanupArbeidsforholdCommon = (arbeidsforhold: Arbeidsforhold): Arbeidsforhold => {
    const a = { ...arbeidsforhold };
    return a;
};

const cleanupArbeidsforholdIPeriodeStep = (formData: PleiepengesøknadFormData): PleiepengesøknadFormData => {
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

const ArbeidIPeriodeStep = ({ onValidSubmit, periode, erHistorisk }: Props) => {
    const intl = useIntl();
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: {
            arbeidsforhold,
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

    return (
        <FormikStep
            id={erHistorisk ? StepID.ARBEID_HISTORISK : StepID.ARBEID_PLANLAGT}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={cleanupArbeidsforholdIPeriodeStep}>
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
                {arbeidsforhold.map((arbeidsforhold, index) => {
                    return (
                        <FormSection
                            titleTag="h3"
                            title={arbeidsforhold.navn}
                            key={arbeidsforhold.organisasjonsnummer}
                            titleIcon={<BuildingIcon />}>
                            <ArbeidIPeriodeFormPart
                                arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                arbeidsforhold={arbeidsforhold}
                                periode={periode}
                                parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                                erHistorisk={erHistorisk}
                            />
                        </FormSection>
                    );
                })}
            </FormBlock>

            {skalBesvareFrilans && frilans_arbeidsforhold && (
                <FormBlock>
                    <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')} titleIcon={<BuildingIcon />}>
                        <ArbeidIPeriodeFormPart
                            arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                            arbeidsforhold={frilans_arbeidsforhold}
                            periode={periode}
                            parentFieldName={`${AppFormField.frilans_arbeidsforhold}`}
                            erHistorisk={erHistorisk}
                        />
                    </FormSection>
                </FormBlock>
            )}
            {skalBesvareSelvstendig && selvstendig_arbeidsforhold && (
                <FormBlock>
                    <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')} titleIcon={<BuildingIcon />}>
                        <ArbeidIPeriodeFormPart
                            arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                            arbeidsforhold={selvstendig_arbeidsforhold}
                            periode={periode}
                            parentFieldName={`${AppFormField.selvstendig_arbeidsforhold}`}
                            erHistorisk={erHistorisk}
                        />
                    </FormSection>
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default ArbeidIPeriodeStep;
