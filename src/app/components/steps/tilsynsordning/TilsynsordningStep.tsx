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
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import { VetOmsorgstilbud } from '../../../types/PleiepengesøknadApiData';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { visKunEnkeltdagerForOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import OmsorgstilbudFormPart from './OmsorgstilbudFormPart';
import { cleanupTilsynsordningStep } from './tilsynsordningStepUtils';

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
            {skalBarnIOmsorgstilbud === YesOrNo.YES && omsorgstilbud && (
                <>
                    <FormBlock>
                        <AppForm.RadioPanelGroup
                            legend="Kan du oppgi noe av tiden barnet skal være i omsorgstilbudet?"
                            name={AppFormField.omsorgstilbud__ja__vetHvorMyeTid}
                            radios={[
                                {
                                    label: intlHelper(intl, 'steg.tilsyn.ja.vetHvorMye.ja'),
                                    value: VetOmsorgstilbud.VET_ALLE_TIMER,
                                },
                                {
                                    label: intlHelper(intl, 'steg.tilsyn.ja.vetHvorMye.nei'),
                                    value: VetOmsorgstilbud.VET_IKKE,
                                },
                            ]}
                            validate={getRequiredFieldValidator()}
                            useTwoColumns={true}
                            description={
                                <div style={{ marginTop: '-.5rem' }}>
                                    Du skal bare oppgi den tiden du vet med sikkerhet. Dersom du vet noe av tiden barnet
                                    kan være i omsorgstilbudet svarer du ja. Dersom du ikke vet eller omsorgstilbudet
                                    ikke er etablert, svarer du nei.
                                </div>
                            }
                        />
                    </FormBlock>

                    {omsorgstilbud.ja?.vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE && (
                        <FormBlock>
                            <AlertStripe type={'info'}>
                                <FormattedMessage id="steg.tilsyn.ja.hvorMyeTilsyn.alertInfo.nei" />
                            </AlertStripe>
                        </FormBlock>
                    )}

                    {omsorgstilbud.ja?.vetHvorMyeTid === VetOmsorgstilbud.VET_ALLE_TIMER && (
                        <>
                            {visKunEnkeltdager === false && (
                                <FormBlock>
                                    <AppForm.YesOrNoQuestion
                                        legend="Er tiden barnet skal være i omsorgstilbudet lik for hver dag i perioden du søker om? Det vil si at alle mandager er like, alle tirsdager er like og så videre."
                                        name={AppFormField.omsorgstilbud__ja_erLiktHverDag}
                                        description={
                                            <ExpandableInfo title="Hva betyr dette?">
                                                Eksempel:
                                                <br />
                                                Anna går fast hver uke i barnehagen 2 timer på mandag og 3 timer på
                                                torsdag. Hun bytter ikke på dager eller antall timer hun er i barnehagen
                                                i løpet av en uke.
                                            </ExpandableInfo>
                                        }
                                        validate={getYesOrNoValidator()}
                                    />
                                </FormBlock>
                            )}
                            {visKunEnkeltdager === false && omsorgstilbud.ja?.erLiktHverDag === YesOrNo.YES && (
                                <>
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
                                </>
                            )}
                            {(visKunEnkeltdager === true || omsorgstilbud.ja?.erLiktHverDag === YesOrNo.NO) && (
                                <>
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
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default TilsynsordningStep;
