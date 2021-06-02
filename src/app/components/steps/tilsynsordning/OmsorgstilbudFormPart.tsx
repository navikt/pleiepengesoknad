import React, { useEffect, useState } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import OmsorgstilbudInfoAndDialog from '@navikt/sif-common-forms/lib/omsorgstilbud/OmsorgstilbudInfoAndDialog';
import { getMonthsInDateRange } from '@navikt/sif-common-forms/lib/omsorgstilbud/omsorgstilbudUtils';
import {
    OmsorgstilbudFormField,
    OmsorgstilbudPeriodeFormValue,
} from '@navikt/sif-common-forms/lib/omsorgstilbud/types';
import dayjs from 'dayjs';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import AppForm from '../../app-form/AppForm';
import { FormikValues, useFormikContext } from 'formik';

interface Props {
    periodeFra: Date;
    periodeTil: Date;
    omsorgstilbud: OmsorgstilbudPeriodeFormValue[];
    fieldName: string;
}

const getPerioderFromOmsorgstilbud = (
    periodeFra: Date,
    periodeTil: Date,
    omsorgstilbud: OmsorgstilbudPeriodeFormValue[]
): OmsorgstilbudPeriodeFormValue[] => {
    const perioder: OmsorgstilbudPeriodeFormValue[] = [];
    const måneder = getMonthsInDateRange({ from: periodeFra, to: periodeTil });
    måneder.forEach((måned) => {
        const omsorgstilbudForMåned = omsorgstilbud.find((oms) => {
            return dayjs(oms.periode?.from).isSame(måned.from, 'month');
        });
        perioder.push({
            periode: måned,
            skalHaOmsorgstilbud: omsorgstilbudForMåned?.skalHaOmsorgstilbud || YesOrNo.UNANSWERED,
            omsorgsdager: omsorgstilbudForMåned?.omsorgsdager || [],
        });
    });
    return perioder;
};

const useEffectOnce = (callback: any) => {
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if (callback) {
            if (!hasRun) {
                callback();
                setHasRun(true);
            }
        }
    }, [hasRun, callback]);
};

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({
    omsorgstilbud = [],
    fieldName,
    periodeFra,
    periodeTil,
}) => {
    const getFieldName = (field: OmsorgstilbudFormField, index: number): string => `${fieldName}.${index}.${field}`;
    const { setFieldValue } = useFormikContext<FormikValues>();

    useEffectOnce(() => {
        /** Sync omsorgstilbud-perioder med potensielt endrede fradato og tildato for søknaden */
        const perioder = getPerioderFromOmsorgstilbud(periodeFra, periodeTil, omsorgstilbud);
        setFieldValue(fieldName, perioder);
    });

    if (omsorgstilbud.length === 0) {
        return (
            <AlertStripeAdvarsel>
                Perioder for å legge til omsorgstilbud er ikke opprettet - gå tilbake til siden for periode
            </AlertStripeAdvarsel>
        );
    }

    return (
        <>
            {omsorgstilbud.map((periode, index) => {
                const { from, to } = periode.periode;
                const mndOgÅr = dayjs(from).format('MMMM YYYY');
                const skalIOmsorgstilbud = periode.skalHaOmsorgstilbud === YesOrNo.YES;
                return (
                    <Box key={dayjs(from).format('MM.YYYY')} margin="xl">
                        <AppForm.YesOrNoQuestion
                            name={getFieldName(OmsorgstilbudFormField.skalHaOmsorgstilbud, index) as any}
                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
                            validate={(value) => {
                                const error = getYesOrNoValidator()(value);
                                return error
                                    ? {
                                          key: 'validation.tilsynsordning.skalHaOmsorgstilbud.yesOrNoIsUnanswered',
                                          keepKeyUnaltered: true,
                                          values: { måned: mndOgÅr },
                                      }
                                    : undefined;
                            }}
                        />
                        {skalIOmsorgstilbud && (
                            <FormBlock margin="l">
                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                    <OmsorgstilbudInfoAndDialog
                                        name={getFieldName(OmsorgstilbudFormField.omsorgsdager, index)}
                                        fraDato={from}
                                        tilDato={to}
                                        labels={{
                                            addLabel: `Legg til timer`,
                                            deleteLabel: `Fjern alle timer`,
                                            editLabel: periode.omsorgsdager.length === 0 ? `Registrer dager` : 'Endre',
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
