import React from 'react';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import FormikArbeidsforholdDetaljer from '../../formik-arbeidsforholdDetaljer/FormikArbeidsforholdDetaljer';
import FormikStep from '../../formik-step/FormikStep';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: { arbeidsforhold },
    } = formikProps;

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD_I_PERIODEN} onValidFormSubmit={onValidSubmit}>
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
