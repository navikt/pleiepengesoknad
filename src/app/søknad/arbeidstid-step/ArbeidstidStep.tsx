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
import { FrilansFormField } from '../../types/FrilansFormData';
import { SelvstendigFormField } from '../../types/SelvstendigFormData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../../utils/ansattUtils';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../utils/frilanserUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import ArbeidIPeriodeSpørsmål from './shared/arbeid-i-periode-spørsmål/ArbeidIPeriodeSpørsmål';
import { cleanupArbeidstidStep } from './utils/cleanupArbeidstidStep';
import { useHistory } from 'react-router';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import useLogSøknadInfo from '../../hooks/useLogSøknadInfo';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import { useSøknadsdataContext } from '../SøknadsdataContext';
import GeneralErrorPage from '../../pages/general-error-page/GeneralErrorPage';

interface Props extends StepConfigProps {
    periode: DateRange;
}

const ArbeidstidStep = ({ onValidSubmit, periode }: Props) => {
    const intl = useIntl();
    const history = useHistory();
    const { logArbeidPeriodeRegistrert } = useLogSøknadInfo();
    const { logArbeidEnkeltdagRegistrert } = useLogSøknadInfo();
    const formikProps = useFormikContext<SøknadFormData>();
    const { persist } = usePersistSoknad(history);
    const {
        søknadsdata: { arbeidssituasjon },
    } = useSøknadsdataContext();

    if (!arbeidssituasjon) {
        return <GeneralErrorPage />;
    }

    const {
        values: { ansatt_arbeidsforhold, frilans, selvstendig },
    } = formikProps;

    const harAnsattArbeidsforholdMedFravær = ansatt_arbeidsforhold.some((a) => a.harFraværIPeriode === YesOrNo.YES);

    const periodeSomFrilanserISøknadsperiode =
        frilans.arbeidsforhold && frilans.arbeidsforhold.harFraværIPeriode
            ? getPeriodeSomFrilanserInnenforPeriode(periode, frilans)
            : undefined;

    const periodeSomSelvstendigISøknadsperiode =
        selvstendig.harHattInntektSomSN === YesOrNo.YES && selvstendig.virksomhet !== undefined
            ? getPeriodeSomSelvstendigInnenforPeriode(periode, selvstendig.virksomhet)
            : undefined;

    const handleArbeidstidChanged = () => {
        persist(StepID.ARBEIDSTID);
    };

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

            {harAnsattArbeidsforholdMedFravær && (
                <FormBlock>
                    {ansatt_arbeidsforhold.map((arbeidsforhold, index) => {
                        /** Må loope gjennom alle arbeidsforhold for å få riktig index inn til formik */
                        if (
                            erAnsattHosArbeidsgiverISøknadsperiode(arbeidsforhold) === false ||
                            arbeidsforhold.harFraværIPeriode !== YesOrNo.YES
                        ) {
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
                                    søkerKunHelgedager={søkerKunHelgedager(periode.from, periode.to)}
                                    onArbeidstidVariertChange={handleArbeidstidChanged}
                                    onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                                    onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
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
                                parentFieldName={FrilansFormField.arbeidsforhold}
                                søkerKunHelgedager={søkerKunHelgedager(periode.from, periode.to)}
                                onArbeidstidVariertChange={handleArbeidstidChanged}
                                onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                                onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
                            />
                        </FormSection>
                    </FormBlock>
                )}

            {selvstendig.harHattInntektSomSN === YesOrNo.YES &&
                selvstendig.arbeidsforhold &&
                selvstendig.arbeidsforhold.harFraværIPeriode === YesOrNo.YES &&
                periodeSomSelvstendigISøknadsperiode && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                arbeidsstedNavn="Selvstendig næringsdrivende"
                                arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                                arbeidsforhold={selvstendig.arbeidsforhold}
                                periode={periodeSomSelvstendigISøknadsperiode}
                                parentFieldName={SelvstendigFormField.arbeidsforhold}
                                søkerKunHelgedager={søkerKunHelgedager(periode.from, periode.to)}
                                onArbeidstidVariertChange={handleArbeidstidChanged}
                                onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                                onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
                            />
                        </FormSection>
                    </FormBlock>
                )}
        </SøknadFormStep>
    );
};

export default ArbeidstidStep;
