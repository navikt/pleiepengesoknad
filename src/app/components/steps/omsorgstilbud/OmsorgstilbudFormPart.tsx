import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { Element } from 'nav-frontend-typografi';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { getCleanedTidIOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';
import AppForm from '../../app-form/AppForm';
import OmsorgstilbudInfoAndDialog from '../../omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { getMonthsInDateRange } from '../../omsorgstilbud/omsorgstilbudUtils';
import OmsorgstilbudInlineForm from '../../omsorgstilbud/omsorgtilbudForm/OmsorgstilbudInlineForm';
import { TidIOmsorgstilbud } from '../../omsorgstilbud/types';
import { getTidIOmsorgstilbudInnenforPeriode } from './omsorgstilbudStepUtils';
import './omsorgstilbud.less';

interface Props {
    periode: DateRange;
    visKunEnkeltdager: boolean;
    tidIOmsorgstilbud: TidIOmsorgstilbud;
    onOmsorgstilbudChanged?: () => void;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({
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

    if (visKunEnkeltdager) {
        return (
            <>
                {enkeltdagerFieldName}
                {/* <Info /> */}
                <AppForm.InputGroup
                    name={`${enkeltdagerFieldName}_gruppe` as any}
                    tag="div"
                    legend={intlHelper(
                        intl,
                        gjelderFortid
                            ? 'steg.omsorgstilbud.historisk.hvorMyeTidIOmsorgstilbud'
                            : 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud'
                    )}
                    description={
                        <ExpandableInfo
                            title={intlHelper(
                                intl,
                                'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel'
                            )}>
                            {intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description')}
                        </ExpandableInfo>
                    }
                    validate={() => {
                        const omsorgstilbudIPerioden = getTidIOmsorgstilbudInnenforPeriode(tidIOmsorgstilbud, periode);
                        const hasElements = Object.keys(getCleanedTidIOmsorgstilbud(omsorgstilbudIPerioden)).length > 0;
                        if (!hasElements) {
                            return {
                                key: gjelderFortid ? `ingenTidRegistrert` : 'ingenTidRegistrert',
                            };
                        }
                        return undefined;
                    }}>
                    <OmsorgstilbudInlineForm
                        fieldName={enkeltdagerFieldName}
                        søknadsperiode={periode}
                        ukeTittelRenderer={(ukeinfo) => (
                            <Element className="omsorgstilbud__uketittel" tag="h4">
                                <FormattedMessage
                                    id="steg.omsorgstilbud.omsorgstilbud.uketittel"
                                    values={{ ukenummer: ukeinfo.ukenummer, år: ukeinfo.år }}
                                />
                            </Element>
                        )}
                    />
                </AppForm.InputGroup>
            </>
        );
    }

    return (
        <>
            {enkeltdagerFieldName}
            {/* <Info /> */}
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
                description={
                    <ExpandableInfo
                        title={intlHelper(
                            intl,
                            'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description.tittel'
                        )}>
                        {intlHelper(intl, 'steg.omsorgstilbud.planlagt.hvorMyeTidIOmsorgstilbud.description')}
                    </ExpandableInfo>
                }
                name={`${enkeltdagerFieldName}_dager` as any}
                tag="div"
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
                {getMonthsInDateRange(periode).map((periode, index) => {
                    const { from, to } = periode;
                    const mndOgÅr = dayjs(from).format('MMMM YYYY');
                    return (
                        <Box key={dayjs(from).format('MM.YYYY')} margin="l">
                            <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                <AppForm.InputGroup name={`${enkeltdagerFieldName}_${index}` as any} tag="div">
                                    <OmsorgstilbudInfoAndDialog
                                        name={enkeltdagerFieldName}
                                        fraDato={from}
                                        tilDato={to}
                                        skjulTommeDagerIListe={true}
                                        onAfterChange={onOmsorgstilbudChanged}
                                        labels={{
                                            addLabel: `Registrer tid`,
                                            deleteLabel: `Fjern alle timer`,
                                            editLabel: `Endre`,
                                            modalTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                        }}
                                    />
                                </AppForm.InputGroup>
                            </ResponsivePanel>
                        </Box>
                    );
                })}
            </AppForm.InputGroup>
        </>
    );
};

export default OmsorgstilbudFormPart;
