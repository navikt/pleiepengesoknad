import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import TidKalenderForm from '../../components/tid-kalender-form/TidKalenderForm';
import { DatoTidMap } from '../../types';
import { getArbeidstimerEnkeltdagValidator } from '../../validation/validateArbeidFields';
import { ArbeidIPeriodeIntlValues } from '../../søknad/arbeid-i-periode-steps/ArbeidIPeriodeSpørsmål';

interface Props {
    periode: DateRange;
    tid: DatoTidMap;
    intlValues: ArbeidIPeriodeIntlValues;
    erHistorisk: boolean;
    onSubmit: (tid: DatoTidMap) => void;
    onCancel: () => void;
}

const ArbeidstidMånedForm: React.FunctionComponent<Props> = ({
    periode,
    erHistorisk,
    intlValues,
    tid,
    onCancel,
    onSubmit,
}) => {
    const intl = useIntl();
    return (
        <TidKalenderForm
            periode={periode}
            tid={tid}
            tittel={
                <FormattedMessage
                    id="arbeidstid.form.tittel"
                    values={{ måned: dayjs(periode.from).format('MMMM YYYY') }}
                />
            }
            intro={
                <>
                    <p>
                        <FormattedMessage
                            id={erHistorisk ? 'arbeidstid.form.intro.historisk' : 'arbeidstid.form.intro.planlagt'}
                        />
                    </p>

                    <ExpandableInfo title={intlHelper(intl, 'arbeidIPeriode.ukedager.info.tittel')}>
                        <FormattedMessage
                            id={
                                erHistorisk
                                    ? 'arbeidstid.form.info.historisk.tekst.1'
                                    : 'arbeidstid.form.info.planlagt.tekst.1'
                            }
                            tagName="p"
                        />
                        <FormattedMessage
                            id={
                                erHistorisk
                                    ? 'arbeidstid.form.info.historisk.tekst.2'
                                    : 'arbeidstid.form.info.planlagt.tekst.2'
                            }
                            tagName="p"
                        />
                    </ExpandableInfo>
                </>
            }
            tidPerDagValidator={getArbeidstimerEnkeltdagValidator(intlValues)}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
};

export default ArbeidstidMånedForm;
