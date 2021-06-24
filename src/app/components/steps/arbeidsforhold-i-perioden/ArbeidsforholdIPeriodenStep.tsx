import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import BuildingIcon from '@navikt/sif-common-core/lib/components/building-icon/BuildingIconSvg';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import ArbeidsforholdDetaljer from '../../arbeidsforhold-detaljer/ArbeidsforholdDetaljer';
import ArbeidsforholdSNFDetaljer from '../../arbeidsforhold-detaljer/ArbeidsforholdSNFDetaljer';
import FormikStep from '../../formik-step/FormikStep';

const ArbeidsforholdIPeriodenStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values: {
            arbeidsforhold,
            frilans_arbeidsforhold,
            frilans_jobberFortsattSomFrilans,
            selvstendig_harHattInntektSomSN,
            selvstendig_arbeidsforhold,
        },
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
                    <p style={{ marginTop: 0 }}>
                        {/* Todo: lage tekst dynamisk i forhold til hva bruker har valgt */}
                        <FormattedMessage id="step.arbeidsforholdIPerioden.StepInfo.1" />
                    </p>
                    <p>
                        <FormattedMessage id="step.arbeidsforholdIPerioden.StepInfo.2" />
                    </p>
                </CounsellorPanel>
            </Box>
            <Box margin="xl">
                <div className="arbeidsforhold">
                    {aktiveArbeidsforhold.map(({ arbeidsforhold, index }) => (
                        <FormSection
                            title={arbeidsforhold.navn}
                            key={arbeidsforhold.organisasjonsnummer}
                            titleIcon={<BuildingIcon />}>
                            <ArbeidsforholdDetaljer arbeidsforhold={arbeidsforhold} index={index} />
                        </FormSection>
                    ))}
                </div>
            </Box>
            {frilans_jobberFortsattSomFrilans && frilans_arbeidsforhold && (
                <Box margin="xl">
                    <div className="arbeidsforhold">
                        <FormSection
                            title={intlHelper(intl, 'step.arbeidsforholdIPerioden.FrilansLabel')}
                            titleIcon={<BuildingIcon />}>
                            <ArbeidsforholdSNFDetaljer
                                frilansEllerSelvstendig="frilans"
                                snF_arbeidsforhold={frilans_arbeidsforhold}
                                appFormField={AppFormField.frilans_arbeidsforhold}
                            />
                        </FormSection>
                    </div>
                </Box>
            )}
            {selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_arbeidsforhold && (
                <Box margin="xl">
                    <div className="arbeidsforhold">
                        <FormSection
                            title={intlHelper(intl, 'step.arbeidsforholdIPerioden.SNLabel')}
                            titleIcon={<BuildingIcon />}>
                            <ArbeidsforholdSNFDetaljer
                                frilansEllerSelvstendig="selvstendig"
                                snF_arbeidsforhold={selvstendig_arbeidsforhold}
                                appFormField={AppFormField.selvstendig_arbeidsforhold}
                            />
                        </FormSection>
                    </div>
                </Box>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdIPeriodenStep;
