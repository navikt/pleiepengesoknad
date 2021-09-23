import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { TidsbrukDag } from '../../types';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { getMonthsInDateRange } from '../../utils/dateUtils';
import { getCleanedTidIOmsorgstilbud } from '../../utils/omsorgstilbudUtils';
import { getTidIOmsorgValidator } from '../../validation/fieldValidations';
import AppForm from '../app-form/AppForm';
import { getTidIOmsorgstilbudInnenforPeriode } from '../steps/omsorgstilbud-step/omsorgstilbudStepUtils';
import TidUkerInput from '../tid-uker-input/TidUkerInput';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';

interface Props {
    periode: DateRange;
    visKunEnkeltdager: boolean;
    tidIOmsorgstilbud: TidsbrukDag;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudIPeriodeSpørsmål: React.FunctionComponent<Props> = ({
    visKunEnkeltdager,
    periode,
    tidIOmsorgstilbud,
    onOmsorgstilbudChanged,
}) => {
    const intl = useIntl();
    const gjelderFortid = dayjs(periode.to).isBefore(dateToday, 'day');

    const enkeltdagerFieldName = gjelderFortid
        ? AppFormField.omsorgstilbud__historisk__enkeltdager
        : AppFormField.omsorgstilbud__planlagt__enkeltdager;

    return (
        <AppForm.InputGroup
            /** På grunn av at dialogen jobber mot ett felt i formik, kan ikke
             * validate på dialogen brukes. Da vil siste periode alltid bli brukt ved validering.
             * Derfor wrappes dialogen med denne komponenten, og et unikt name brukes - da blir riktig periode
             * brukt.
             * Ikke optimalt, men det virker.
             */
            legend={intlHelper(
                intl,
                gjelderFortid
                    ? 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud'
                    : 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud'
            )}
            name={`${enkeltdagerFieldName}_dager` as any}
            tag="div"
            description={
                <ExpandableInfo
                    title={intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel')}>
                    {intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description')}
                </ExpandableInfo>
            }
            validate={() => {
                const omsorgstilbudIPerioden = getTidIOmsorgstilbudInnenforPeriode(tidIOmsorgstilbud, periode);
                const hasElements = Object.keys(getCleanedTidIOmsorgstilbud(omsorgstilbudIPerioden)).length > 0;
                if (!hasElements) {
                    return {
                        key: gjelderFortid
                            ? `validation.${AppFormField.omsorgstilbud__historisk__enkeltdager}.ingenTidRegistrert`
                            : `validation.${AppFormField.omsorgstilbud__planlagt__enkeltdager}.ingenTidRegistrert`,
                        keepKeyUnaltered: true,
                    };
                }
                return undefined;
            }}>
            {visKunEnkeltdager && (
                <TidUkerInput
                    periode={periode}
                    fieldName={enkeltdagerFieldName}
                    tidPerDagValidator={getTidIOmsorgValidator}
                />
            )}
            {visKunEnkeltdager === false && (
                <>
                    {getMonthsInDateRange(periode).map((periode, index) => {
                        const mndOgÅr = dayjs(periode.from).format('MMMM YYYY');
                        return (
                            <Box key={dayjs(periode.from).format('MM.YYYY')} margin="l">
                                <ResponsivePanel className={'noPanelPaddingDialogWrapper'}>
                                    <AppForm.InputGroup name={`${enkeltdagerFieldName}_${index}` as any} tag="div">
                                        <OmsorgstilbudInfoAndDialog
                                            name={enkeltdagerFieldName}
                                            periode={periode}
                                            skjulTommeDagerIListe={true}
                                            onAfterChange={onOmsorgstilbudChanged}
                                            labels={{
                                                addLabel: intlHelper(intl, 'omsorgstilbud.addLabel', {
                                                    periode: mndOgÅr,
                                                }),
                                                deleteLabel: intlHelper(intl, 'omsorgstilbud.deleteLabel', {
                                                    periode: mndOgÅr,
                                                }),
                                                editLabel: intlHelper(intl, 'omsorgstilbud.editLabel', {
                                                    periode: mndOgÅr,
                                                }),
                                                modalTitle: intlHelper(intl, 'omsorgstilbud.modalTitle', {
                                                    periode: mndOgÅr,
                                                }),
                                            }}
                                        />
                                    </AppForm.InputGroup>
                                </ResponsivePanel>
                            </Box>
                        );
                    })}
                </>
            )}
        </AppForm.InputGroup>
    );
};

export default OmsorgstilbudIPeriodeSpørsmål;
