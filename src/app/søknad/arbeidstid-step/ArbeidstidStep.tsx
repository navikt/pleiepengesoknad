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
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { useFormikContext } from 'formik';
import useLogSøknadInfo from '../../hooks/useLogSøknadInfo';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import GeneralErrorPage from '../../pages/general-error-page/GeneralErrorPage';
import { FrilansFormField } from '../../types/FrilansFormData';
import { SelvstendigFormField } from '../../types/SelvstendigFormData';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import SøknadFormStep from '../SøknadFormStep';
import { useSøknadsdataContext } from '../SøknadsdataContext';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import ArbeidIPeriodeSpørsmål from './components/arbeid-i-periode-spørsmål/ArbeidIPeriodeSpørsmål';
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
        søknadsdata: { arbeid },
    } = useSøknadsdataContext();

    if (!arbeid) {
        return <GeneralErrorPage />;
    }

    const {
        values: { ansatt_arbeidsforhold, frilans, selvstendig },
    } = formikProps;

    const periodeSomSelvstendigISøknadsperiode =
        selvstendig.harHattInntektSomSN === YesOrNo.YES && selvstendig.virksomhet !== undefined
            ? getPeriodeSomSelvstendigInnenforPeriode(periode, selvstendig.virksomhet)
            : undefined;

    const handleArbeidstidChanged = () => {
        persist(StepID.ARBEIDSTID);
    };
    console.log('periodeSomSelvstendigISøknadsperiode: ', periodeSomSelvstendigISøknadsperiode);
    return (
        <SøknadFormStep
            id={StepID.ARBEIDSTID}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidstidStep(values, arbeid, periode)}>
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
                        const arbeidsgiver = arbeid.arbeidsgivere?.get(arbeidsforhold.arbeidsgiver.id);

                        /** Må loope gjennom alle arbeidsforhold for å få riktig index inn til formik */
                        if (!arbeidsgiver || arbeidsgiver.erAnsattISøknadsperiode === false) {
                            return null;
                        }

                        return (
                            <FormSection title={arbeidsforhold.arbeidsgiver.navn} key={arbeidsforhold.arbeidsgiver.id}>
                                <ArbeidIPeriodeSpørsmål
                                    normalarbeidstid={arbeidsgiver.arbeidsforhold.normalarbeidstid}
                                    arbeidsstedNavn={arbeidsforhold.arbeidsgiver.navn}
                                    arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                    arbeidsforhold={arbeidsforhold}
                                    periode={periode}
                                    parentFieldName={`${SøknadFormField.ansatt_arbeidsforhold}.${index}`}
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
                arbeid.frilans?.erFrilanser === true &&
                arbeid.frilans?.harInntektISøknadsperiode === true && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.FrilansLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                normalarbeidstid={arbeid.frilans.arbeidsforhold.normalarbeidstid}
                                arbeidsstedNavn="Frilansoppdrag"
                                arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                arbeidsforhold={frilans.arbeidsforhold}
                                periode={arbeid.frilans.aktivPeriode}
                                parentFieldName={FrilansFormField.arbeidsforhold}
                                onArbeidstidVariertChange={handleArbeidstidChanged}
                                onArbeidPeriodeRegistrert={logArbeidPeriodeRegistrert}
                                onArbeidstidEnkeltdagRegistrert={logArbeidEnkeltdagRegistrert}
                            />
                        </FormSection>
                    </FormBlock>
                )}

            {selvstendig.harHattInntektSomSN === YesOrNo.YES &&
                selvstendig.arbeidsforhold &&
                periodeSomSelvstendigISøknadsperiode &&
                arbeid.selvstendig?.type === 'erSN' && (
                    <FormBlock>
                        <FormSection title={intlHelper(intl, 'arbeidIPeriode.SNLabel')}>
                            <ArbeidIPeriodeSpørsmål
                                normalarbeidstid={arbeid.selvstendig.arbeidsforhold.normalarbeidstid}
                                arbeidsstedNavn="Selvstendig næringsdrivende"
                                arbeidsforholdType={ArbeidsforholdType.SELVSTENDIG}
                                arbeidsforhold={selvstendig.arbeidsforhold}
                                periode={periodeSomSelvstendigISøknadsperiode}
                                parentFieldName={SelvstendigFormField.arbeidsforhold}
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
