import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidsgiverApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidsgivereSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsgiverApiDataFromSøknadsdata } from './getArbeidsgiverApiDataFromSøknadsdata';

export const getArbeidsgivereApiDataFromSøknadsdata = (
    arbeidsgivere: ArbeidsgivereSøknadsdata | undefined,
    søknadsperiode: DateRange
): ArbeidsgiverApiData[] => {
    if (!arbeidsgivere || arbeidsgivere.size === 0) {
        return [];
    }
    const arbeidsgivereApiData: ArbeidsgiverApiData[] = [];
    arbeidsgivere.forEach((arbeidsgiver) => {
        arbeidsgivereApiData.push(getArbeidsgiverApiDataFromSøknadsdata(arbeidsgiver, søknadsperiode));
    });
    return arbeidsgivereApiData;
};
