import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { useFormikContext } from 'formik';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import GeneralErrorPage from '../../../pages/general-error-page/GeneralErrorPage';
import { FrilansFormField } from '../../../types/FrilansFormData';
import { SelvstendigFormField } from '../../../types/SelvstendigFormData';
import { SøknadFormField, SøknadFormValues } from '../../../types/SøknadFormValues';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../../utils/selvstendigUtils';
import SøknadFormStep from '../../SøknadFormStep';
import { useSøknadsdataContext } from '../../SøknadsdataContext';
import { StepConfigProps, StepID } from '../../søknadStepsConfig';
import { cleanupArbeidstidStep } from '../utils/cleanupArbeidstidStep';
import ArbeidIPeriodeSpørsmål from './ArbeidIPeriodeSpørsmål';

interface Props extends StepConfigProps {
    periode: DateRange;
}

const ArbeidstidStep = ({ onValidSubmit, periode }: Props) => {
    const intl = useIntl();
    const formikProps = useFormikContext<SøknadFormValues>();
    const { persistSoknad } = usePersistSoknad();
    const {
        søknadsdata: { arbeid, søknadsperiode },
    } = useSøknadsdataContext();

    if (!arbeid || !søknadsperiode) {
        return <GeneralErrorPage />;
    }

    const {
        values: { ansatt_arbeidsforhold, frilans, selvstendig, frilansoppdrag, nyfrilansoppdrag },
    } = formikProps;

    const periodeSomSelvstendigISøknadsperiode =
        selvstendig.harHattInntektSomSN === YesOrNo.YES && selvstendig.virksomhet !== undefined
            ? getPeriodeSomSelvstendigInnenforPeriode(periode, selvstendig.virksomhet)
            : undefined;

    const handleArbeidstidChanged = () => {
        persistSoknad({ stepID: StepID.ARBEIDSTID });
    };

    return (
        <SøknadFormStep
            id={StepID.ARBEIDSTID}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidstidStep(values, arbeid, periode)}>
            <Box padBottom="m">
                <CounsellorPanel>
                    <p>
                        <FormattedMessage id={'arbeidIPeriode.StepInfo.1'} />
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
                                <div data-testid="arbeidIPerioden_ansatt">
                                    <ArbeidIPeriodeSpørsmål
                                        normalarbeidstid={arbeidsgiver.arbeidsforhold.normalarbeidstid}
                                        arbeidsstedNavn={arbeidsforhold.arbeidsgiver.navn}
                                        arbeidsforholdType={ArbeidsforholdType.ANSATT}
                                        arbeidsforhold={arbeidsforhold}
                                        arbeidsperiode={periode}
                                        parentFieldName={`${SøknadFormField.ansatt_arbeidsforhold}.${index}`}
                                        onArbeidstidVariertChange={handleArbeidstidChanged}
                                    />
                                </div>
                            </FormSection>
                        );
                    })}
                </FormBlock>
            )}
            {frilansoppdrag.length > 0 && (
                <FormBlock>
                    {frilansoppdrag.map((oppdrag, index) => {
                        const frilansoppdrag = arbeid.frilansOppdrag?.get(oppdrag.arbeidsgiver.id);

                        /** Må loope gjennom alle arbeidsforhold for å få riktig index inn til formik */
                        if (
                            !frilansoppdrag ||
                            frilansoppdrag.type === 'utenArbeidsforhold' ||
                            frilansoppdrag.type === 'sluttetFørSøknadsperiode'
                        ) {
                            return null;
                        }

                        return (
                            <FormSection title={frilansoppdrag.arbeidsgiver.navn} key={frilansoppdrag.arbeidsgiver.id}>
                                <div data-testid="arbeidIPerioden_frilansOppdrag">
                                    <ArbeidIPeriodeSpørsmål
                                        normalarbeidstid={frilansoppdrag.arbeidsforhold.normalarbeidstid}
                                        arbeidsstedNavn={oppdrag.arbeidsgiver.navn}
                                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                        arbeidsforhold={oppdrag}
                                        arbeidsperiode={periode}
                                        parentFieldName={`${SøknadFormField.frilansoppdrag}.${index}`}
                                        onArbeidstidVariertChange={handleArbeidstidChanged}
                                    />
                                </div>
                            </FormSection>
                        );
                    })}
                </FormBlock>
            )}
            {nyfrilansoppdrag.length > 0 && (
                <FormBlock>
                    {nyfrilansoppdrag.map((oppdrag, index) => {
                        const frilansoppdrag = arbeid.nyFrilans?.get(oppdrag.arbeidsgiver.id);

                        /** Må loope gjennom alle arbeidsforhold for å få riktig index inn til formik */
                        if (!frilansoppdrag || frilansoppdrag.type === 'utenArbeidsforhold') {
                            return null;
                        }

                        return (
                            <FormSection title={frilansoppdrag.arbeidsgiver.navn} key={frilansoppdrag.arbeidsgiver.id}>
                                <div data-testid="arbeidIPerioden_frilansOppdrag">
                                    <ArbeidIPeriodeSpørsmål
                                        normalarbeidstid={frilansoppdrag.arbeidsforhold.normalarbeidstid}
                                        arbeidsstedNavn={oppdrag.arbeidsgiver.navn}
                                        arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                        arbeidsforhold={oppdrag}
                                        arbeidsperiode={periode}
                                        parentFieldName={`${SøknadFormField.nyfrilansoppdrag}.${index}`}
                                        onArbeidstidVariertChange={handleArbeidstidChanged}
                                    />
                                </div>
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
                            <div data-testid="arbeidIPerioden_frilanser">
                                <ArbeidIPeriodeSpørsmål
                                    normalarbeidstid={arbeid.frilans.arbeidsforhold.normalarbeidstid}
                                    arbeidsstedNavn="Frilansoppdrag"
                                    arbeidsforholdType={ArbeidsforholdType.FRILANSER}
                                    arbeidsforhold={frilans.arbeidsforhold}
                                    arbeidsperiode={arbeid.frilans.aktivPeriode}
                                    parentFieldName={FrilansFormField.arbeidsforhold}
                                    onArbeidstidVariertChange={handleArbeidstidChanged}
                                />
                            </div>
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
                                arbeidsperiode={periodeSomSelvstendigISøknadsperiode}
                                parentFieldName={SelvstendigFormField.arbeidsforhold}
                                onArbeidstidVariertChange={handleArbeidstidChanged}
                            />
                        </FormSection>
                    </FormBlock>
                )}
        </SøknadFormStep>
    );
};

export default ArbeidstidStep;
