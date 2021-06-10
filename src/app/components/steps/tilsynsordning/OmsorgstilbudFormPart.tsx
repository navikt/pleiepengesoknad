import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { AppFormField, OmsorgstilbudInfo } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import { OmsorgstilbudInlineForm } from '../../omsorgstilbud/OmsorgstilbudForm';
import OmsorgstilbudInfoAndDialog from '../../omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { getMonthsInDateRange } from '../../omsorgstilbud/omsorgstilbudUtils';
import { SkalHaOmsorgstilbudFormField, TidIOmsorgstilbud } from '../../omsorgstilbud/types';
import { getTidIOmsorgstilbudInnenforPeriode } from './tilsynsordningStepUtils';
import './omsorgstilbud.less';
import { getCleanedTidIOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';

interface Props {
    info: OmsorgstilbudInfo;
    søknadsperiode: DateRange;
    spørOmMånedForOmsorgstilbud: boolean;
    tidIOmsorgstilbud: TidIOmsorgstilbud;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({
    info,
    spørOmMånedForOmsorgstilbud,
    søknadsperiode,
    tidIOmsorgstilbud,
    onOmsorgstilbudChanged,
}) => {
    const måneder = info.måneder || [];

    if (spørOmMånedForOmsorgstilbud === false) {
        return (
            <>
                <Undertittel tag="h3">Omsorgstilbud i perioden</Undertittel>
                <AppForm.InputGroup
                    name={`${AppFormField.omsorgstilbud__ja__enkeltdager}_wrapper` as any}
                    tag="div"
                    validate={() => {
                        const omsorgstilbudIPerioden = getTidIOmsorgstilbudInnenforPeriode(
                            tidIOmsorgstilbud,
                            søknadsperiode
                        );
                        const hasElements = Object.keys(getCleanedTidIOmsorgstilbud(omsorgstilbudIPerioden)).length > 0;
                        if (!hasElements) {
                            return {
                                key: `ingenTidRegistrert`,
                            };
                        }
                        return undefined;
                    }}>
                    <OmsorgstilbudInlineForm
                        fieldName={AppFormField.omsorgstilbud__ja__enkeltdager}
                        søknadsperiode={søknadsperiode}
                        ukeTittelRenderer={(info) => (
                            <Element className="omsorgstilbud__uketittel" tag="h4">
                                Uke {info.ukenummer}, {info.år}
                            </Element>
                        )}
                    />
                </AppForm.InputGroup>
            </>
        );
    }
    return (
        <>
            {getMonthsInDateRange(søknadsperiode).map((periode, index) => {
                const { from, to } = periode;
                const mndOgÅr = dayjs(from).format('MMMM YYYY');
                const skalIOmsorgstilbud = måneder[index]?.skalHaOmsorgstilbud === YesOrNo.YES;
                return (
                    <Box key={dayjs(from).format('MM.YYYY')} margin="xl">
                        <FormikYesOrNoQuestion
                            name={`${AppFormField.omsorgstilbud__ja__måneder}.${index}.${SkalHaOmsorgstilbudFormField.skalHaOmsorgstilbud}`}
                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
                            validate={getYesOrNoValidator()}
                        />
                        {skalIOmsorgstilbud && (
                            <FormBlock margin="l">
                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                    <AppForm.InputGroup
                                        /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
                                         * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
                                         * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
                                         * brukt.
                                         * Ikke optimalt, men det virker.
                                         */
                                        name={`${AppFormField.omsorgstilbud__ja__enkeltdager}_${index}` as any}
                                        tag="div"
                                        validate={() => {
                                            const omsorgstilbudIPerioden = getTidIOmsorgstilbudInnenforPeriode(
                                                tidIOmsorgstilbud,
                                                periode
                                            );
                                            const hasElements = Object.keys(omsorgstilbudIPerioden).length > 0;
                                            if (!hasElements) {
                                                return {
                                                    key: `validation.${AppFormField.omsorgstilbud__ja__enkeltdager}.ingenTidRegistrertIMåned`,
                                                    values: {
                                                        måned: dayjs(from).format('MMMM'),
                                                    },
                                                    keepKeyUnaltered: true,
                                                };
                                            }
                                            return undefined;
                                        }}>
                                        <OmsorgstilbudInfoAndDialog
                                            name={AppFormField.omsorgstilbud__ja__enkeltdager}
                                            fraDato={from}
                                            tilDato={to}
                                            skjulTommeDagerIListe={true}
                                            onAfterChange={onOmsorgstilbudChanged}
                                            labels={{
                                                addLabel: `Legg til timer`,
                                                deleteLabel: `Fjern alle timer`,
                                                editLabel: `Registrer tid i omsorgstilbud, ${mndOgÅr}`,
                                                modalTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                            }}
                                        />
                                    </AppForm.InputGroup>
                                </ResponsivePanel>
                            </FormBlock>
                        )}
                    </Box>
                );
            })}
        </>
    );
};

export default OmsorgstilbudFormPart;
