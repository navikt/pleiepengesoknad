import React from 'react';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikArbeidsforholdDetaljer from '../../formik-arbeidsforholdDetaljer/FormikArbeidsforholdDetaljer';
import FormikStep from '../../formik-step/FormikStep';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: { arbeidsforhold },
    } = formikProps;

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD_I_PERIODEN} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="m">
                <CounsellorPanel>
                    Informasjon om at dette er arbeidsforhold som er har valgt på forrige side, og at vi trenger litt
                    mer info om disse.
                </CounsellorPanel>
            </Box>
            <div className="arbeidsforhold">
                {arbeidsforhold.map((arbeidsforhold, index) => (
                    <FormSection
                        title={arbeidsforhold.navn}
                        key={arbeidsforhold.organisasjonsnummer}
                        titleIcon={<BuildingIcon />}>
                        <FormikArbeidsforholdDetaljer arbeidsforhold={arbeidsforhold} index={index} />
                    </FormSection>
                ))}
            </div>
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
