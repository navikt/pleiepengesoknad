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
import {
    getArbeidsformValidator,
    getJobberNormaltTimerValidator,
    isYesOrNoAnswered,
} from '../../../../validation/fieldValidations';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimer';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsatt;
    index: number;
}

const ArbeidsforholdFormPart: React.FunctionComponent<Props> = ({ arbeidsforhold, index }) => {
    const intl = useIntl();
    const erAvsluttet = arbeidsforhold.erAnsatt === YesOrNo.NO;

    const intlValues = {
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsforhold.navn }),
        jobber: erAvsluttet
            ? intlHelper(intl, 'arbeidsforhold.part.jobbet')
            : intlHelper(intl, 'arbeidsforhold.part.jobber'),
        arbeidsform: arbeidsforhold.arbeidsform
            ? intlHelper(intl, `arbeidsforhold.part.arbeidsform.${arbeidsforhold.arbeidsform}`)
            : undefined,
    };
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
                        legend={intlHelper(intl, 'arbeidsforhold.erAnsatt.spm', { navn: arbeidsforhold.navn })}
                        name={`${AppFormField.arbeidsforhold}.${index}.${ArbeidsforholdField.erAnsatt}` as any}
                        validate={(value) => {
                            return getYesOrNoValidator()(value)
                                ? {
                                      key: 'validation.arbeidsforhold.erAnsatt.yesOrNoIsUnanswered',
                                      values: { navn: arbeidsforhold.navn },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                    />
                </Box>
            </FormBlock>
            {isYesOrNoAnswered(arbeidsforhold.erAnsatt) && (
                <FormBlock margin="m">
                    <ResponsivePanel>
                        <ArbeidsformOgTimer
                            spørsmål={{
                                arbeidsform: intlHelper(
                                    intl,
                                    erAvsluttet
                                        ? 'arbeidsforhold.arbeidsform.avsluttet.spm'
                                        : 'arbeidsforhold.arbeidsform.spm',
                                    {
                                        arbeidsforhold: arbeidsforhold.navn,
                                    }
                                ),
                                jobberNormaltTimer: (arbeidsform) =>
                                    intlHelper(
                                        intl,
                                        erAvsluttet
                                            ? `arbeidsforhold.iDag.${arbeidsform}.avsluttet.spm`
                                            : `arbeidsforhold.iDag.${arbeidsform}.spm`,
                                        {
                                            arbeidsforhold: arbeidsforhold.navn,
                                        }
                                    ),
                            }}
                            validator={{
                                arbeidsform: getArbeidsformValidator(intlValues),
                                jobberNormaltTimer: getJobberNormaltTimerValidator(intlValues),
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
