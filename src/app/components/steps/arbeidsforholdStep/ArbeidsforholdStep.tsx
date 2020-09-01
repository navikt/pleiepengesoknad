import * as React from 'react';
import Box from '@sif-common/core/components/box/Box';
import CounsellorPanel from '@sif-common/core/components/counsellor-panel/CounsellorPanel';
import { FormattedMessage } from 'react-intl';
import FormBlock from '@sif-common/core/components/form-block/FormBlock';
import FormSection from '../../../pre-common/form-section/FormSection';
import BuildingIcon from '@sif-common/core/components/building-icon/BuildingIconSvg';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import AlertStripe from 'nav-frontend-alertstriper';
import FrilansFormPart from './FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';
import { useFormikContext } from 'formik';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';

const ArbeidsforholdStep = () => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values,
        values: { arbeidsforhold },
    } = formikProps;

    return (
        <div>
            <Box padBottom="m">
                <CounsellorPanel>
                    <FormattedMessage
                        id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html"
                        values={{ p: (msg: string) => <p>{msg}</p> }}
                    />
                </CounsellorPanel>
            </Box>
            {arbeidsforhold.length > 0 && (
                <>
                    {arbeidsforhold.map((forhold, index) => (
                        <FormBlock key={forhold.organisasjonsnummer}>
                            <FormSection
                                titleTag="h4"
                                title={forhold.navn}
                                titleIcon={<BuildingIcon />}
                                indentContent={false}>
                                <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                            </FormSection>
                        </FormBlock>
                    ))}
                </>
            )}

            {arbeidsforhold.length === 0 && <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />}

            <Box margin="l">
                <AlertStripe type="info">
                    <FormattedMessage id="steg.arbeidsforhold.manglesOpplysninger" />
                </AlertStripe>
            </Box>

            <Box margin="xl">
                <FormSection title="Frilansere og selvstendig næringsdrivende">
                    <FormBlock>
                        <FrilansFormPart formValues={values} />
                    </FormBlock>
                    <FormBlock>
                        <SelvstendigNæringsdrivendeFormPart formValues={values} />
                    </FormBlock>
                </FormSection>
            </Box>
        </div>
    );
};

export default ArbeidsforholdStep;
