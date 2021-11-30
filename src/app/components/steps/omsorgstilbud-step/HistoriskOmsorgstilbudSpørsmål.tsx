import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import FormSection from '../../../pre-common/form-section/FormSection';
import { SøknadFormField, Omsorgstilbud } from '../../../types/SøknadFormData';
import AppForm from '../../app-form/AppForm';
import OmsorgstilbudIPeriodeSpørsmål from '../../omsorgstilbud/OmsorgstilbudIPeriodeSpørsmål';

dayjs.extend(isBetween);

interface Props {
    tittel: string;
    periode: DateRange;
    søknadsdato: Date;
    omsorgstilbud?: Omsorgstilbud;
    onOmsorgstilbudChanged: () => void;
}

const HistoriskOmsorgstilbudSpørsmål = ({
    tittel,
    periode,
    omsorgstilbud,
    søknadsdato,
    onOmsorgstilbudChanged,
}: Props) => {
    const intl = useIntl();

    return (
        <FormSection title={tittel}>
            <AppForm.YesOrNoQuestion
                name={SøknadFormField.omsorgstilbud__harBarnVærtIOmsorgstilbud}
                legend={intlHelper(intl, 'steg.omsorgstilbud.historisk.harBarnetVærtIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periode.from),
                    til: prettifyDateFull(periode.to),
                })}
                validate={(value) => {
                    const error = getYesOrNoValidator()(value);
                    if (error) {
                        return {
                            key: error,
                            values: {
                                fra: prettifyDateFull(periode.from),
                                til: prettifyDateFull(periode.to),
                            },
                        };
                    }
                    return undefined;
                }}
            />
            {omsorgstilbud?.harBarnVærtIOmsorgstilbud === YesOrNo.YES && (
                <FormBlock>
                    <ResponsivePanel>
                        <OmsorgstilbudIPeriodeSpørsmål
                            periode={periode}
                            tidIOmsorgstilbud={omsorgstilbud.historisk?.enkeltdager || {}}
                            onOmsorgstilbudChanged={() => {
                                onOmsorgstilbudChanged();
                            }}
                            søknadsdato={søknadsdato}
                        />
                    </ResponsivePanel>
                </FormBlock>
            )}
        </FormSection>
    );
};

export default HistoriskOmsorgstilbudSpørsmål;
