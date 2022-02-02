import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../../utils/ansattUtils';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import ArbeidIPeriodeSpørsmål from './ArbeidIPeriodeSpørsmål';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';

interface Props {
    periode: DateRange;
}

const ArbeidIPeriodeStepContent = ({ periode }: Props) => {
    const intl = useIntl();
    const formikProps = useFormikContext<SøknadFormData>();
    const {
        values: {
            ansatt_arbeidsforhold,
            frilans_arbeidsforhold,
            frilans_harHattInntektSomFrilanser,
            selvstendig_harHattInntektSomSN,
            selvstendig_virksomhet,
            frilans_startdato,
            frilans_sluttdato,
            frilans_jobberFortsattSomFrilans,
            selvstendig_arbeidsforhold,
        },
    } = formikProps;

    const erFrilanser = frilans_harHattInntektSomFrilanser === YesOrNo.YES && frilans_arbeidsforhold !== undefined;
    const erSN = selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_virksomhet !== undefined;

    const arbeidsperiodeFrilans = erFrilanser
        ? getPeriodeSomFrilanserInnenforPeriode(periode, {
              frilans_startdato,
              frilans_sluttdato,
              frilans_jobberFortsattSomFrilans,
          })
        : undefined;

    const arbeidsperiodeSelvstendig = erSN
        ? getPeriodeSomSelvstendigInnenforPeriode(periode, selvstendig_virksomhet.fom)
        : undefined;

    const skalBesvareSelvstendig =
        selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_arbeidsforhold !== undefined;

    return (
        <>
            <Box padBottom="m">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage
                            id={'arbeidIPeriode.StepInfo.1'}
                            values={{
                                fra: prettifyDateFull(periode.from),
                                til: prettifyDateFull(periode.to),
                            }}
                        />
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidIPeriode.StepInfo.2'} />
                    </p>
                </CounsellorPanel>
            </Box>

            {ansatt_arbeidsforhold.length > 0 && (
                <FormBlock>
                    {ansatt_arbeidsforhold.map((arbeidsforhold, index) => {
                        if (erAnsattHosArbeidsgiverISøknadsperiode(arbeidsforhold) === false) {
                            return null;
                        }
                        return (
                            <FormSection title={arbeidsforhold.navn} key={arbeidsforhold.organisasjonsnummer}>
                                <ArbeidIPeriodeSpørsmål
                                    arbeidsstedNavn={arbeidsforhold.navn}
                                    arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                    arbeidsforhold={arbeidsforhold}
                                    periode={periode}
                                    parentFieldName={`${SøknadFormField.ansatt_arbeidsforhold}.${index}`}
                                />
                            </FormSection>
                        );
                    })}
                </FormBlock>
            )}

            {erFrilanser && frilans_arbeidsforhold && arbeidsperiodeFrilans && (
                <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')}>
                    <ArbeidIPeriodeSpørsmål
                        arbeidsstedNavn="Frilanser"
                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                        arbeidsforhold={frilans_arbeidsforhold}
                        periode={arbeidsperiodeFrilans}
                        parentFieldName={`${SøknadFormField.frilans_arbeidsforhold}`}
                    />
                </FormSection>
            )}
            {skalBesvareSelvstendig && selvstendig_arbeidsforhold && arbeidsperiodeSelvstendig && (
                <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                    <ArbeidIPeriodeSpørsmål
                        arbeidsstedNavn="Selvstendig næringsdrivende"
                        arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                        arbeidsforhold={selvstendig_arbeidsforhold}
                        periode={arbeidsperiodeSelvstendig}
                        parentFieldName={`${SøknadFormField.selvstendig_arbeidsforhold}`}
                    />
                </FormSection>
            )}
        </>
    );
};

export default ArbeidIPeriodeStepContent;
