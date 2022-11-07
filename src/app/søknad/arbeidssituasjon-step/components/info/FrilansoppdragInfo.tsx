import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import { FrilansFormData } from '../../../../types/FrilansFormData';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../../types/ArbeidsforholdFormValues';

interface Props {
    frilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[];
    formValues: FrilansFormData;
    parentFieldName: string;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({
    frilansoppdrag,
    parentFieldName,
    formValues,
    søknadsperiode,
    søknadsdato,
}) => (
    <Box padBottom="m">
        <Box>
            <p>
                <FormattedMessage id={'frilansoppdragListe.oppdrag.info'} />
            </p>
        </Box>
        <FrilansoppdragListe
            frilansoppdrag={frilansoppdrag}
            parentFieldName={parentFieldName}
            formValues={formValues}
            søknadsperiode={søknadsperiode}
            søknadsdato={søknadsdato}
        />
    </Box>
);

export default FrilansoppdragInfo;
