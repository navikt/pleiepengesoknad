import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import { AppFormField, ArbeidsforholdAnsatt, ArbeidsforholdField } from '../../../../types/PleiepengesøknadFormData';
import { sluttdatoErISøknadsperiode } from '../../../../utils/arbeidsforholdUtils';
import {
    getArbeidsforholdSluttdatoValidator,
    getArbeidsformAnsattValidator,
    getJobberNormaltTimerValidator,
    isYesOrNoAnswered,
} from '../../../../validation/fieldValidations';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimer';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface Props {
    arbeidsforhold: ArbeidsforholdAnsatt;
    søknadsperiode: DateRange;
    index: number;
}

const ArbeidsforholdFormPart: React.FunctionComponent<Props> = ({ arbeidsforhold, søknadsperiode, index }) => {
    const intl = useIntl();
    const dateYesterday = dayjs(dateToday).subtract(1, 'day').toDate();
    const erAvsluttetArbeidsforhold = arbeidsforhold.erAnsatt === YesOrNo.NO;
    const erAvsluttetISøknadsperioden =
        arbeidsforhold.erAnsatt === YesOrNo.NO &&
        sluttdatoErISøknadsperiode(arbeidsforhold.sluttdato, søknadsperiode) === true;

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
                        {erAvsluttetArbeidsforhold && (
                            <AppForm.DatePicker
                                label={intlHelper(intl, 'arbeidsforhold.sluttdato.spm', { navn: arbeidsforhold.navn })}
                                name={`${AppFormField.arbeidsforhold}.${index}.${ArbeidsforholdField.sluttdato}` as any}
                                maxDate={dateYesterday}
                                validate={getArbeidsforholdSluttdatoValidator({
                                    arbeidsforhold,
                                    maksDato: dateYesterday,
                                })}
                            />
                        )}
                        {(arbeidsforhold.erAnsatt === YesOrNo.YES || erAvsluttetISøknadsperioden) && (
                            <>
                                {erAvsluttetISøknadsperioden && (
                                    <Box margin="l">
                                        <AlertStripeInfo>
                                            Sluttdato var innenfor perioden du søker om pleiepenger. Vi trenger derfor å
                                            vite hvordan normalarbeidstiden din var hos {arbeidsforhold.navn}.
                                        </AlertStripeInfo>
                                    </Box>
                                )}
                                <FormBlock margin={arbeidsforhold.erAnsatt === YesOrNo.NO ? undefined : 'none'}>
                                    <ArbeidsformOgTimer
                                        spørsmål={{
                                            arbeidsform: intlHelper(
                                                intl,
                                                erAvsluttetArbeidsforhold
                                                    ? 'arbeidsforhold.arbeidsform.avsluttet.spm'
                                                    : 'arbeidsforhold.arbeidsform.spm',
                                                {
                                                    arbeidsforhold: arbeidsforhold.navn,
                                                }
                                            ),
                                            jobberNormaltTimer: (arbeidsform) =>
                                                intlHelper(
                                                    intl,
                                                    erAvsluttetArbeidsforhold
                                                        ? `arbeidsforhold.iDag.${arbeidsform}.avsluttet.spm`
                                                        : `arbeidsforhold.iDag.${arbeidsform}.spm`,
                                                    {
                                                        arbeidsforhold: arbeidsforhold.navn,
                                                    }
                                                ),
                                        }}
                                        validator={{
                                            arbeidsform: getArbeidsformAnsattValidator(arbeidsforhold),
                                            jobberNormaltTimer: getJobberNormaltTimerValidator(arbeidsforhold),
                                        }}
                                        arbeidsforhold={arbeidsforhold}
                                        parentFieldName={`${AppFormField.arbeidsforhold}.${index}`}
                                    />
                                </FormBlock>
                            </>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidsforholdFormPart;
