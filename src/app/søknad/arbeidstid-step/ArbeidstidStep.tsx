import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
import { SøknadFormValues, SøknadFormField } from '../../types/SøknadFormValues';
import { getPeriodeSomSelvstendigInnenforPeriode } from '../../utils/selvstendigUtils';
import SøknadFormStep, { SøknadFormStepBeforeValidSubmitProps } from '../SøknadFormStep';
import { useSøknadsdataContext } from '../SøknadsdataContext';
import { StepID } from '../søknadStepsConfig';
import ArbeidIPeriodeSpørsmål from './components/arbeid-i-periode-spørsmål/ArbeidIPeriodeSpørsmål';
import { cleanupArbeidstidStep } from './utils/cleanupArbeidstidStep';
import { UserHashInfo } from '../../api/endpoints/mellomlagringEndpoint';
import { getArbeidsforhold, harFraværIPerioden } from './utils/arbeidstidUtils';
import { ConfirmationDialog } from '../../types/ConfirmationDialog';
import { getIngenFraværConfirmationDialog } from '../confirmation-dialogs/ingenFraværConfirmation';
import BekreftDialog from '@navikt/sif-common-core/lib/components/dialogs/bekreft-dialog/BekreftDialog';
interface Props {
    periode: DateRange;
    søknadId: string;
    søkerInfo: UserHashInfo;
}

const ArbeidstidStep = ({ periode, søknadId, søkerInfo }: Props & SøknadFormStepBeforeValidSubmitProps) => {
    const intl = useIntl();
    const { logArbeidEnkeltdagRegistrert, logBekreftIngenFraværFraJobb, logArbeidPeriodeRegistrert } =
        useLogSøknadInfo();
    const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialog | undefined>(undefined);
    const formikProps = useFormikContext<SøknadFormValues>();
    const { persistSoknad } = usePersistSoknad();
    const { søknadsdata } = useSøknadsdataContext();

    const { arbeid } = søknadsdata;

    if (!arbeid) {
        console.error('!arbeid', søknadsdata);
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
        persistSoknad({ stepID: StepID.ARBEIDSTID, søknadId, søkerInfo });
    };

    return (
        <SøknadFormStep
            id={StepID.ARBEIDSTID}
            onStepCleanup={(values) => cleanupArbeidstidStep(values, arbeid, periode)}
            onBeforeValidSubmit={() => {
                return new Promise((resolve) => {
                    resolve(true);
                    if (søknadsdata.arbeid && harFraværIPerioden(getArbeidsforhold(søknadsdata.arbeid)) === false) {
                        setConfirmationDialog(
                            getIngenFraværConfirmationDialog({
                                onCancel: () => {
                                    logBekreftIngenFraværFraJobb(false);
                                    setConfirmationDialog(undefined);
                                },
                                onConfirm: () => {
                                    logBekreftIngenFraværFraJobb(true);
                                    setConfirmationDialog(undefined);
                                    resolve(true);
                                },
                            })
                        );
                    } else {
                        resolve(true);
                    }
                });
            }}>
            {confirmationDialog && (
                <BekreftDialog
                    isOpen={true}
                    bekreftLabel={confirmationDialog.okLabel}
                    avbrytLabel={confirmationDialog.cancelLabel}
                    onBekreft={confirmationDialog.onConfirm}
                    onAvbryt={confirmationDialog.onCancel}
                    onRequestClose={confirmationDialog.onCancel}
                    contentLabel={confirmationDialog.title}>
                    {confirmationDialog.content}
                </BekreftDialog>
            )}

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
