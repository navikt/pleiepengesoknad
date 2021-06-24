import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { Undertittel } from 'nav-frontend-typografi';
import { AppFormField, ArbeidsforholdAnsatt, ArbeidsforholdField } from '../../../../types/PleiepengesøknadFormData';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimer';
import { getArbeidsformAnsattValidator, getJobberNormaltTimerValidator } from '../../../../validation/fieldValidations';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsatt;
    index: number;
}

const ArbeidsforholdFormPart: React.FunctionComponent<Props> = ({ arbeidsforhold, index }) => {
    const intl = useIntl();
    return (
        <>
            <FormBlock key={arbeidsforhold.organisasjonsnummer} margin="xl">
                <Box padBottom="m">
                    <Undertittel tag="h3" style={{ fontWeight: 'normal' }}>
                        {arbeidsforhold.navn}
                    </Undertittel>
                </Box>
                <Box>
                    <AppForm.YesOrNoQuestion
                        legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                        name={`${AppFormField.arbeidsforhold}.${index}.${ArbeidsforholdField.erAnsattIPerioden}` as any}
                        validate={(value) => {
                            return getYesOrNoValidator()(value)
                                ? {
                                      key: 'validation.arbeidsforhold.erAnsattIPerioden.yesOrNoIsUnanswered',
                                      values: { navn: arbeidsforhold.navn },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                    />
                </Box>
            </FormBlock>
            {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                <FormBlock margin="m">
                    <ResponsivePanel>
                        <ArbeidsformOgTimer
                            spørsmål={{
                                arbeidsform: intlHelper(intl, 'arbeidsforhold.arbeidsform.spm', {
                                    arbeidsforhold: arbeidsforhold.navn,
                                }),
                                jobberNormaltTimer: (arbeidsform) =>
                                    intlHelper(intl, `arbeidsforhold.iDag.${arbeidsform}.spm`, {
                                        arbeidsforhold: arbeidsforhold.navn,
                                    }),
                            }}
                            validator={{
                                arbeidsform: getArbeidsformAnsattValidator(arbeidsforhold),
                                jobberNormaltTimer: getJobberNormaltTimerValidator(arbeidsforhold),
                            }}
                            arbeidsforhold={arbeidsforhold}
                            parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidsforholdFormPart;
