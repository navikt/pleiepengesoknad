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
import { useFormikContext } from 'formik';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { ArbeidsforholdFormValues, ArbeidsforholdFormField } from '../../../types/ArbeidsforholdFormValues';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import { søknadErBasertPåForrigeSøknad } from '../../../utils/forrigeSøknadUtils';
import { useSøknadsdataContext } from '../../SøknadsdataContext';
import NormalarbeidstidSpørsmål from './normalarbeidstid-spørsmål/NormalarbeidstidSpørsmål';
import { AnsattNormalarbeidstidSnitt, ImportertSøknadMetadata } from '../../../types/ImportertSøknad';
import { Arbeidsgiver } from '../../../types';
import OfficeIcon from '../../../components/office-icon/OfficeIconSvg';
import ArbeidssituasjonPanel from './arbeidssituasjon-panel/ArbeidssituasjonPanel';
import { getYesOrNoRadios, renderTidsrom } from '../utils/FrilansOppdragUtils';

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

const getNormalarbeidstidForrigeSøknad = (
    arbeidsgiver: Arbeidsgiver,
    importertSøknadMetadata?: ImportertSøknadMetadata
): AnsattNormalarbeidstidSnitt | undefined => {
    if (!importertSøknadMetadata || !importertSøknadMetadata.ansattNormalarbeidstidSnitt) {
        return undefined;
    }
    return importertSøknadMetadata.ansattNormalarbeidstidSnitt.find((f) => f.id === arbeidsgiver.id);
};

const ArbeidssituasjonAnsatt: React.FC<Props> = ({ arbeidsforhold, parentFieldName, søknadsperiode }) => {
    const intl = useIntl();
    const erAvsluttet = arbeidsforhold.erAnsatt === YesOrNo.NO;

    const { values } = useFormikContext<SøknadFormValues>();
    const { importertSøknadMetadata } = useSøknadsdataContext();

    const timerPerUkeISnittForrigeSøknad = søknadErBasertPåForrigeSøknad(values, importertSøknadMetadata)
        ? getNormalarbeidstidForrigeSøknad(arbeidsforhold.arbeidsgiver, importertSøknadMetadata)
        : undefined;

    const getFieldName = (field: ArbeidsforholdFormField): ArbeidsforholdFormField =>
        `${parentFieldName}.${field}` as any;

    return (
        <div data-testid="arbeidssituasjonAnsatt">
            <ArbeidssituasjonPanel
                title={arbeidsforhold.arbeidsgiver.navn}
                description={renderTidsrom(arbeidsforhold.arbeidsgiver)}
                titleIcon={<OfficeIcon />}>
                <FormBlock margin="xl">
                    <Box>
                        <AnsattFormComponents.RadioGroup
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsatt.spm', {
                                navn: arbeidsforhold.arbeidsgiver.navn,
                            })}
                            data-testid="er-ansatt"
                            name={getFieldName(ArbeidsforholdFormField.erAnsatt)}
                            radios={getYesOrNoRadios(intl)}
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
                        {erAvsluttet && (
                            <Box padBottom={arbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.NO ? 'xl' : 'none'}>
                                <AlertStripeInfo>
                                    <FormattedMessage id="arbeidsforhold.ikkeAnsatt.info" />
                                </AlertStripeInfo>
                                <FormBlock>
                                    <AnsattFormComponents.RadioGroup
                                        legend={intlHelper(intl, 'arbeidsforhold.sluttetFørSøknadsperiode.spm', {
                                            navn: arbeidsforhold.arbeidsgiver.navn,
                                            fraDato: prettifyDateFull(søknadsperiode.from),
                                        })}
                                        data-testid="sluttet-før-søknadsperiode"
                                        name={getFieldName(ArbeidsforholdFormField.sluttetFørSøknadsperiode)}
                                        radios={getYesOrNoRadios(intl)}
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
                                timerPerUkeISnittForrigeSøknad={timerPerUkeISnittForrigeSøknad?.timerISnitt}
                            />
                        )}
                    </FormBlock>
                )}
            </ArbeidssituasjonPanel>
        </div>
    );
};

export default ArbeidssituasjonAnsatt;
