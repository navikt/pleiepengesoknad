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
import { ArbeidsforholdType } from '../../types';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../../utils/ansattUtils';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import ArbeidIPeriodeSpørsmål from './ArbeidIPeriodeSpørsmål';

interface Props {
    periode: DateRange;
    søknadsdato: Date;
    erHistorisk: boolean;
}

const ArbeidIPeriodeStepContent = ({ periode, erHistorisk, søknadsdato }: Props) => {
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

    /**
     * Kontroller om bruker må sendes tilbake til arbeidssituasjon-steget
     * Dette kan oppstå dersom bruker er på Arbeidssituasjon,
     * endrer på data, og deretter trykker forward i nettleser
     * */

    // const brukerMåGåTilbakeTilArbeidssituasjon =
    //     skalBesvareAnsettelsesforhold === false && skalBesvareFrilans === false && skalBesvareSelvstendig === false;

    // if (brukerMåGåTilbakeTilArbeidssituasjon === true) {
    //     return <InvalidStepPage stepId={StepID.ARBEIDSFORHOLD_I_PERIODEN} />;
    // }

    return (
        <>
            <Box padBottom="m">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage
                            id={erHistorisk ? 'arbeidIPeriode.StepInfo.historisk' : 'arbeidIPeriode.StepInfo.planlagt'}
                            values={{
                                fra: prettifyDateFull(periode.from),
                                til: prettifyDateFull(periode.to),
                            }}
                        />
                    </p>
                    <p>
                        <FormattedMessage id={'arbeidIPeriode.StepInfo.info'} />
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
                                    erHistorisk={erHistorisk}
                                    søknadsdato={søknadsdato}
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
                        erHistorisk={erHistorisk}
                        søknadsdato={søknadsdato}
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
                        erHistorisk={erHistorisk}
                        søknadsdato={søknadsdato}
                    />
                </FormSection>
            )}
        </>
    );
};

export default ArbeidIPeriodeStepContent;
