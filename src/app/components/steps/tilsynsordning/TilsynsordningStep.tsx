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
import {
    getPeriodeFraOgMedSøknadsdato,
    getPeriodeFørSøknadsdato,
    visKunEnkeltdagerForOmsorgstilbud,
} from '../../../utils/omsorgstilbudUtils';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import OmsorgstilbudFormPart from './OmsorgstilbudFormPart';
import { cleanupTilsynsordningStep } from './tilsynsordningStepUtils';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';

dayjs.extend(isBetween);

const TilsynsordningStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const history = useHistory();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { omsorgstilbud, omsorgstilbud_harVært, omsorgstilbud_dagerVært } = values;
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
    // const visKunEnkeltdager = visKunEnkeltdagerForOmsorgstilbud(søknadsperiode);

    const periodeFørSøknadsdato = getPeriodeFørSøknadsdato(søknadsperiode);
    const periodeFraOgMedSøknadsdato = getPeriodeFraOgMedSøknadsdato(søknadsperiode);

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupTilsynsordningStep(values, søknadsperiode)}
            onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedMessage id="steg.tilsyn.veileder.html" values={{ p: (msg: string) => <p>{msg}</p> }} />
            </CounsellorPanel>
            {periodeFørSøknadsdato && (
                <>
                    <FormBlock>
                        <AppForm.YesOrNoQuestion
                            name={AppFormField.omsorgstilbud_harVært}
                            legend={intlHelper(intl, 'steg.tilsyn.harBarnetHattTilsyn.spm', {
                                fra: prettifyDateFull(periodeFørSøknadsdato.from),
                                til: prettifyDateFull(periodeFørSøknadsdato.to),
                            })}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>
                    {omsorgstilbud_harVært === YesOrNo.YES && (
                        <FormBlock>
                            <OmsorgstilbudFormPart
                                visKunEnkeltdager={visKunEnkeltdagerForOmsorgstilbud(periodeFørSøknadsdato)}
                                periode={periodeFørSøknadsdato}
                                tidIOmsorgstilbud={omsorgstilbud_dagerVært || {}}
                                onOmsorgstilbudChanged={() => {
                                    setOmsorgstilbudChanged(true);
                                }}
                            />
                        </FormBlock>
                    )}
                </>
            )}
            {periodeFraOgMedSøknadsdato && (
                <>
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
                                    legend={intlHelper(intl, 'steg.tilsyn.ja.vetHvorMye.spm')}
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
                                            <FormattedMessage id="steg.tilsyn.ja.vetHvorMye.info" />
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
                                    {visKunEnkeltdagerForOmsorgstilbud(periodeFraOgMedSøknadsdato) === false && (
                                        <FormBlock>
                                            <AppForm.YesOrNoQuestion
                                                legend={intlHelper(intl, 'steg.tilsyn.ja.erLiktHverDag.spm')}
                                                name={AppFormField.omsorgstilbud__ja__erLiktHverDag}
                                                description={
                                                    <ExpandableInfo
                                                        title={intlHelper(
                                                            intl,
                                                            'steg.tilsyn.ja.erLiktHverDag.info.tittel'
                                                        )}>
                                                        <FormattedMessage id="steg.tilsyn.ja.erLiktHverDag.info.1" />
                                                        <br />
                                                        <FormattedMessage id="steg.tilsyn.ja.erLiktHverDag.info.2" />
                                                    </ExpandableInfo>
                                                }
                                                validate={getYesOrNoValidator()}
                                            />
                                        </FormBlock>
                                    )}
                                    {visKunEnkeltdagerForOmsorgstilbud(periodeFraOgMedSøknadsdato) === false &&
                                        omsorgstilbud.ja?.erLiktHverDag === YesOrNo.YES && (
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
                                                                {intlHelper(
                                                                    intl,
                                                                    'steg.tilsyn.ja.hvorMyeTilsyn.description'
                                                                )}
                                                            </ExpandableInfo>
                                                        }
                                                        validate={() => validateSkalHaTilsynsordning(omsorgstilbud)}
                                                        name={'tilsynsordning_gruppe' as any}>
                                                        <Tilsynsuke name={AppFormField.omsorgstilbud__ja__fasteDager} />
                                                    </AppForm.InputGroup>
                                                </FormBlock>
                                            </>
                                        )}
                                    {(visKunEnkeltdagerForOmsorgstilbud(periodeFraOgMedSøknadsdato) === true ||
                                        omsorgstilbud.ja?.erLiktHverDag === YesOrNo.NO) && (
                                        <>
                                            <FormBlock>
                                                <OmsorgstilbudFormPart
                                                    visKunEnkeltdager={visKunEnkeltdagerForOmsorgstilbud(
                                                        periodeFraOgMedSøknadsdato
                                                    )}
                                                    periode={periodeFraOgMedSøknadsdato}
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
                </>
            )}
        </FormikStep>
    );
};

export default TilsynsordningStep;
