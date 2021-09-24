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
import ArbeidIPeriodeSpørsmål from '../../arbeidstid/ArbeidIPeriodeSpørsmål';
import { ArbeidsforholdType } from '../../../types';

interface Props extends StepConfigProps {
    periode: DateRange;
}

const cleanupArbeidsforholdCommon = (arbeidsforhold: Arbeidsforhold): Arbeidsforhold => {
    const a = { ...arbeidsforhold };
    return a;
};

const cleanupHistoriskArbeid = (formData: PleiepengesøknadFormData): PleiepengesøknadFormData => {
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

const HistoriskArbeidStep = ({ onValidSubmit, periode }: Props) => {
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

    const subTitle = intlHelper(intl, 'arbeidIPeriode.subtitle', {
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
    });

    return (
        <FormikStep
            id={StepID.ARBEID_HISTORISK}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={cleanupHistoriskArbeid}
            stepSubTitle={subTitle}>
            <Box padBottom="m">
                <CounsellorPanel>
                    <FormattedMessage
                        id={'arbeidIPeriode.StepInfo.historisk'}
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
                            <ArbeidIPeriodeSpørsmål
                                arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                arbeidsforhold={arbeidsforhold}
                                periode={periode}
                                parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                                erHistorisk={true}
                            />
                        </FormSection>
                    );
                })}
            </FormBlock>

            {skalBesvareFrilans && frilans_arbeidsforhold && (
                <FormBlock>
                    <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')} titleIcon={<BuildingIcon />}>
                        <ArbeidIPeriodeSpørsmål
                            arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                            arbeidsforhold={frilans_arbeidsforhold}
                            periode={periode}
                            parentFieldName={`${AppFormField.frilans_arbeidsforhold}`}
                            erHistorisk={true}
                        />
                    </FormSection>
                </FormBlock>
            )}
            {skalBesvareSelvstendig && selvstendig_arbeidsforhold && (
                <FormBlock>
                    <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')} titleIcon={<BuildingIcon />}>
                        <ArbeidIPeriodeSpørsmål
                            arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                            arbeidsforhold={selvstendig_arbeidsforhold}
                            periode={periode}
                            parentFieldName={`${AppFormField.selvstendig_arbeidsforhold}`}
                            erHistorisk={true}
                        />
                    </FormSection>
                </FormBlock>
            )}
        </FormikStep>
    );
};

export default HistoriskArbeidStep;
