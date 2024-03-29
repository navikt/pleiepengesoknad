import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import LoadingSpinner from '@navikt/sif-common-core/lib/components/loading-spinner/LoadingSpinner';
import { date1YearAgo, date1YearFromNow, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { getListValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import OpptjeningUtlandListAndDialog from '@navikt/sif-common-forms/lib/opptjening-utland/OpptjeningUtlandListAndDialog';
import UtenlandskNæringListAndDialog from '@navikt/sif-common-forms/lib/utenlandsk-næring/UtenlandskNæringListAndDialog';
import { useFormikContext } from 'formik';
import { getArbeidsgivereRemoteData } from '../../api/getArbeidsgivereRemoteData';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import useEffectOnce from '../../hooks/useEffectOnce';
import getLenker from '../../lenker';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import ArbeidssituasjonArbeidsgivere from './components/ArbeidssituasjonArbeidsgivere';
import ArbeidssituasjonFrilans from './components/ArbeidssituasjonFrilans';
import ArbeidssituasjonSN from './components/ArbeidssituasjonSN';
import ArbeidssituasjonStepVeileder from './components/ArbeidssituasjonStepVeileder';
import { oppdaterSøknadMedArbeidsgivere } from './utils/arbeidsgivereUtils';
import { cleanupArbeidssituasjonStep } from './utils/cleanupArbeidssituasjonStep';
import { visVernepliktSpørsmål } from './utils/visVernepliktSpørsmål';

interface LoadState {
    isLoading: boolean;
    isLoaded: boolean;
}

interface Props {
    søknadsdato: Date;
    søknadsperiode: DateRange;
}

const ArbeidssituasjonStep = ({ onValidSubmit, søknadsdato, søknadsperiode }: StepConfigProps & Props) => {
    const formikProps = useFormikContext<SøknadFormValues>();
    const intl = useIntl();
    const {
        values,
        values: { ansatt_arbeidsforhold, harOpptjeningUtland, harUtenlandskNæring, stønadGodtgjørelse },
    } = formikProps;
    const [loadState, setLoadState] = useState<LoadState>({ isLoading: false, isLoaded: false });
    const søkerdata = useContext(SøkerdataContext);
    const { isLoading, isLoaded } = loadState;

    useEffectOnce(() => {
        const fetchData = async () => {
            if (søkerdata && søknadsperiode) {
                const arbeidsgivere = await getArbeidsgivereRemoteData(søknadsperiode.from, søknadsperiode.to);
                oppdaterSøknadMedArbeidsgivere(arbeidsgivere, formikProps);
                setLoadState({ isLoading: false, isLoaded: true });
            }
        };
        if (søknadsperiode && !isLoaded && !isLoading) {
            setLoadState({ isLoading: true, isLoaded: false });
            fetchData();
        }
    });

    return (
        <SøknadFormStep
            id={StepID.ARBEIDSSITUASJON}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={isLoading}
            onStepCleanup={
                søknadsperiode ? (values) => cleanupArbeidssituasjonStep(values, søknadsperiode) : undefined
            }>
            {isLoading && <LoadingSpinner type="XS" blockTitle="Henter arbeidsforhold" />}
            {!isLoading && søknadsperiode && (
                <>
                    <Box padBottom="xl">
                        <ArbeidssituasjonStepVeileder />
                    </Box>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.tittel')}>
                        <ArbeidssituasjonArbeidsgivere
                            parentFieldName={SøknadFormField.ansatt_arbeidsforhold}
                            ansatt_arbeidsforhold={ansatt_arbeidsforhold}
                            søknadsperiode={søknadsperiode}
                            intl={intl}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.frilanser.tittel')}>
                        <ArbeidssituasjonFrilans
                            parentFieldName={SøknadFormField.frilans}
                            frilansoppdrag={values.frilansoppdrag || []}
                            formValues={values.frilans}
                            søknadsperiode={søknadsperiode}
                            søknadsdato={søknadsdato}
                            stønadGodtgjørelse={stønadGodtgjørelse}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.sn.tittel')}>
                        <ArbeidssituasjonSN
                            formValues={values.selvstendig}
                            urlSkatteetatenSN={getLenker(intl.locale).skatteetatenSN}
                            søknadsperiode={søknadsperiode}
                        />
                    </FormSection>

                    <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.opptjeningUtland.tittel')}>
                        <div data-testid="arbeidssituasjonOpptjeningUtland">
                            <SøknadFormComponents.YesOrNoQuestion
                                legend={intlHelper(intl, 'steg.arbeidssituasjon.opptjeningUtland.spm')}
                                name={SøknadFormField.harOpptjeningUtland}
                                validate={getYesOrNoValidator()}
                                data-testid="har-opptjeningUtland"
                            />
                            {harOpptjeningUtland === YesOrNo.YES && (
                                <FormBlock>
                                    <OpptjeningUtlandListAndDialog
                                        minDate={date1YearAgo}
                                        maxDate={date1YearFromNow}
                                        name={SøknadFormField.opptjeningUtland}
                                        validate={getListValidator({ required: true })}
                                        labels={{
                                            addLabel: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.opptjeningUtland.listAndDialog.addLabel'
                                            ),
                                            listTitle: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.opptjeningUtland.listAndDialog.listTitle'
                                            ),
                                            modalTitle: intlHelper(
                                                intl,
                                                'steg.arbeidssituasjon.opptjeningUtland.listAndDialog.modalTitle'
                                            ),
                                        }}
                                    />
                                </FormBlock>
                            )}
                        </div>
                        <FormBlock>
                            <div data-testid="arbeidssituasjonUtenlandskNæring">
                                <SøknadFormComponents.YesOrNoQuestion
                                    legend={intlHelper(intl, 'steg.arbeidssituasjon.utenlandskNæring.spm')}
                                    name={SøknadFormField.harUtenlandskNæring}
                                    validate={getYesOrNoValidator()}
                                    data-testid="har-utenlandskNæring"
                                />
                                {harUtenlandskNæring === YesOrNo.YES && (
                                    <FormBlock>
                                        <UtenlandskNæringListAndDialog
                                            name={SøknadFormField.utenlandskNæring}
                                            validate={getListValidator({ required: true })}
                                            labels={{
                                                addLabel: 'Legg til næringsvirksomhet i et annet EØS-land',
                                                deleteLabel: 'Fjern',
                                                editLabel: 'Endre',
                                                infoTitle: 'Virksomhet',
                                                modalTitle: 'Virksomhet',
                                            }}
                                        />
                                    </FormBlock>
                                )}
                            </div>
                        </FormBlock>
                    </FormSection>

                    {visVernepliktSpørsmål(values) && (
                        <FormSection title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.tittel')}>
                            <Box margin="l">
                                <SøknadFormComponents.YesOrNoQuestion
                                    name={SøknadFormField.harVærtEllerErVernepliktig}
                                    legend={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.spm')}
                                    validate={getYesOrNoValidator()}
                                    description={
                                        <ExpandableInfo
                                            title={intlHelper(intl, 'steg.arbeidssituasjon.verneplikt.info.tittel')}>
                                            <FormattedMessage id="steg.arbeidssituasjon.verneplikt.info.tekst" />
                                        </ExpandableInfo>
                                    }
                                    data-testid="verneplikt"
                                />
                            </Box>
                        </FormSection>
                    )}
                </>
            )}
        </SøknadFormStep>
    );
};

export default ArbeidssituasjonStep;
