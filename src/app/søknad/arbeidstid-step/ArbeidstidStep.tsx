import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { useFormikContext } from 'formik';
import useLogSøknadInfo from '../../hooks/useLogSøknadInfo';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import GeneralErrorPage from '../../pages/general-error-page/GeneralErrorPage';
import { FrilansFormField } from '../../types/FrilansFormData';
import { SelvstendigFormField } from '../../types/SelvstendigFormData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { erAnsattHosArbeidsgiverISøknadsperiode } from '../../utils/ansattUtils';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import SøknadFormStep from '../SøknadFormStep';
import { useSøknadsdataContext } from '../SøknadsdataContext';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import ArbeidIPeriodeSpørsmål from './shared/arbeid-i-periode-spørsmål/ArbeidIPeriodeSpørsmål';
import { cleanupArbeidstidStep } from './utils/cleanupArbeidstidStep';

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
        søknadsdata: { arbeid: arbeidssituasjon },
    } = useSøknadsdataContext();

    if (!arbeidssituasjon) {
        return <GeneralErrorPage />;
    }

    const {
        values: { ansatt_arbeidsforhold, frilans, selvstendig },
    } = formikProps;

    const harAnsattArbeidsforholdMedFravær = ansatt_arbeidsforhold.some((a) => a.harFraværIPeriode === YesOrNo.YES);

    // const periodeSomFrilanserISøknadsperiode =
    //     frilans.arbeidsforhold && frilans.arbeidsforhold.harFraværIPeriode
    //         ? getPeriodeSomFrilanserInnenforPeriode(periode, frilans)
    //         : undefined;

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
                        const normalarbeidstid = arbeidssituasjon.arbeidsgivere?.get(arbeidsforhold.arbeidsgiver.id)
                            ?.arbeidsforhold?.normalarbeidstid;

                        /** Må loope gjennom alle arbeidsforhold for å få riktig index inn til formik */
                        if (
                            erAnsattHosArbeidsgiverISøknadsperiode(arbeidsforhold) === false ||
                            arbeidsforhold.harFraværIPeriode !== YesOrNo.YES ||
                            normalarbeidstid === undefined
                        ) {
                            return null;
                        }

                        return (
                            <FormSection title={arbeidsforhold.arbeidsgiver.navn} key={arbeidsforhold.arbeidsgiver.id}>
                                <ArbeidIPeriodeSpørsmål
                                    normalarbeidstid={normalarbeidstid}
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
                arbeidssituasjon.frilans?.erFrilanserISøknadsperiode === true &&
                arbeidssituasjon.frilans?.arbeidsforhold?.normalarbeidstid && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                normalarbeidstid={arbeidssituasjon.frilans.arbeidsforhold.normalarbeidstid}
                                arbeidsstedNavn="Frilansoppdrag"
                                arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                arbeidsforhold={frilans.arbeidsforhold}
                                periode={arbeidssituasjon.frilans.aktivPeriode}
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
                periodeSomSelvstendigISøknadsperiode &&
                arbeidssituasjon.selvstendig?.arbeidsforhold?.normalarbeidstid && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                normalarbeidstid={arbeidssituasjon.selvstendig.arbeidsforhold.normalarbeidstid}
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
