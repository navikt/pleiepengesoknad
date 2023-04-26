import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getTypedFormComponents, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { ArbeidsforholdFormValues, ArbeidsforholdFormField } from '../../../types/ArbeidsforholdFormValues';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import ArbeidssituasjonPanel from './arbeidssituasjon-panel/ArbeidssituasjonPanel';
import OfficeIconSvg from '../../../components/office-icon/OfficeIconSvg';
import { renderTidsrom } from './frilansoppdrag-liste/FrilansoppdragListe';

const AnsattFormComponents = getTypedFormComponents<
    ArbeidsforholdFormField,
    ArbeidsforholdFormValues,
    ValidationError
>();

interface Props {
    arbeidsforhold: ArbeidsforholdFormValues;
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
            <ArbeidssituasjonPanel
                title={arbeidsforhold.arbeidsgiver.navn}
                titleIcon={<OfficeIconSvg />}
                description={renderTidsrom(arbeidsforhold.arbeidsgiver)}>
                <Box>
                    <AnsattFormComponents.RadioGroup
                        legend={intlHelper(intl, 'arbeidsforhold.erAnsatt.spm', {
                            navn: arbeidsforhold.arbeidsgiver.navn,
                        })}
                        data-testid="er-ansatt"
                        name={getFieldName(ArbeidsforholdFormField.erAnsatt)}
                        radios={[
                            {
                                label: 'Ja',
                                value: YesOrNo.YES,
                                'data-testid': 'er-ansatt_yes',
                            },
                            {
                                label: 'Nei',
                                value: YesOrNo.NO,
                                'data-testid': 'er-ansatt_no',
                            },
                        ]}
                        checked={arbeidsforhold.erAnsatt}
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

                {(arbeidsforhold.erAnsatt === YesOrNo.YES || arbeidsforhold.erAnsatt === YesOrNo.NO) && (
                    <FormBlock margin="l">
                        {erAvsluttet && (
                            <Box padBottom={arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO ? 'xl' : 'none'}>
                                <AlertStripeInfo>
                                    <FormattedMessage id="arbeidsforhold.ikkeAnsatt.info" />
                                </AlertStripeInfo>
                                <FormBlock>
                                    <AnsattFormComponents.RadioGroup
                                        name={getFieldName(ArbeidsforholdFormField.sluttetFørSøknadsperiode)}
                                        legend={intlHelper(intl, 'arbeidsforhold.sluttetFørSøknadsperiode.spm', {
                                            navn: arbeidsforhold.arbeidsgiver.navn,
                                            fraDato: prettifyDateFull(søknadsperiode.from),
                                        })}
                                        radios={[
                                            {
                                                label: 'Ja',
                                                value: YesOrNo.YES,
                                                'data-testid': 'sluttet-før-søknadsperiode_yes',
                                            },
                                            {
                                                label: 'Nei',
                                                value: YesOrNo.NO,
                                                'data-testid': 'sluttet-før-søknadsperiode_no',
                                            },
                                        ]}
                                        checked={arbeidsforhold.sluttetFørSøknadsperiode}
                                        data-testid="sluttet-før-søknadsperiode"
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
                            <NormalarbeidstidSpørsmål
                                arbeidsforhold={arbeidsforhold}
                                arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                arbeidsstedNavn={arbeidsforhold.arbeidsgiver.navn}
                                erAktivtArbeidsforhold={arbeidsforhold.erAnsatt === YesOrNo.YES}
                                arbeidsforholdFieldName={parentFieldName}
                                brukKunSnittPerUke={false}
                            />
                        )}
                    </FormBlock>
                )}
            </ArbeidssituasjonPanel>
        </div>
    );
};

export default ArbeidssituasjonAnsatt;
