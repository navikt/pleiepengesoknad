import { mapAAregArbeidsgiverRemoteDataToArbeidsiver } from './../søknad/arbeidssituasjon-step/utils/getArbeidsgivere';
import { getArbeidsgiver } from './../api/api';
import { DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Arbeidsgiver } from './../types/Arbeidsgiver';
import { useState } from 'react';
import { dateRangeToISODateRange } from '@navikt/sif-common-utils/lib';
import { usePrevious } from './usePrevious';

function useArbeidsgivereISøknadsperiode() {
    const [søknadsperiode, setSøknadsperiode] = useState<DateRange>();
    const [arbeidsgivere, setArbeidsgivere] = useState<Arbeidsgiver[] | undefined>();

    const previousSøknadsperiode = usePrevious(søknadsperiode);

    const fetchArbeidsgivere = async (periode: DateRange) => {
        if (periode) {
            const response = await getArbeidsgiver(
                formatDateToApiFormat(periode.from),
                formatDateToApiFormat(periode.to)
            );
            const arbeidsgivere = mapAAregArbeidsgiverRemoteDataToArbeidsiver(response.data);
            setArbeidsgivere(arbeidsgivere);
        }
    };

    const updateSøknadsperiode = (periode: DateRange) => {
        if (periode) {
            if (
                previousSøknadsperiode === undefined ||
                dateRangeToISODateRange(periode) !== dateRangeToISODateRange(previousSøknadsperiode)
            ) {
                setSøknadsperiode(periode);
                fetchArbeidsgivere(periode);
            }
        }
    };

    return { arbeidsgivere, setSøknadsperiode: updateSøknadsperiode };
}

export default useArbeidsgivereISøknadsperiode;
