import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { Undertittel } from 'nav-frontend-typografi';
import { AppFormField, ArbeidsforholdAnsatt, ArbeidsforholdField } from '../../../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../../../validation/fieldValidations';
import AppForm from '../../../app-form/AppForm';
import ArbeidsformOgTimer from './ArbeidsformOgTimerFormPart';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { getArbeidsformValidator, getJobberNormaltTimerValidator } from '../../../../validation/validateArbeidFields';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdType } from '../../../../types';

interface Props {
    søkerKunHistoriskPeriode: boolean;
    arbeidsforhold: ArbeidsforholdAnsatt;
    index: number;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonAnsatt: React.FunctionComponent<Props> = ({
    arbeidsforhold,
    søkerKunHistoriskPeriode,
    index,
    søknadsperiode,
}) => {
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
        periodeFra: prettifyDateFull(søknadsperiode.from),
        periodeTil: prettifyDateFull(søknadsperiode.to),
    };

    const erHistorisk = søkerKunHistoriskPeriode;
    const parentFieldName = `${AppFormField.ansatt_arbeidsforhold}.${index}`;

    const getFieldName = (field: ArbeidsforholdField): AppFormField => `${parentFieldName}.${field}` as AppFormField;

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
                        legend={intlHelper(
                            intl,
                            erHistorisk ? 'arbeidsforhold.erAnsatt.historisk.spm' : 'arbeidsforhold.erAnsatt.spm',
                            { navn: arbeidsforhold.navn }
                        )}
                        name={getFieldName(ArbeidsforholdField.erAnsatt)}
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
                <FormBlock margin="l">
                    <ResponsivePanel>
                        {erAvsluttet && (
                            <Box padBottom={arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO ? 'xl' : 'none'}>
                                <AlertStripeInfo>
                                    <FormattedMessage id="arbeidsforhold.ikkeAnsatt.info" />
                                </AlertStripeInfo>
                                <FormBlock>
                                    <AppForm.YesOrNoQuestion
                                        name={getFieldName(ArbeidsforholdField.sluttetFørSøknadsperiode)}
                                        legend={intlHelper(intl, 'arbeidsforhold.sluttetFørSøknadsperiode.spm', {
                                            navn: arbeidsforhold.navn,
                                            fraDato: prettifyDateFull(søknadsperiode.from),
                                        })}
                                        validate={(value) => {
                                            const error = getRequiredFieldValidator()(value);
                                            return error
                                                ? {
                                                      key: 'validation.arbeidsforhold.sluttetFørSøknadsperiode.yesOrNoIsUnanswered',
                                                      values: {
                                                          navn: arbeidsforhold.navn,
                                                          fraDato: prettifyDateFull(søknadsperiode.from),
                                                      },
                                                      keepKeyUnaltered: true,
                                                  }
                                                : undefined;
                                        }}
                                    />
                                </FormBlock>
                            </Box>
                        )}
                        {((erAvsluttet && arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO) || !erAvsluttet) && (
                            <ArbeidsformOgTimer
                                arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                erAvsluttet={
                                    arbeidsforhold.erAnsatt === YesOrNo.NO &&
                                    arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO
                                        ? true
                                        : false
                                }
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
                                                ? `arbeidsforhold.${arbeidsform}.avsluttet.spm`
                                                : `arbeidsforhold.${arbeidsform}.spm`,
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
                                parentFieldName={parentFieldName}
                            />
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidssituasjonAnsatt;