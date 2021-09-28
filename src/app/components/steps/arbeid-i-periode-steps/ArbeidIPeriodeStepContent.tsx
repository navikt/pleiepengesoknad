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
import { StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ArbeidIPeriodeSpørsmål from '../../arbeidstid/ArbeidIPeriodeSpørsmål';
import { ArbeidsforholdType } from '../../../types';

interface Props {
    periode: DateRange;
    stepID: StepID.ARBEID_HISTORISK | StepID.ARBEID_PLANLAGT;
}

const ArbeidIPeriodeStepContent = ({ periode, stepID }: Props) => {
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
        <>
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
        </>
    );
};

export default ArbeidIPeriodeStepContent;
