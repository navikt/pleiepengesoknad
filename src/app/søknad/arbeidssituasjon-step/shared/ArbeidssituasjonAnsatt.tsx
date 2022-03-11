import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import { Arbeidsforhold, ArbeidsforholdFormField } from '../../../types/Arbeidsforhold';
import InfoJobberNormaltTimerAnsatt from './info/InfoJobberNormaltTimerAnsatt';
import { getJobberNormaltTimerValidator } from './validation/jobberNormaltTimerValidator';

const AnsattFormComponents = getTypedFormComponents<ArbeidsforholdFormField, Arbeidsforhold, ValidationError>();

interface Props {
    arbeidsforhold: Arbeidsforhold;
    parentFieldName: string;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonAnsatt: React.FC<Props> = ({ arbeidsforhold, parentFieldName, søknadsperiode }) => {
    const intl = useIntl();
    const erAvsluttet = arbeidsforhold.erAnsatt === YesOrNo.NO;

    const intlValues = {
        hvor: intlHelper(intl, 'arbeidsforhold.part.som.ANSATT', { navn: arbeidsforhold.arbeidsgiver.navn }),
        jobber: erAvsluttet
            ? intlHelper(intl, 'arbeidsforhold.part.jobbet')
            : intlHelper(intl, 'arbeidsforhold.part.jobber'),
        periodeFra: prettifyDateFull(søknadsperiode.from),
        periodeTil: prettifyDateFull(søknadsperiode.to),
    };

    const getFieldName = (field: ArbeidsforholdFormField): ArbeidsforholdFormField =>
        `${parentFieldName}.${field}` as any;

    return (
        <>
            <FormBlock margin="xl">
                <Box padBottom="m">
                    <Undertittel tag="h3" style={{ fontWeight: 'normal' }}>
                        {arbeidsforhold.arbeidsgiver.navn}
                    </Undertittel>
                </Box>
                <Box>
                    <AnsattFormComponents.YesOrNoQuestion
                        legend={intlHelper(intl, 'arbeidsforhold.erAnsatt.spm', {
                            navn: arbeidsforhold.arbeidsgiver.navn,
                        })}
                        name={getFieldName(ArbeidsforholdFormField.erAnsatt)}
                        validate={(value) => {
                            return getYesOrNoValidator()(value)
                                ? {
                                      key: 'validation.arbeidsforhold.erAnsatt.yesOrNoIsUnanswered',
                                      values: { navn: arbeidsforhold.arbeidsgiver.navn },
                                      keepKeyUnaltered: true,
                                  }
                                : undefined;
                        }}
                    />
                </Box>
            </FormBlock>
            {(arbeidsforhold.erAnsatt === YesOrNo.YES || arbeidsforhold.erAnsatt === YesOrNo.NO) && (
                <FormBlock margin="l">
                    <ResponsivePanel>
                        {erAvsluttet && (
                            <Box padBottom={arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO ? 'xl' : 'none'}>
                                <AlertStripeInfo>
                                    <FormattedMessage id="arbeidsforhold.ikkeAnsatt.info" />
                                </AlertStripeInfo>
                                <FormBlock>
                                    <AnsattFormComponents.YesOrNoQuestion
                                        name={getFieldName(ArbeidsforholdFormField.sluttetFørSøknadsperiode)}
                                        legend={intlHelper(intl, 'arbeidsforhold.sluttetFørSøknadsperiode.spm', {
                                            navn: arbeidsforhold.arbeidsgiver.navn,
                                            fraDato: prettifyDateFull(søknadsperiode.from),
                                        })}
                                        validate={(value) => {
                                            const error = getRequiredFieldValidator()(value);
                                            return error
                                                ? {
                                                      key: 'validation.arbeidsforhold.sluttetFørSøknadsperiode.yesOrNoIsUnanswered',
                                                      values: {
                                                          navn: arbeidsforhold.arbeidsgiver.navn,
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
                            <>
                                <AnsattFormComponents.YesOrNoQuestion
                                    name={getFieldName(ArbeidsforholdFormField.harFraværIPeriode)}
                                    legend={intlHelper(intl, 'arbeidsforhold.harFraværIPerioden.spm', {
                                        navn: arbeidsforhold.arbeidsgiver.navn,
                                    })}
                                    validate={(value: any) => {
                                        const error = getYesOrNoValidator()(value);
                                        if (error) {
                                            return {
                                                key: 'validation.arbeidsforhold.harFraværIPeriode.yesOrNoIsUnanswered',
                                                keepKeyUnaltered: true,
                                                values: { navn: arbeidsforhold.arbeidsgiver.navn },
                                            };
                                        }
                                        return undefined;
                                    }}
                                />
                                <FormBlock>
                                    <AnsattFormComponents.NumberInput
                                        label={intlHelper(
                                            intl,
                                            erAvsluttet
                                                ? `arbeidsforhold.jobberNormaltTimer.avsluttet.spm`
                                                : `arbeidsforhold.jobberNormaltTimer.spm`,
                                            {
                                                navn: arbeidsforhold.arbeidsgiver.navn,
                                            }
                                        )}
                                        name={getFieldName(ArbeidsforholdFormField.jobberNormaltTimer)}
                                        suffix={intlHelper(intl, `arbeidsforhold.timer.suffix`)}
                                        suffixStyle="text"
                                        description={<InfoJobberNormaltTimerAnsatt />}
                                        bredde="XS"
                                        validate={getJobberNormaltTimerValidator(intlValues)}
                                        value={arbeidsforhold ? arbeidsforhold.jobberNormaltTimer || '' : ''}
                                    />{' '}
                                </FormBlock>
                            </>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </>
    );
};

export default ArbeidssituasjonAnsatt;
