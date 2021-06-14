import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { visKunEnkeltdagerForOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import OmsorgstilbudFormPart from './OmsorgstilbudFormPart';
import { cleanupTilsynsordningStep } from './tilsynsordningStepUtils';
import AlertStripe from 'nav-frontend-alertstriper';

dayjs.extend(isBetween);

const TilsynsordningStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const history = useHistory();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { omsorgstilbud } = values;
    const { skalBarnIOmsorgstilbud } = omsorgstilbud || {};
    const { persist } = usePersistSoknad(history);

    const [omsorgstilbudChanged, setOmsorgstilbudChanged] = useState(false);

    useEffect(() => {
        if (omsorgstilbudChanged === true) {
            setOmsorgstilbudChanged(false);
            persist(StepID.OMSORGSTILBUD);
        }
    }, [omsorgstilbudChanged, persist]);

    const periodeFra = datepickerUtils.getDateFromDateString(values.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(values.periodeTil);

    if (!periodeFra || !periodeTil) {
        return <div>Perioden mangler, gå tilbake og endre datoer</div>;
    }

    const søknadsperiode: DateRange = { from: periodeFra, to: periodeTil };
    const visKunEnkeltdager = visKunEnkeltdagerForOmsorgstilbud(søknadsperiode);

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupTilsynsordningStep(values, søknadsperiode)}
            onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedMessage id="steg.tilsyn.veileder.html" values={{ p: (msg: string) => <p>{msg}</p> }} />
            </CounsellorPanel>
            <FormBlock>
                <AppForm.YesOrNoQuestion
                    name={AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    validate={getYesOrNoValidator()}
                />
            </FormBlock>
            <FormBlock>
                <AppForm.YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.tilsyn.ja.årsak.spm')}
                    name={AppFormField.omsorgstilbud__ja__vetTidIOmsorgstilbud}
                    labels={{
                        yes: intlHelper(intl, 'steg.tilsyn.ja.årsak.vetHelePerioden'),
                        no: intlHelper(intl, 'steg.tilsyn.ja.årsak.usikkerPerioden'),
                    }}
                    description={
                        <ExpandableInfo title={'Jeg er usikker på hvor mye'}>
                            Informasjon dersom en er usikker
                        </ExpandableInfo>
                    }
                    validate={getYesOrNoValidator()}
                />
            </FormBlock>

            {YesOrNo.YES === skalBarnIOmsorgstilbud && omsorgstilbud && (
                <>
                    {omsorgstilbud.ja?.vetTidIOmsorgstilbud === YesOrNo.NO && (
                        <FormBlock>
                            <AlertStripe type={'info'}>
                                <FormattedMessage id="steg.tilsyn.ja.hvorMyeTilsyn.alertInfo.nei" />
                            </AlertStripe>
                        </FormBlock>
                    )}
                    {omsorgstilbud.ja?.vetTidIOmsorgstilbud === YesOrNo.YES && (
                        <>
                            {visKunEnkeltdager === false && (
                                <FormBlock>
                                    <AppForm.YesOrNoQuestion
                                        legend="Skal barnet være i et omsorgstilbud i like mange timer per dag hver uke gjennom hele søknadsperioden?"
                                        name={AppFormField.omsorgstilbud__ja_erLiktHverDag}
                                        description={
                                            <ExpandableInfo title={'Hva betyr dette?'}>
                                                Informasjon om forskjellen
                                            </ExpandableInfo>
                                        }
                                    />
                                </FormBlock>
                            )}
                            {visKunEnkeltdager === false && omsorgstilbud.ja?.erLiktHverDag === YesOrNo.YES && (
                                <FormBlock>
                                    <AppForm.InputGroup
                                        legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn')}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'steg.tilsyn.ja.hvorMyeTilsyn.description.tittel'
                                                )}>
                                                {intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.description')}
                                            </ExpandableInfo>
                                        }
                                        validate={() => validateSkalHaTilsynsordning(omsorgstilbud)}
                                        name={'tilsynsordning_gruppe' as any}>
                                        <Tilsynsuke name={AppFormField.omsorgstilbud__ja__fasteDager} />
                                    </AppForm.InputGroup>
                                </FormBlock>
                            )}
                            {omsorgstilbud.ja?.erLiktHverDag === YesOrNo.NO && (
                                <FormBlock>
                                    <OmsorgstilbudFormPart
                                        info={omsorgstilbud.ja}
                                        spørOmMånedForOmsorgstilbud={visKunEnkeltdager === false}
                                        søknadsperiode={{ from: periodeFra, to: periodeTil }}
                                        tidIOmsorgstilbud={omsorgstilbud.ja.enkeltdager || {}}
                                        onOmsorgstilbudChanged={() => {
                                            setOmsorgstilbudChanged(true);
                                        }}
                                    />
                                </FormBlock>
                            )}
                        </>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default TilsynsordningStep;
