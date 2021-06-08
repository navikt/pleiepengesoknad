import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudInlineForm } from '../../omsorgstilbud/OmsorgstilbudForm';
import OmsorgstilbudInfoAndDialog from '../../omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { getMonthsInDateRange } from '../../omsorgstilbud/omsorgstilbudUtils';
import { SkalHaOmsorgstilbudFormField } from '../../omsorgstilbud/types';
import dayjs from 'dayjs';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { AppFormField, OmsorgstilbudInfo } from '../../../types/PleiepengesøknadFormData';
import './omsorgstilbud.less';

interface Props {
    info: OmsorgstilbudInfo;
    søknadsperiode: DateRange;
    spørOmMånedForOmsorgstilbud: boolean;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({
    info,
    spørOmMånedForOmsorgstilbud,
    søknadsperiode,
}) => {
    const måneder = info.måneder || [];

    if (spørOmMånedForOmsorgstilbud === false) {
        return (
            <>
                <Undertittel tag="h3">Omsorgstilbud i perioden</Undertittel>
                <OmsorgstilbudInlineForm
                    fieldName={AppFormField.omsorgstilbud__ja__enkeltdager}
                    søknadsperiode={søknadsperiode}
                    ukeTittelRenderer={(info) => (
                        <Element className="omsorgstilbud__uketittel" tag="h4">
                            Uke {info.ukenummer}, {info.år}
                        </Element>
                    )}
                />
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
                        />
                        {skalIOmsorgstilbud && (
                            <FormBlock margin="l">
                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                    <OmsorgstilbudInfoAndDialog
                                        name={AppFormField.omsorgstilbud__ja__enkeltdager}
                                        fraDato={from}
                                        tilDato={to}
                                        skjulTommeDagerIListe={true}
                                        labels={{
                                            addLabel: `Legg til timer`,
                                            deleteLabel: `Fjern alle timer`,
                                            editLabel: `Registrer tid i omsorgstilbud`,
                                            modalTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                        }}
                                    />
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
