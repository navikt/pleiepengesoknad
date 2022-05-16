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
import { ArbeidsforholdFormData, ArbeidsforholdFormField } from '../../../types/ArbeidsforholdFormData';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';

const AnsattFormComponents = getTypedFormComponents<ArbeidsforholdFormField, ArbeidsforholdFormData, ValidationError>();

interface Props {
    arbeidsforhold: ArbeidsforholdFormData;
    parentFieldName: string;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonAnsatt: React.FC<Props> = ({ arbeidsforhold, parentFieldName, søknadsperiode }) => {
    const intl = useIntl();
    const erAvsluttet = arbeidsforhold.erAnsatt === YesOrNo.NO;

    const getFieldName = (field: ArbeidsforholdFormField): ArbeidsforholdFormField =>
        `${parentFieldName}.${field}` as any;

    return (
        <div data-testid="arbeidssituasjonAnsatt">
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
                        data-testid="er-ansatt"
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
                                <NormalarbeidstidSpørsmål
                                    arbeidsforhold={arbeidsforhold}
                                    arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                    arbeidsstedNavn={arbeidsforhold.arbeidsgiver.navn}
                                    erAktivtArbeidsforhold={arbeidsforhold.erAnsatt === YesOrNo.YES}
                                    arbeidsforholdFieldName={parentFieldName}
                                    brukKunSnittPerUke={false}
                                />
                            </>
                        )}
                    </ResponsivePanel>
                </FormBlock>
            )}
        </div>
    );
};

export default ArbeidssituasjonAnsatt;
