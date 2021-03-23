import React from 'react';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikArbeidsforholdfrilansDetaljer from '../../formik-arbeidsforholdDetaljer/FormikArbeidsforholdFrilansDetaljer';
import FormikArbeidsforholdDetaljer from '../../formik-arbeidsforholdDetaljer/FormikArbeidsforholdDetaljer';
import FormikStep from '../../formik-step/FormikStep';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: { arbeidsforhold, frilans_arbeidsforhold, frilans_jobberFortsattSomFrilans },
    } = formikProps;

    // Index må være samme på tvers av alle arbeidsforhold, også dem som en ikke er ansatt i
    const aktiveArbeidsforhold = arbeidsforhold
        .map((arbeidsforhold, index) => ({
            index,
            arbeidsforhold,
        }))
        .filter((a) => a.arbeidsforhold.erAnsattIPerioden === YesOrNo.YES);
    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD_I_PERIODEN} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="m">
                <CounsellorPanel>
                    Her skal du opplyse om du skal jobbe noe i samme periode som du skal ha pleiepenger. Det kan for
                    eksempel være at kan jobbe fordi du skal dele pleiepengene med en annen omsorgsperson, eller at
                    barnet skal være noe på skolen eller i barnehagen.
                </CounsellorPanel>
            </Box>
            <Box margin="xl">
                <div className="arbeidsforhold">
                    {aktiveArbeidsforhold.map(({ arbeidsforhold, index }) => (
                        <FormSection
                            title={arbeidsforhold.navn}
                            key={arbeidsforhold.organisasjonsnummer}
                            titleIcon={<BuildingIcon />}>
                            <FormikArbeidsforholdDetaljer arbeidsforhold={arbeidsforhold} index={index} />
                        </FormSection>
                    ))}
                </div>
            </Box>
            {frilans_jobberFortsattSomFrilans === YesOrNo.YES && frilans_arbeidsforhold && (
                <Box margin="xl">
                    <div className="arbeidsforhold">
                        <FormSection title="Frilans" titleIcon={<BuildingIcon />}>
                            <FormikArbeidsforholdfrilansDetaljer frilans_arbeidsforhold={frilans_arbeidsforhold} />
                        </FormSection>
                    </div>
                </Box>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
