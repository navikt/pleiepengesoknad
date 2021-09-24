import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import FormSection from '../../../pre-common/form-section/FormSection';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { visKunEnkeltdagerForOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';
import { getOmsorgstilbudtimerValidatorEnDag, validateSkalIOmsorgstilbud } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import TidFasteDagerInput from '../../tid-faste-dager-input/TidFasteDagerInput';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';
import OmsorgstilbudIPeriodeSpørsmål from '../../omsorgstilbud/OmsorgstilbudKalenderInput';
import { VetOmsorgstilbud } from '../../../types';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../../utils/tidsbrukUtils';

dayjs.extend(isBetween);

const OmsorgstilbudStep = ({ onValidSubmit }: StepConfigProps) => {
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

    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, dateToday);
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, dateToday);

    const harBådeHistoriskOgPlanlagt = periodeFørSøknadsdato !== undefined && periodeFraOgMedSøknadsdato;

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupOmsorgstilbudStep(values, søknadsperiode, dateToday)}
            onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                <FormattedMessage id="steg.omsorgstilbud.veileder.html" values={{ p: (msg: string) => <p>{msg}</p> }} />
            </CounsellorPanel>
            {periodeFørSøknadsdato && (
                <FormSection
                    title={intlHelper(
                        intl,
                        harBådeHistoriskOgPlanlagt
                            ? 'steg.omsorgstilbud.historisk.tittel'
                            : 'steg.omsorgstilbud.generelt.tittel'
                    )}>
                    <AppForm.YesOrNoQuestion
                        name={AppFormField.omsorgstilbud__harBarnVærtIOmsorgstilbud}
                        legend={intlHelper(intl, 'steg.omsorgstilbud.harBarnetVærtIOmsorgstilbud.spm', {
                            fra: prettifyDateFull(periodeFørSøknadsdato.from),
                            til: prettifyDateFull(periodeFørSøknadsdato.to),
                        })}
                        validate={(value) => {
                            const error = getYesOrNoValidator()(value);
                            if (error) {
                                return {
                                    key: error,
                                    values: {
                                        fra: prettifyDateFull(periodeFørSøknadsdato.from),
                                        til: prettifyDateFull(periodeFørSøknadsdato.to),
                                    },
                                };
                            }
                            return undefined;
                        }}
                    />
                    {omsorgstilbud?.harBarnVærtIOmsorgstilbud === YesOrNo.YES && (
                        <FormBlock>
                            <OmsorgstilbudIPeriodeSpørsmål
                                visKunEnkeltdager={visKunEnkeltdagerForOmsorgstilbud(periodeFørSøknadsdato)}
                                periode={periodeFørSøknadsdato}
                                tidIOmsorgstilbud={omsorgstilbud.historisk?.enkeltdager || {}}
                                onOmsorgstilbudChanged={() => {
                                    setOmsorgstilbudChanged(true);
                                }}
                            />
                        </FormBlock>
                    )}
                </FormSection>
            )}
            {periodeFraOgMedSøknadsdato && (
                <FormSection
                    title={intlHelper(
                        intl,
                        harBådeHistoriskOgPlanlagt
                            ? 'steg.omsorgstilbud.planlagt.tittel'
                            : 'steg.omsorgstilbud.generelt.tittel'
                    )}>
                    <AppForm.YesOrNoQuestion
                        name={AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud}
                        legend={
                            periodeFørSøknadsdato
                                ? intlHelper(intl, 'steg.omsorgstilbud.skalBarnetIOmsorgstilbud.spm', {
                                      fra: prettifyDateFull(periodeFraOgMedSøknadsdato.from),
                                      til: prettifyDateFull(periodeFraOgMedSøknadsdato.to),
                                  })
                                : intlHelper(intl, 'steg.omsorgstilbud.skalBarnetVæreIOmsorgstilbud.spm')
                        }
                        validate={getYesOrNoValidator()}
                    />

                    {skalBarnIOmsorgstilbud === YesOrNo.YES && omsorgstilbud && (
                        <>
                            <FormBlock>
                                <AppForm.RadioPanelGroup
                                    legend={intlHelper(intl, 'steg.omsorgstilbud.planlagt.vetHvorMye.spm')}
                                    name={AppFormField.omsorgstilbud__planlagt__vetHvorMyeTid}
                                    radios={[
                                        {
                                            label: intlHelper(intl, 'steg.omsorgstilbud.planlagt.vetHvorMye.ja'),
                                            value: VetOmsorgstilbud.VET_ALLE_TIMER,
                                        },
                                        {
                                            label: intlHelper(intl, 'steg.omsorgstilbud.planlagt.vetHvorMye.nei'),
                                            value: VetOmsorgstilbud.VET_IKKE,
                                        },
                                    ]}
                                    validate={getRequiredFieldValidator()}
                                    useTwoColumns={true}
                                    description={
                                        <div style={{ marginTop: '-.5rem' }}>
                                            <FormattedMessage id="steg.omsorgstilbud.planlagt.vetHvorMye.info" />
                                        </div>
                                    }
                                />
                            </FormBlock>

                            {omsorgstilbud.planlagt?.vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE && (
                                <FormBlock>
                                    <AlertStripe type={'info'}>
                                        <FormattedMessage id="steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.alertInfo.nei" />
                                    </AlertStripe>
                                </FormBlock>
                            )}

                            {omsorgstilbud.planlagt?.vetHvorMyeTid === VetOmsorgstilbud.VET_ALLE_TIMER && (
                                <>
                                    {visKunEnkeltdagerForOmsorgstilbud(periodeFraOgMedSøknadsdato) === false && (
                                        <FormBlock>
                                            <AppForm.YesOrNoQuestion
                                                legend={intlHelper(
                                                    intl,
                                                    'steg.omsorgstilbud.planlagt.erLiktHverUke.spm'
                                                )}
                                                name={AppFormField.omsorgstilbud__planlagt__erLiktHverUke}
                                                description={
                                                    <ExpandableInfo
                                                        title={intlHelper(
                                                            intl,
                                                            'steg.omsorgstilbud.planlagt.erLiktHverUke.info.tittel'
                                                        )}>
                                                        <FormattedMessage id="steg.omsorgstilbud.planlagt.erLiktHverUke.info.1" />
                                                        <br />
                                                        <FormattedMessage id="steg.omsorgstilbud.planlagt.erLiktHverUke.info.2" />
                                                    </ExpandableInfo>
                                                }
                                                validate={getYesOrNoValidator()}
                                            />
                                        </FormBlock>
                                    )}
                                    {visKunEnkeltdagerForOmsorgstilbud(periodeFraOgMedSøknadsdato) === false &&
                                        omsorgstilbud.planlagt?.erLiktHverUke === YesOrNo.YES && (
                                            <>
                                                <FormBlock>
                                                    <AppForm.InputGroup
                                                        legend={intlHelper(
                                                            intl,
                                                            'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud'
                                                        )}
                                                        description={
                                                            <ExpandableInfo
                                                                title={intlHelper(
                                                                    intl,
                                                                    'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel'
                                                                )}>
                                                                {intlHelper(
                                                                    intl,
                                                                    'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description'
                                                                )}
                                                            </ExpandableInfo>
                                                        }
                                                        validate={() => validateSkalIOmsorgstilbud(omsorgstilbud)}
                                                        name={'omsorgstilbud_gruppe' as any}>
                                                        <TidFasteDagerInput
                                                            name={AppFormField.omsorgstilbud__planlagt__fasteDager}
                                                            validator={getOmsorgstilbudtimerValidatorEnDag}
                                                        />
                                                    </AppForm.InputGroup>
                                                </FormBlock>
                                            </>
                                        )}
                                    {(visKunEnkeltdagerForOmsorgstilbud(periodeFraOgMedSøknadsdato) === true ||
                                        omsorgstilbud.planlagt?.erLiktHverUke === YesOrNo.NO) && (
                                        <>
                                            <FormBlock>
                                                <OmsorgstilbudIPeriodeSpørsmål
                                                    visKunEnkeltdager={visKunEnkeltdagerForOmsorgstilbud(
                                                        periodeFraOgMedSøknadsdato
                                                    )}
                                                    periode={periodeFraOgMedSøknadsdato}
                                                    tidIOmsorgstilbud={omsorgstilbud.planlagt.enkeltdager || {}}
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
                </FormSection>
            )}
        </FormikStep>
    );
};

export default OmsorgstilbudStep;
