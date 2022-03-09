import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { useFormikContext } from 'formik';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../../utils/ansattUtils';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import ArbeidIPeriodeSpørsmål from './arbeid-i-periode-spørsmål/ArbeidIPeriodeSpørsmål';
import { cleanupArbeidstidStep } from './utils/cleanupArbeidstidStep';

interface Props extends StepConfigProps {
    periode: DateRange;
}

const ArbeidstidStep = ({ onValidSubmit, periode }: Props) => {
    const intl = useIntl();
    const formikProps = useFormikContext<SøknadFormData>();
    const {
        values: {
            ansatt_arbeidsforhold,
            frilans,
            selvstendig_harHattInntektSomSN,
            selvstendig_virksomhet,
            selvstendig_arbeidsforhold,
        },
    } = formikProps;

    const ansattArbeidsforholdMedFravær = ansatt_arbeidsforhold.filter((a) => a.harFraværIPeriode === YesOrNo.YES);

    const periodeSomFrilanserISøknadsperiode =
        frilans.arbeidsforhold && frilans.arbeidsforhold.harFraværIPeriode
            ? getPeriodeSomFrilanserInnenforPeriode(periode, frilans)
            : undefined;

    const periodeSomSelvstendigISøknadsperiode =
        selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_virksomhet !== undefined
            ? getPeriodeSomSelvstendigInnenforPeriode(periode, selvstendig_virksomhet)
            : undefined;

    return (
        <SøknadFormStep
            id={StepID.ARBEIDSTID}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidstidStep(values, periode)}>
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

            {ansattArbeidsforholdMedFravær.length > 0 && (
                <FormBlock>
                    {ansattArbeidsforholdMedFravær.map((arbeidsforhold, index) => {
                        if (erAnsattHosArbeidsgiverISøknadsperiode(arbeidsforhold) === false) {
                            return null;
                        }
                        return (
                            <FormSection title={arbeidsforhold.arbeidsgiver.navn} key={arbeidsforhold.arbeidsgiver.id}>
                                <ArbeidIPeriodeSpørsmål
                                    arbeidsstedNavn={arbeidsforhold.arbeidsgiver.navn}
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

            {frilans.arbeidsforhold &&
                frilans.arbeidsforhold.harFraværIPeriode === YesOrNo.YES &&
                periodeSomFrilanserISøknadsperiode && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                arbeidsstedNavn="Frilansoppdrag"
                                arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                arbeidsforhold={frilans.arbeidsforhold}
                                periode={periodeSomFrilanserISøknadsperiode}
                                parentFieldName={SøknadFormField.frilans_arbeidsforhold}
                            />
                        </FormSection>
                    </FormBlock>
                )}

            {selvstendig_harHattInntektSomSN === YesOrNo.YES &&
                selvstendig_arbeidsforhold &&
                selvstendig_arbeidsforhold.harFraværIPeriode === YesOrNo.YES &&
                periodeSomSelvstendigISøknadsperiode && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                arbeidsstedNavn="Selvstendig næringsdrivende"
                                arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                                arbeidsforhold={selvstendig_arbeidsforhold}
                                periode={periodeSomSelvstendigISøknadsperiode}
                                parentFieldName={`${SøknadFormField.selvstendig_arbeidsforhold}`}
                            />
                        </FormSection>
                    </FormBlock>
                )}
        </SøknadFormStep>
    );
};

export default ArbeidstidStep;
