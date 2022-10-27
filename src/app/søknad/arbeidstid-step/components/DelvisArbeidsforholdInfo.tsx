import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import React from 'react';
import { gjelderArbeidsforholdHeleSøknadsperioden } from '../utils/arbeidstidUtils';
import { getDelvisAktivtArbeidsforholdInfo } from '../utils/getDelvisAktivtArbeidsforholdInfo';

interface Props {
    søknadsperiode: DateRange;
    arbeidsperiode: DateRange;
    arbeidsforholdType: ArbeidsforholdType;
}

const DelvisArbeidsforholdInfo: React.FunctionComponent<Props> = ({
    søknadsperiode,
    arbeidsforholdType,
    arbeidsperiode,
}) => {
    const delvisAktivtArbeidsforholdInfo =
        gjelderArbeidsforholdHeleSøknadsperioden(søknadsperiode, arbeidsperiode) === false
            ? getDelvisAktivtArbeidsforholdInfo(arbeidsforholdType)
            : undefined;

    if (!delvisAktivtArbeidsforholdInfo) {
        return null;
    }

    return (
        <FormBlock margin="l">
            <ExpandableInfo title={delvisAktivtArbeidsforholdInfo.tittel}>
                {delvisAktivtArbeidsforholdInfo.tekst}
            </ExpandableInfo>
        </FormBlock>
    );
};

export default DelvisArbeidsforholdInfo;
